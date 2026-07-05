/**
 * ClassConnect — AI Feedback Engine
 * Calls Google Gemini API for personalized feedback on wrong answers.
 * Falls back to pre-written hints when offline or API unavailable.
 */

import { fallbackHints } from '../data/fallback-hints.js';
import { getApiKey } from './storage.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Generate AI feedback for a wrong answer
 */
export async function generateFeedback(questionId, stem, studentAnswer, correctAnswer) {
  const apiKey = getApiKey();

  // If no API key or offline, use fallback immediately
  if (!apiKey || !navigator.onLine) {
    return getFallback(questionId);
  }

  try {
    const prompt = buildPrompt(stem, studentAnswer, correctAnswer);
    const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
          topP: 0.9
        }
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      console.warn('Gemini API error, using fallback:', response.status);
      return getFallback(questionId);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      return {
        text: text.trim(),
        source: 'ai',
        model: 'gemini-2.0-flash'
      };
    }

    return getFallback(questionId);
  } catch (error) {
    console.warn('AI feedback failed, using fallback:', error.message);
    return getFallback(questionId);
  }
}

/**
 * Get fallback hint for a question
 */
function getFallback(questionId) {
  const text = fallbackHints[questionId] || 'Review the lesson material to understand why the correct answer is right. Try reading the relevant section again!';
  return {
    text,
    source: 'fallback',
    model: null
  };
}

/**
 * Build the prompt for Gemini
 */
function buildPrompt(stem, studentAnswer, correctAnswer) {
  return `You are a friendly, encouraging JHS Computing teacher in Ghana. A student just answered a quiz question wrong. Explain why the correct answer is right in 2-3 simple sentences that a 12-14 year old would understand. Be warm and supportive. Do NOT say "you're wrong" — instead, gently explain the concept.

Question: "${stem}"
Student's answer: "${studentAnswer}"
Correct answer: "${correctAnswer}"

Give a brief, clear explanation (2-3 sentences only):`;
}

/**
 * Generate feedback for all wrong answers in a quiz result
 */
export async function generateAllFeedback(responses) {
  const feedbackMap = {};
  const wrongAnswers = responses.filter(r => !r.correct);

  // Process in sequence to avoid rate limiting
  for (const r of wrongAnswers) {
    const studentAnswer = r.options[r.selectedIndex];
    const correctAnswer = r.options[r.correctIndex];
    feedbackMap[r.questionId] = await generateFeedback(r.questionId, r.stem, studentAnswer, correctAnswer);
  }

  return feedbackMap;
}

/**
 * Check if AI feedback is available
 */
export function isAIAvailable() {
  return !!getApiKey() && navigator.onLine;
}
