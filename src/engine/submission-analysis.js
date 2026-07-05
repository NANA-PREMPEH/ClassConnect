/**
 * ClassConnect - Submission Integrity Analysis
 * Estimates AI/plagiarism risk using writing-style consistency and perplexity-like heuristics.
 */

function round(value, precision = 2) {
  return Math.round(value * (10 ** precision)) / (10 ** precision);
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function tokenize(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function splitSentences(text = '') {
  return text
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function variance(values) {
  if (values.length < 2) return 0;
  const mean = average(values);
  return average(values.map((value) => (value - mean) ** 2));
}

function jaccard(leftTokens, rightTokens) {
  const left = new Set(leftTokens);
  const right = new Set(rightTokens);
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;
  return union > 0 ? intersection / union : 0;
}

function computeEntropy(tokens) {
  if (!tokens.length) return 0;
  const counts = new Map();
  tokens.forEach((token) => {
    counts.set(token, (counts.get(token) || 0) + 1);
  });

  return [...counts.values()].reduce((sum, count) => {
    const probability = count / tokens.length;
    return sum - (probability * Math.log2(probability));
  }, 0);
}

function computeWritingMetrics(text) {
  const tokens = tokenize(text);
  const sentences = splitSentences(text);
  const sentenceLengths = sentences.map((sentence) => tokenize(sentence).length).filter(Boolean);
  const uniqueWordCount = new Set(tokens).size;
  const lexicalDiversity = tokens.length > 0 ? uniqueWordCount / tokens.length : 0;
  const avgSentenceLength = sentenceLengths.length > 0 ? average(sentenceLengths) : tokens.length;
  const burstiness = sentenceLengths.length > 1 ? variance(sentenceLengths) / Math.max(1, avgSentenceLength) : 0;
  const entropy = computeEntropy(tokens);
  const perplexityProxy = tokens.length > 0 ? 2 ** entropy : 0;
  const templatePhraseCount = (text.match(/\b(overall|in conclusion|therefore|moreover|furthermore|additionally)\b/gi) || []).length;

  return {
    tokenCount: tokens.length,
    sentenceCount: sentences.length,
    lexicalDiversity: round(lexicalDiversity),
    averageSentenceLength: round(avgSentenceLength),
    burstiness: round(burstiness),
    perplexityProxy: round(perplexityProxy),
    templatePhraseCount
  };
}

function extractResponseText(answer) {
  return typeof answer.responseText === 'string' ? answer.responseText.trim() : '';
}

function summarizeHistoricalSamples(priorSubmissions = []) {
  const texts = priorSubmissions
    .flatMap((submission) => submission.answers || [])
    .map(extractResponseText)
    .filter((text) => text.length > 0);

  const metrics = texts.map(computeWritingMetrics);
  return {
    texts,
    avgLexicalDiversity: average(metrics.map((entry) => entry.lexicalDiversity)),
    avgSentenceLength: average(metrics.map((entry) => entry.averageSentenceLength))
  };
}

export function analyzeAssessmentIntegrity({ answers, priorSubmissions = [] }) {
  const openResponses = answers
    .filter((answer) => answer.type === 'short' || answer.type === 'code')
    .map((answer) => ({
      questionId: answer.questionId,
      type: answer.type,
      text: extractResponseText(answer)
    }))
    .filter((entry) => entry.text.length > 0);

  const metricsPerResponse = openResponses.map((entry) => ({
    ...entry,
    metrics: computeWritingMetrics(entry.text)
  }));
  const historical = summarizeHistoricalSamples(priorSubmissions);
  const overallLexicalDiversity = average(metricsPerResponse.map((entry) => entry.metrics.lexicalDiversity));
  const overallSentenceLength = average(metricsPerResponse.map((entry) => entry.metrics.averageSentenceLength));
  const overallBurstiness = average(metricsPerResponse.map((entry) => entry.metrics.burstiness));
  const overallPerplexity = average(metricsPerResponse.map((entry) => entry.metrics.perplexityProxy));
  const templatePhraseCount = metricsPerResponse.reduce((sum, entry) => sum + entry.metrics.templatePhraseCount, 0);
  const pairSimilarities = [];

  for (let index = 0; index < metricsPerResponse.length; index += 1) {
    for (let inner = index + 1; inner < metricsPerResponse.length; inner += 1) {
      pairSimilarities.push(jaccard(tokenize(metricsPerResponse[index].text), tokenize(metricsPerResponse[inner].text)));
    }
  }

  const internalSimilarity = average(pairSimilarities);
  const styleShift = historical.texts.length > 0
    ? Math.abs(overallLexicalDiversity - historical.avgLexicalDiversity) + (Math.abs(overallSentenceLength - historical.avgSentenceLength) / 20)
    : 0;
  const historicalOverlap = historical.texts.length > 0 && openResponses.length > 0
    ? Math.max(...openResponses.map((response) => Math.max(...historical.texts.map((sample) => jaccard(tokenize(response.text), tokenize(sample))), 0)), 0)
    : 0;

  let score = 0;
  const reasons = [];
  const flaggedSegments = [];

  if (openResponses.length === 0) {
    return {
      score: 0,
      label: 'Low',
      reasons: ['No open-ended writing to analyze.'],
      metrics: {
        lexicalDiversity: 0,
        averageSentenceLength: 0,
        burstiness: 0,
        perplexityProxy: 0,
        internalSimilarity: 0,
        historicalOverlap: 0
      },
      flaggedSegments
    };
  }

  if (overallLexicalDiversity > 0.62 && overallBurstiness < 1.2) {
    score += 18;
    reasons.push('Writing is unusually uniform across responses.');
  }

  if (overallPerplexity > 35 && overallBurstiness < 1.4) {
    score += 16;
    reasons.push('Perplexity proxy suggests highly polished and predictable wording.');
  }

  if (templatePhraseCount >= 2) {
    score += 10;
    reasons.push('Several template-like transition phrases were reused.');
  }

  if (internalSimilarity > 0.45) {
    score += 18;
    reasons.push('Multiple answers reuse very similar vocabulary patterns.');
  }

  if (styleShift > 0.35) {
    score += 22;
    reasons.push('Writing style differs noticeably from the student’s earlier responses.');
  }

  if (historicalOverlap > 0.75) {
    score += 20;
    reasons.push('One or more answers overlap heavily with earlier saved writing.');
  }

  metricsPerResponse.forEach((entry) => {
    if (entry.metrics.burstiness < 0.5 && entry.metrics.tokenCount > 30) {
      flaggedSegments.push({
        questionId: entry.questionId,
        reason: 'Low burstiness and long response length.'
      });
    }
  });

  const normalizedScore = Math.min(100, Math.round(score));
  const label = normalizedScore >= 65 ? 'High' : normalizedScore >= 35 ? 'Moderate' : 'Low';

  if (!reasons.length) {
    reasons.push('Writing patterns look reasonably consistent.');
  }

  return {
    score: normalizedScore,
    label,
    reasons,
    metrics: {
      lexicalDiversity: round(overallLexicalDiversity),
      averageSentenceLength: round(overallSentenceLength),
      burstiness: round(overallBurstiness),
      perplexityProxy: round(overallPerplexity),
      internalSimilarity: round(internalSimilarity),
      historicalOverlap: round(historicalOverlap),
      styleShift: round(styleShift)
    },
    flaggedSegments
  };
}
