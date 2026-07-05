/**
 * ClassConnect - AI Feedback Engine
 * Calls Gemini for short explanations, then saves reusable feedback for offline fallback.
 */

import { fallbackHints } from '../data/fallback-hints.js';
import {
  getApiKey,
  getFeedbackCacheEntry,
  getQuestionFeedbackCache,
  markFeedbackCacheUsed,
  saveFeedbackCacheEntry
} from './storage.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GENERIC_FALLBACK = 'Review the lesson material to understand why the correct answer is right. Try reading the relevant section again!';
const pendingFeedbackRequests = new Map();

function normalizeAnswer(value = '') {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function buildFeedbackCacheKey(questionId, studentAnswer, correctAnswer) {
  return [questionId, normalizeAnswer(studentAnswer), normalizeAnswer(correctAnswer)].join('::');
}

function sanitizeFeedbackText(text = '') {
  return text.replace(/\s+/g, ' ').trim();
}

function buildPracticeTip(stem, correctAnswer) {
  if (!correctAnswer) {
    return 'Practice tip: explain the key idea in your own words before you move on.';
  }

  if ((stem || '').toLowerCase().includes('difference')) {
    return `Practice tip: compare the choices and explain why "${correctAnswer}" matches the question best.`;
  }

  return `Practice tip: say out loud why "${correctAnswer}" is the best answer before you continue.`;
}

function formatCachedFeedback(entry, source = 'cache', extra = {}) {
  return {
    text: entry.text,
    source,
    model: entry.model || null,
    practiceTip: entry.practiceTip || buildPracticeTip(entry.stem, entry.correctAnswer),
    usageCount: entry.usageCount || 1,
    cachedAt: entry.updatedAt || entry.createdAt || null,
    savedForOffline: true,
    ...extra
  };
}

function getStaticFallback(questionId, stem, correctAnswer) {
  return {
    text: fallbackHints[questionId] || GENERIC_FALLBACK,
    source: 'fallback',
    model: null,
    practiceTip: buildPracticeTip(stem, correctAnswer),
    usageCount: 0,
    cachedAt: null,
    savedForOffline: false
  };
}

async function getQuestionLevelFallback(questionId, activeCacheKey) {
  const entries = await getQuestionFeedbackCache(questionId);
  const candidate = entries
    .filter((entry) => entry.cacheKey !== activeCacheKey && entry.text)
    .sort((left, right) => {
      const usageDelta = (right.usageCount || 1) - (left.usageCount || 1);
      if (usageDelta !== 0) {
        return usageDelta;
      }

      return new Date(right.lastUsedAt || right.updatedAt || 0) - new Date(left.lastUsedAt || left.updatedAt || 0);
    })[0];

  if (!candidate) {
    return null;
  }

  const touched = await markFeedbackCacheUsed(candidate.cacheKey);
  return formatCachedFeedback(touched || candidate, 'question-cache', {
    reusedFromQuestionBank: true
  });
}

async function resolveOfflineFeedback({
  questionId,
  stem,
  correctAnswer,
  cacheKey,
  cachedEntry,
  allowQuestionCache
}) {
  if (cachedEntry) {
    const touched = await markFeedbackCacheUsed(cacheKey);
    return formatCachedFeedback(touched || cachedEntry, 'cache');
  }

  if (allowQuestionCache) {
    const questionFallback = await getQuestionLevelFallback(questionId, cacheKey);
    if (questionFallback) {
      return questionFallback;
    }
  }

  return getStaticFallback(questionId, stem, correctAnswer);
}

async function requestFreshFeedback({
  apiKey,
  questionId,
  stem,
  studentAnswer,
  correctAnswer,
  cacheKey,
  cachedEntry,
  allowQuestionCache
}) {
  try {
    const prompt = buildPrompt(stem, studentAnswer, correctAnswer);
    const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 180,
          topP: 0.9
        }
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.warn('Gemini API error, using offline fallback:', response.status);
      return resolveOfflineFeedback({
        questionId,
        stem,
        correctAnswer,
        cacheKey,
        cachedEntry,
        allowQuestionCache
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const text = sanitizeFeedbackText(rawText);

    if (!text) {
      return resolveOfflineFeedback({
        questionId,
        stem,
        correctAnswer,
        cacheKey,
        cachedEntry,
        allowQuestionCache
      });
    }

    const savedEntry = await saveFeedbackCacheEntry({
      cacheKey,
      questionId,
      stem,
      studentAnswer,
      correctAnswer,
      text,
      practiceTip: buildPracticeTip(stem, correctAnswer),
      model: 'gemini-2.0-flash',
      lastUsedAt: new Date().toISOString()
    });

    return formatCachedFeedback(savedEntry, 'ai', {
      model: 'gemini-2.0-flash'
    });
  } catch (error) {
    console.warn('AI feedback failed, using offline fallback:', error.message);
    return resolveOfflineFeedback({
      questionId,
      stem,
      correctAnswer,
      cacheKey,
      cachedEntry,
      allowQuestionCache
    });
  }
}

/**
 * Generate feedback for a wrong answer.
 * When online, the quiz view can force a fresh AI request.
 * When offline, the engine reuses exact or common cached explanations before static hints.
 */
export async function generateFeedback(questionId, stem, studentAnswer, correctAnswer, options = {}) {
  const {
    preferCached = false,
    allowQuestionCache = true
  } = options;

  const apiKey = getApiKey();
  const cacheKey = buildFeedbackCacheKey(questionId, studentAnswer, correctAnswer);
  const cachedEntry = await getFeedbackCacheEntry(cacheKey);

  if (!apiKey || !navigator.onLine) {
    return resolveOfflineFeedback({
      questionId,
      stem,
      correctAnswer,
      cacheKey,
      cachedEntry,
      allowQuestionCache
    });
  }

  if (preferCached && cachedEntry) {
    const touched = await markFeedbackCacheUsed(cacheKey);
    return formatCachedFeedback(touched || cachedEntry, 'cache');
  }

  if (pendingFeedbackRequests.has(cacheKey)) {
    return pendingFeedbackRequests.get(cacheKey);
  }

  const request = requestFreshFeedback({
    apiKey,
    questionId,
    stem,
    studentAnswer,
    correctAnswer,
    cacheKey,
    cachedEntry,
    allowQuestionCache
  }).finally(() => {
    pendingFeedbackRequests.delete(cacheKey);
  });

  pendingFeedbackRequests.set(cacheKey, request);
  return request;
}

/**
 * Build the prompt for Gemini.
 */
function buildPrompt(stem, studentAnswer, correctAnswer) {
  return `You are a friendly, encouraging JHS Computing teacher in Ghana. A student answered a quiz question incorrectly. Explain why the correct answer is right in 2-3 simple sentences for a 12-14 year old. Be warm and supportive. Do not say "you are wrong" or shame the learner.

Question: "${stem}"
Student's answer: "${studentAnswer}"
Correct answer: "${correctAnswer}"

Give only the short explanation:`;
}

/**
 * Generate feedback for all wrong answers in a quiz result.
 * Cached responses are preferred here so review screens stay fast and offline-ready.
 */
export async function generateAllFeedback(responses) {
  const feedbackMap = {};
  const wrongAnswers = responses.filter((response) => !response.correct);

  for (const response of wrongAnswers) {
    const studentAnswer = response.options[response.selectedIndex];
    const correctAnswer = response.options[response.correctIndex];
    feedbackMap[response.questionId] = await generateFeedback(
      response.questionId,
      response.stem,
      studentAnswer,
      correctAnswer,
      { preferCached: true }
    );
  }

  return feedbackMap;
}

/**
 * Check if AI feedback is available right now.
 */
export function isAIAvailable() {
  return !!getApiKey() && navigator.onLine;
}
