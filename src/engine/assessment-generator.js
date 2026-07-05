/**
 * ClassConnect - Assessment Generator
 * Builds mixed-format assessments from lesson objectives with AI enhancement and offline fallbacks.
 */

import { lessons } from '../data/lessons.js';
import { quizBank } from '../data/quiz-bank.js';
import { getApiKey } from './storage.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const codingTemplatesByLesson = {
  1: {
    prompt: 'Write a JavaScript function named `isPortableComputer(type)` that returns `true` for portable computers like a laptop, tablet, or smartphone, and `false` for a desktop or server.',
    starterCode: 'function isPortableComputer(type) {\n  // your code here\n}\n',
    keyConcepts: ['function', 'return', 'laptop', 'tablet', 'smartphone', 'desktop', 'server'],
    sampleSolution: 'function isPortableComputer(type) {\n  const portable = [\'laptop\', \'tablet\', \'smartphone\'];\n  return portable.includes(String(type).toLowerCase());\n}\n'
  },
  2: {
    prompt: 'Write a JavaScript function named `classifyMemory(part)` that returns `"temporary"` for RAM and `"permanent"` for ROM. For any other part, return `"unknown"`.',
    starterCode: 'function classifyMemory(part) {\n  // your code here\n}\n',
    keyConcepts: ['function', 'return', 'ram', 'rom', 'temporary', 'permanent', 'unknown'],
    sampleSolution: 'function classifyMemory(part) {\n  const normalized = String(part).toLowerCase();\n  if (normalized === \'ram\') return \'temporary\';\n  if (normalized === \'rom\') return \'permanent\';\n  return \'unknown\';\n}\n'
  },
  3: {
    prompt: 'Write a JavaScript function named `isInputDevice(device)` that returns `true` for keyboard, mouse, microphone, scanner, or webcam, and `false` otherwise.',
    starterCode: 'function isInputDevice(device) {\n  // your code here\n}\n',
    keyConcepts: ['function', 'return', 'keyboard', 'mouse', 'microphone', 'scanner', 'webcam'],
    sampleSolution: 'function isInputDevice(device) {\n  const inputs = [\'keyboard\', \'mouse\', \'microphone\', \'scanner\', \'webcam\'];\n  return inputs.includes(String(device).toLowerCase());\n}\n'
  },
  4: {
    prompt: 'Write a JavaScript function named `deviceRole(device)` that returns `"output"` for monitor, speaker, or printer, `"io"` for touchscreen, and `"unknown"` for anything else.',
    starterCode: 'function deviceRole(device) {\n  // your code here\n}\n',
    keyConcepts: ['function', 'return', 'monitor', 'speaker', 'printer', 'touchscreen', 'output', 'io', 'unknown'],
    sampleSolution: 'function deviceRole(device) {\n  const normalized = String(device).toLowerCase();\n  if ([\'monitor\', \'speaker\', \'printer\'].includes(normalized)) return \'output\';\n  if (normalized === \'touchscreen\') return \'io\';\n  return \'unknown\';\n}\n'
  },
  5: {
    prompt: 'Write a JavaScript function named `recommendStorage(needsSpeed, needsLowCost)` that returns `"SSD"` when speed matters most, `"HDD"` when lower cost matters most, and `"Flash Drive"` when both values are false.',
    starterCode: 'function recommendStorage(needsSpeed, needsLowCost) {\n  // your code here\n}\n',
    keyConcepts: ['function', 'return', 'ssd', 'hdd', 'flash', 'if'],
    sampleSolution: 'function recommendStorage(needsSpeed, needsLowCost) {\n  if (needsSpeed) return \'SSD\';\n  if (needsLowCost) return \'HDD\';\n  return \'Flash Drive\';\n}\n'
  }
};

function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sampleWithoutReplacement(items, count) {
  const pool = items.slice();
  const selected = [];
  while (pool.length > 0 && selected.length < count) {
    selected.push(pool.shift());
  }
  return selected;
}

function getLessonPool(lessonIds) {
  const selected = lessons.filter((lesson) => lessonIds.includes(lesson.id));
  return selected.length > 0 ? selected : lessons.slice(0, 2);
}

function extractJsonObject(text = '') {
  const fenceMatch = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenceMatch?.[1]) {
    return fenceMatch[1].trim();
  }

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return text.slice(start, end + 1);
  }

  return text;
}

function normalizeAIQuestion(question, index, fallbackLessonIds) {
  const type = ['mcq', 'short', 'code'].includes(question.type) ? question.type : 'short';
  const lessonId = fallbackLessonIds.includes(question.lessonId) ? question.lessonId : fallbackLessonIds[0];
  const maxScore = Number.isFinite(question.maxScore) ? question.maxScore : (type === 'mcq' ? 1 : 5);
  const rubric = Array.isArray(question.rubric) && question.rubric.length > 0
    ? question.rubric.map((criterion) => ({
      criterion: criterion.criterion || 'Quality',
      description: criterion.description || 'Addresses the prompt clearly.',
      points: Number.isFinite(criterion.points) ? criterion.points : 2,
      keywords: Array.isArray(criterion.keywords) ? criterion.keywords : []
    }))
    : [{
      criterion: 'Accuracy',
      description: 'Uses correct subject knowledge.',
      points: maxScore,
      keywords: []
    }];

  return {
    id: `GEN-Q${index + 1}`,
    type,
    lessonId,
    objective: question.objective || 'Generated from lesson objectives',
    prompt: question.prompt || question.stem || `Generated question ${index + 1}`,
    options: type === 'mcq' && Array.isArray(question.options) && question.options.length === 4 ? question.options : undefined,
    correctIndex: type === 'mcq' && Number.isInteger(question.correctIndex) ? question.correctIndex : undefined,
    starterCode: type === 'code' ? (question.starterCode || '') : undefined,
    answerKey: question.answerKey || '',
    sampleSolution: question.sampleSolution || '',
    rubric,
    maxScore
  };
}

function createShortAnswerQuestion(lesson, objective, index) {
  const keyTerms = (lesson.keyTerms || []).slice(0, 3);
  const keywords = keyTerms.map((term) => term.word.toLowerCase());
  const prompt = `In 3-5 sentences, ${objective.charAt(0).toLowerCase()}${objective.slice(1)}. Use at least one correct computing term from this lesson.`;

  return {
    id: `SA-Q${index + 1}`,
    type: 'short',
    lessonId: lesson.id,
    objective,
    prompt,
    answerKey: keyTerms.map((term) => `${term.word}: ${term.definition}`).join(' '),
    rubric: [
      {
        criterion: 'Concept accuracy',
        description: 'The response explains the idea correctly.',
        points: 3,
        keywords
      },
      {
        criterion: 'Use of subject vocabulary',
        description: 'The response uses at least one correct computing term.',
        points: 1,
        keywords
      },
      {
        criterion: 'Clarity',
        description: 'The response is easy to follow and stays on task.',
        points: 1,
        keywords: []
      }
    ],
    maxScore: 5
  };
}

function createCodingQuestion(lesson, objective, index) {
  const template = codingTemplatesByLesson[lesson.id] || codingTemplatesByLesson[5];

  return {
    id: `CODE-Q${index + 1}`,
    type: 'code',
    lessonId: lesson.id,
    objective,
    prompt: `${template.prompt}\n\nLearning objective: ${objective}`,
    starterCode: template.starterCode,
    answerKey: template.sampleSolution,
    sampleSolution: template.sampleSolution,
    rubric: [
      {
        criterion: 'Correct logic',
        description: 'The code follows the expected rule from the lesson.',
        points: 3,
        keywords: template.keyConcepts
      },
      {
        criterion: 'Programming structure',
        description: 'The answer uses a function, return value, and clear condition or lookup.',
        points: 2,
        keywords: ['function', 'return']
      }
    ],
    maxScore: 5
  };
}

function createMCQQuestion(item, index) {
  return {
    id: `MCQ-Q${index + 1}`,
    type: 'mcq',
    lessonId: item.lessonId,
    objective: 'Check core understanding of the lesson objective.',
    prompt: item.stem,
    options: item.options,
    correctIndex: item.correctIndex,
    answerKey: item.options[item.correctIndex],
    rubric: [{
      criterion: 'Correct answer',
      description: 'Selects the correct option.',
      points: 1,
      keywords: []
    }],
    maxScore: 1
  };
}

function buildFallbackAssessment(config) {
  const lessonPool = getLessonPool(config.lessonIds);
  const objectivePool = lessonPool.flatMap((lesson) => lesson.objectives.map((objective) => ({ lesson, objective })));
  const selectedObjectivePool = objectivePool.length > 0 ? objectivePool : lessons.slice(0, 1).flatMap((lesson) => lesson.objectives.map((objective) => ({ lesson, objective })));
  const objectiveCoverage = selectedObjectivePool.map((entry) => ({
    lessonId: entry.lesson.id,
    lessonTitle: entry.lesson.title,
    objective: entry.objective
  }));

  const mcqCandidates = quizBank
    .filter((item) => config.lessonIds.includes(item.lessonId))
    .sort((left, right) => right.discrimination - left.discrimination || left.difficulty - right.difficulty);
  const shortCandidates = sampleWithoutReplacement(selectedObjectivePool, config.shortAnswerCount || 0);
  const codingCandidates = sampleWithoutReplacement(selectedObjectivePool.slice().reverse(), config.codingCount || 0);
  const mcqQuestions = sampleWithoutReplacement(mcqCandidates, config.mcqCount || 0).map(createMCQQuestion);
  const shortQuestions = shortCandidates.map((entry, index) => createShortAnswerQuestion(entry.lesson, entry.objective, index));
  const codeQuestions = codingCandidates.map((entry, index) => createCodingQuestion(entry.lesson, entry.objective, index));
  const questions = [...mcqQuestions, ...shortQuestions, ...codeQuestions].map((question, index) => ({
    ...question,
    id: `${slugify(config.title || 'assessment')}-q${index + 1}`
  }));
  const totalQuestions = questions.length;

  return {
    title: config.title || 'Generated Assessment',
    subject: 'Basic 7 Computing',
    generatedBy: 'fallback',
    published: true,
    lessonIds: lessonPool.map((lesson) => lesson.id),
    objectiveCoverage,
    durationMinutes: config.durationMinutes || Math.max(15, totalQuestions * 4),
    advancedFeature: 'Objective Coverage Map',
    createdAt: new Date().toISOString(),
    questions
  };
}

async function tryGenerateWithAI(config) {
  const apiKey = getApiKey();
  if (!apiKey || !navigator.onLine) return null;

  const lessonPool = getLessonPool(config.lessonIds);
  const lessonContext = lessonPool.map((lesson) => [
    `Lesson ${lesson.id}: ${lesson.title}`,
    `Objectives: ${lesson.objectives.join('; ')}`,
    `Key terms: ${(lesson.keyTerms || []).map((term) => `${term.word}=${term.definition}`).join('; ')}`
  ].join('\n')).join('\n\n');

  const prompt = [
    'You are building a classroom assessment for Basic 7 Computing.',
    'Return valid JSON only.',
    `Title: ${config.title}`,
    `Question counts: ${config.mcqCount} multiple choice, ${config.shortAnswerCount} short answer, ${config.codingCount} coding.`,
    `Target duration in minutes: ${config.durationMinutes}.`,
    'Each question must include: type, lessonId, objective, prompt, maxScore, rubric[].',
    'MCQ questions must also include options[4] and correctIndex.',
    'Code questions must also include starterCode and sampleSolution.',
    'Include an objectiveCoverage array with lessonId, lessonTitle, objective.',
    'Keep questions age-appropriate and aligned to the lessons below.',
    lessonContext,
    'JSON shape:',
    '{"title":"","objectiveCoverage":[{"lessonId":1,"lessonTitle":"","objective":""}],"questions":[{"type":"mcq","lessonId":1,"objective":"","prompt":"","options":["","","",""],"correctIndex":0,"maxScore":1,"rubric":[{"criterion":"","description":"","points":1,"keywords":[""]}]}]}'
  ].join('\n\n');

  try {
    const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200,
          topP: 0.9
        }
      }),
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(extractJsonObject(text));
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return null;
    }

    const questions = parsed.questions.map((question, index) => normalizeAIQuestion(question, index, config.lessonIds));
    return {
      title: parsed.title || config.title || 'Generated Assessment',
      subject: 'Basic 7 Computing',
      generatedBy: 'ai',
      published: true,
      lessonIds: config.lessonIds,
      objectiveCoverage: Array.isArray(parsed.objectiveCoverage) && parsed.objectiveCoverage.length > 0
        ? parsed.objectiveCoverage
        : getLessonPool(config.lessonIds).flatMap((lesson) => lesson.objectives.map((objective) => ({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          objective
        }))),
      durationMinutes: config.durationMinutes || Math.max(15, questions.length * 4),
      advancedFeature: 'Objective Coverage Map',
      createdAt: new Date().toISOString(),
      questions: questions.map((question, index) => ({
        ...question,
        id: `${slugify(config.title || 'assessment')}-q${index + 1}`
      }))
    };
  } catch {
    return null;
  }
}

export function getAssessmentBlueprintOptions() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id,
    title: lesson.title,
    objectives: lesson.objectives
  }));
}

export async function generateAssessment(config) {
  const normalizedConfig = {
    title: config.title?.trim() || 'Assessment Blueprint',
    lessonIds: Array.isArray(config.lessonIds) && config.lessonIds.length > 0 ? config.lessonIds : [1, 2],
    mcqCount: Math.max(0, Number.parseInt(config.mcqCount, 10) || 0),
    shortAnswerCount: Math.max(0, Number.parseInt(config.shortAnswerCount, 10) || 0),
    codingCount: Math.max(0, Number.parseInt(config.codingCount, 10) || 0),
    durationMinutes: Math.max(10, Number.parseInt(config.durationMinutes, 10) || 20)
  };

  const aiAssessment = await tryGenerateWithAI(normalizedConfig);
  return aiAssessment || buildFallbackAssessment(normalizedConfig);
}
