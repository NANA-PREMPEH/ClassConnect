/**
 * ClassConnect - Intelligent Grading Engine
 * Grades mixed-format assessments with rubric alignment and AI enhancement.
 */

import { getApiKey } from './storage.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, precision = 2) {
  return Math.round(value * (10 ** precision)) / (10 ** precision);
}

function tokenize(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function countKeywordHits(tokens, keywords = []) {
  if (!keywords.length) return 0;
  return keywords.reduce((sum, keyword) => (
    tokens.includes(String(keyword).toLowerCase()) ? sum + 1 : sum
  ), 0);
}

function buildFeedback(summaryParts) {
  return summaryParts.filter(Boolean).join(' ');
}

async function callGemini(prompt) {
  const apiKey = getApiKey();
  if (!apiKey || !navigator.onLine) return null;

  try {
    const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 400,
          topP: 0.85
        }
      }),
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const jsonText = text.includes('{')
      ? text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)
      : text;

    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

function fallbackRubricGrade(question, responseText) {
  const maxScore = question.maxScore || question.rubric?.reduce((sum, criterion) => sum + criterion.points, 0) || 5;
  const trimmed = responseText.trim();
  if (!trimmed) {
    return {
      score: 0,
      maxScore,
      rubricBreakdown: (question.rubric || []).map((criterion) => ({
        criterion: criterion.criterion,
        score: 0,
        maxScore: criterion.points,
        evidence: 'No evidence yet.'
      })),
      feedback: 'No response was submitted for this question.',
      source: 'fallback'
    };
  }

  const tokens = tokenize(trimmed);
  const hasCodeShape = /function|return|if|const|let|=>/i.test(trimmed);
  const rubricBreakdown = (question.rubric || []).map((criterion) => {
    const keywordHits = countKeywordHits(tokens, criterion.keywords);
    const keywordRatio = criterion.keywords?.length ? keywordHits / criterion.keywords.length : 0.6;
    let score = criterion.keywords?.length
      ? Math.round(clamp(keywordRatio, 0, 1) * criterion.points)
      : Math.ceil(criterion.points * 0.6);

    if (question.type === 'code' && hasCodeShape && /function|return/i.test(trimmed) && /Programming structure/i.test(criterion.description)) {
      score = Math.max(score, Math.ceil(criterion.points * 0.75));
    }

    score = clamp(score, 0, criterion.points);

    return {
      criterion: criterion.criterion,
      score,
      maxScore: criterion.points,
      evidence: keywordHits > 0
        ? `Matched ${keywordHits} expected concept${keywordHits === 1 ? '' : 's'}.`
        : 'Only partial evidence of the expected concept.'
    };
  });

  let score = rubricBreakdown.reduce((sum, criterion) => sum + criterion.score, 0);
  if (tokens.length > 24 && score < maxScore) {
    score = Math.min(maxScore, score + 1);
  }

  const feedback = buildFeedback([
    score >= maxScore * 0.8 ? 'Strong response.' : 'This response shows some understanding but still needs refinement.',
    question.type === 'code'
      ? 'Check that the code logic matches the lesson rule and that the function returns the expected values.'
      : 'Use more precise lesson vocabulary and include the key concept directly in your explanation.'
  ]);

  return {
    score: clamp(score, 0, maxScore),
    maxScore,
    rubricBreakdown,
    feedback,
    source: 'fallback'
  };
}

async function gradeOpenEndedQuestion(question, responseText) {
  const maxScore = question.maxScore || question.rubric?.reduce((sum, criterion) => sum + criterion.points, 0) || 5;
  const aiPrompt = [
    'You are grading a Basic 7 Computing assessment.',
    'Return valid JSON only with keys: score, feedback, rubricBreakdown.',
    `Question type: ${question.type}`,
    `Prompt: ${question.prompt}`,
    `Sample answer: ${question.sampleSolution || question.answerKey || ''}`,
    `Rubric: ${JSON.stringify(question.rubric || [])}`,
    `Student response: ${responseText}`,
    `Maximum score: ${maxScore}`
  ].join('\n');

  const aiResult = await callGemini(aiPrompt);
  if (aiResult && Number.isFinite(aiResult.score)) {
    return {
      score: clamp(Math.round(aiResult.score), 0, maxScore),
      maxScore,
      rubricBreakdown: Array.isArray(aiResult.rubricBreakdown) && aiResult.rubricBreakdown.length > 0
        ? aiResult.rubricBreakdown.map((criterion) => ({
          criterion: criterion.criterion || 'Quality',
          score: clamp(Math.round(criterion.score || 0), 0, Number.isFinite(criterion.maxScore) ? criterion.maxScore : maxScore),
          maxScore: Number.isFinite(criterion.maxScore) ? criterion.maxScore : maxScore,
          evidence: criterion.evidence || ''
        }))
        : [],
      feedback: aiResult.feedback || 'AI grading completed.',
      source: 'ai'
    };
  }

  return fallbackRubricGrade(question, responseText);
}

function gradeMCQQuestion(question, answer) {
  const correct = Number.parseInt(answer?.selectedIndex, 10) === question.correctIndex;
  return {
    score: correct ? (question.maxScore || 1) : 0,
    maxScore: question.maxScore || 1,
    rubricBreakdown: [{
      criterion: 'Correct answer',
      score: correct ? (question.maxScore || 1) : 0,
      maxScore: question.maxScore || 1,
      evidence: correct ? 'Correct option selected.' : 'Incorrect option selected.'
    }],
    feedback: correct
      ? 'Correct. You selected the best answer for this concept.'
      : `Review this concept and compare your answer with the correct option: ${question.answerKey}.`,
    source: 'system'
  };
}

export async function gradeAssessmentSubmission({ assessment, answers }) {
  const questionScores = [];

  for (const question of assessment.questions) {
    const answer = answers.find((entry) => entry.questionId === question.id) || {};
    let gradeResult = null;

    if (question.type === 'mcq') {
      gradeResult = gradeMCQQuestion(question, answer);
    } else {
      gradeResult = await gradeOpenEndedQuestion(question, answer.responseText || '');
    }

    const normalizedScore = gradeResult.maxScore > 0 ? gradeResult.score / gradeResult.maxScore : 0;
    questionScores.push({
      questionId: question.id,
      prompt: question.prompt,
      lessonId: question.lessonId,
      objective: question.objective,
      type: question.type,
      score: gradeResult.score,
      maxScore: gradeResult.maxScore,
      normalizedScore: round(normalizedScore),
      feedback: gradeResult.feedback,
      rubricBreakdown: gradeResult.rubricBreakdown,
      gradingSource: gradeResult.source,
      flaggedForReview: question.type !== 'mcq' && gradeResult.source === 'fallback' && normalizedScore >= 0.4 && normalizedScore <= 0.7,
      answerPreview: question.type === 'mcq' ? answer.selectedIndex : (answer.responseText || '')
    });
  }

  const totalScore = questionScores.reduce((sum, entry) => sum + entry.score, 0);
  const maxScore = questionScores.reduce((sum, entry) => sum + entry.maxScore, 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const weakObjectives = questionScores
    .filter((entry) => entry.normalizedScore < 0.6)
    .map((entry) => ({
      lessonId: entry.lessonId,
      objective: entry.objective,
      questionId: entry.questionId,
      reason: entry.feedback
    }));

  const strengths = questionScores
    .filter((entry) => entry.normalizedScore >= 0.8)
    .map((entry) => ({
      lessonId: entry.lessonId,
      objective: entry.objective,
      questionId: entry.questionId
    }));

  const remediationPlan = weakObjectives.slice(0, 4).map((entry) => ({
    lessonId: entry.lessonId,
    objective: entry.objective,
    action: `Review this objective again and retry a similar ${questionScores.find((score) => score.questionId === entry.questionId)?.type || 'assessment'} question.`
  }));

  return {
    totalScore,
    maxScore,
    percentage,
    questionScores,
    weakObjectives,
    strengths,
    remediationPlan
  };
}
