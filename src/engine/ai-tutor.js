/**
 * ClassConnect - AI Tutor and Insight Engine
 * Generates study plans, diagnostic summaries, and conversational tutor replies.
 */

import { lessons } from '../data/lessons.js';
import { getApiKey } from './storage.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function lessonReferenceText(lesson) {
  const objectives = lesson.objectives.slice(0, 2).join('; ');
  const terms = (lesson.keyTerms || []).slice(0, 3).map((term) => `${term.word}: ${term.definition}`).join('; ');
  return `${lesson.title}. Objectives: ${objectives}. Key terms: ${terms}`;
}

function buildProfileText(profile) {
  const gaps = profile.knowledgeGaps.map((entry) => entry.title).join(', ') || 'none identified';
  const strengths = profile.strengths.map((entry) => entry.title).join(', ') || 'still emerging';
  const nextLesson = profile.recommendedNext?.title || 'Lesson 1';
  const revision = profile.revisionQueue.map((entry) => `${entry.title} (${entry.reason})`).join('; ') || 'none';

  return [
    `Readiness: ${profile.readiness.label}.`,
    `Completion rate: ${profile.completionRate}%.`,
    `Knowledge gaps: ${gaps}.`,
    `Strengths: ${strengths}.`,
    `Recommended next lesson: ${nextLesson}.`,
    `Revision queue: ${revision}.`
  ].join(' ');
}

function getMatchedLesson(message) {
  const normalized = message.toLowerCase();

  return lessons.find((lesson) => {
    if (normalized.includes(lesson.title.toLowerCase())) return true;
    return (lesson.keyTerms || []).some((term) => normalized.includes(term.word.toLowerCase()));
  }) || null;
}

function fallbackDiagnosticInsight(profile) {
  const strongest = profile.strengths[0]?.title || 'your earliest lessons';
  const weakest = profile.knowledgeGaps[0]?.title || profile.recommendedNext?.title || 'the next lesson';
  return `You are showing the most confidence in ${strongest}. Focus next on ${weakest}, then use the AI Tutor to clear up anything that still feels confusing. Small, steady review sessions will move your readiness up quickly.`;
}

function fallbackTutorReply(message, profile) {
  const matchedLesson = getMatchedLesson(message);
  const topGap = profile.knowledgeGaps[0];
  const nextLesson = profile.recommendedNext;
  const normalized = message.toLowerCase();

  if (normalized.includes('next') || normalized.includes('study') || normalized.includes('path')) {
    return `Your best next step is ${nextLesson?.title || 'the next lesson in your path'}. It is recommended because ${topGap ? `${topGap.title} still needs review` : 'it keeps your momentum going'}. After that, revisit one item from your revision queue before taking the quiz.`;
  }

  if (matchedLesson) {
    const keyTerm = matchedLesson.keyTerms?.[0];
    const objective = matchedLesson.objectives?.[0];
    return `${matchedLesson.title} is mainly about ${objective?.toLowerCase() || 'this topic area'}. Start with this idea: ${keyTerm ? `${keyTerm.word} means ${keyTerm.definition}` : 'focus on the core lesson objective first'}. Then compare it with your own words and try one practice question before moving on.`;
  }

  if (normalized.includes('struggling') || normalized.includes('stuck') || normalized.includes('hard')) {
    return `It looks like ${topGap?.title || 'one of your current topics'} needs a slower, more guided review. Break it into two parts: reread the lesson objectives first, then ask me one specific question about a term or idea that is still unclear.`;
  }

  return `I remember your current path is strongest when we keep things focused. Start with ${nextLesson?.title || 'your next recommended lesson'}, and if a concept feels confusing, ask me about one term or one example at a time so we can unpack it together.`;
}

async function callGemini(prompt) {
  const apiKey = getApiKey();
  if (!apiKey || !navigator.onLine) {
    return null;
  }

  try {
    const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 300,
          topP: 0.9
        }
      }),
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}

export async function generateDiagnosticInsight(student, diagnostic, profile) {
  const prompt = [
    'You are a warm, concise learning coach for Basic 7 Computing.',
    `Student: ${student.name}.`,
    `Diagnostic readiness: ${diagnostic.readiness}.`,
    buildProfileText(profile),
    'Write exactly 3 supportive sentences for the student.',
    'Sentence 1: celebrate one strength.',
    'Sentence 2: explain the most important gap to focus on next.',
    'Sentence 3: give a short action plan using the tutor and the next lesson.'
  ].join('\n');

  const aiText = await callGemini(prompt);
  return {
    text: aiText || fallbackDiagnosticInsight(profile),
    source: aiText ? 'ai' : 'fallback'
  };
}

export async function generateTutorReply({ student, message, history = [], profile }) {
  const lessonContext = lessons.map(lessonReferenceText).join('\n');
  const recentHistory = history.slice(-8).map((entry) => `${entry.role}: ${entry.content}`).join('\n');
  const prompt = [
    'You are ClassConnect Tutor, a supportive Basic 7 Computing tutor.',
    `Student: ${student.name}.`,
    buildProfileText(profile),
    'Use the profile and memory below. Keep answers clear, age-appropriate, and practical.',
    'If the learner asks what to study next, recommend the personalized path.',
    'If the learner asks about a concept, explain it simply and connect it to one lesson.',
    'Respond in 2 short paragraphs maximum.',
    'Lesson references:',
    lessonContext,
    'Conversation memory:',
    recentHistory || 'No prior messages yet.',
    `Student message: ${message}`
  ].join('\n');

  const aiText = await callGemini(prompt);
  return {
    text: aiText || fallbackTutorReply(message, profile),
    source: aiText ? 'ai' : 'fallback'
  };
}
