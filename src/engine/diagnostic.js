/**
 * ClassConnect - Diagnostic Assessment Engine
 * Delivers a short adaptive pre-assessment to uncover lesson-level knowledge gaps.
 */

import { lessons } from '../data/lessons.js';
import { quizBank } from '../data/quiz-bank.js';

function buildRankedLessonItems() {
  return new Map(
    lessons.map((lesson) => {
      const ranked = quizBank
        .filter((item) => item.lessonId === lesson.id)
        .sort((left, right) => {
          const difficultyGap = Math.abs(left.difficulty) - Math.abs(right.difficulty);
          if (difficultyGap !== 0) return difficultyGap;
          return right.discrimination - left.discrimination;
        });
      return [lesson.id, ranked];
    })
  );
}

function deriveReadinessLabel(scoreRatio, knowledgeGapCount) {
  if (scoreRatio >= 0.75 && knowledgeGapCount === 0) {
    return 'Ready to Accelerate';
  }

  if (scoreRatio >= 0.5) {
    return 'Foundations Growing';
  }

  return 'Needs Guided Support';
}

function summarizeBreakdown(responsesByLesson) {
  return lessons.map((lesson) => {
    const entries = responsesByLesson.get(lesson.id) || [];
    const correct = entries.filter((entry) => entry.correct).length;
    const attempted = entries.length;
    const accuracy = attempted > 0 ? correct / attempted : 0;

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      correct,
      attempted,
      accuracy
    };
  });
}

export function createDiagnosticSession() {
  const rankedItemsByLesson = buildRankedLessonItems();
  const anchorQueue = lessons
    .map((lesson) => rankedItemsByLesson.get(lesson.id)?.[0])
    .filter(Boolean);
  const followUpCandidates = new Map(
    lessons.map((lesson) => [
      lesson.id,
      (rankedItemsByLesson.get(lesson.id) || []).slice(1)
    ])
  );
  const usedIds = new Set();
  const responses = [];
  let questionNumber = 0;
  let currentItem = null;
  let followUpQueue = [];
  let followUpsPrepared = false;
  let finished = false;

  function buildFollowUps() {
    const responsesByLesson = new Map();
    for (const response of responses) {
      const lessonResponses = responsesByLesson.get(response.lessonId) || [];
      lessonResponses.push(response);
      responsesByLesson.set(response.lessonId, lessonResponses);
    }

    const rankedLessons = summarizeBreakdown(responsesByLesson)
      .sort((left, right) => {
        if (left.accuracy !== right.accuracy) {
          return left.accuracy - right.accuracy;
        }
        return left.lessonId - right.lessonId;
      })
      .slice(0, 3);

    followUpQueue = rankedLessons
      .map((entry) => {
        const pool = followUpCandidates.get(entry.lessonId) || [];
        return pool.find((item) => !usedIds.has(item.id)) || null;
      })
      .filter(Boolean);

    followUpsPrepared = true;
  }

  function next() {
    if (finished) return null;

    let item = null;

    if (anchorQueue.length > 0) {
      item = anchorQueue.shift();
    } else {
      if (!followUpsPrepared) {
        buildFollowUps();
      }

      item = followUpQueue.shift() || null;
    }

    if (!item) {
      finished = true;
      return null;
    }

    usedIds.add(item.id);
    currentItem = item;
    questionNumber += 1;

    const lesson = lessons.find((entry) => entry.id === item.lessonId);

    return {
      question: item,
      questionNumber,
      totalQuestions: 8,
      lessonId: item.lessonId,
      lessonTitle: lesson?.title || `Lesson ${item.lessonId}`,
      phase: questionNumber <= 5 ? 'coverage' : 'follow-up'
    };
  }

  function answer(selectedIndex) {
    if (!currentItem) return null;

    const correct = selectedIndex === currentItem.correctIndex;
    const response = {
      questionId: currentItem.id,
      lessonId: currentItem.lessonId,
      stem: currentItem.stem,
      options: currentItem.options,
      selectedIndex,
      correctIndex: currentItem.correctIndex,
      correct
    };

    responses.push(response);
    currentItem = null;

    return {
      correct,
      correctIndex: response.correctIndex
    };
  }

  function getResults() {
    const responsesByLesson = new Map();
    for (const response of responses) {
      const bucket = responsesByLesson.get(response.lessonId) || [];
      bucket.push(response);
      responsesByLesson.set(response.lessonId, bucket);
    }

    const lessonBreakdown = summarizeBreakdown(responsesByLesson);
    const knowledgeGaps = lessonBreakdown.filter((entry) => entry.accuracy < 0.5);
    const strengths = lessonBreakdown.filter((entry) => entry.accuracy >= 0.75);
    const score = responses.filter((response) => response.correct).length;
    const totalQuestions = responses.length;
    const scoreRatio = totalQuestions > 0 ? score / totalQuestions : 0;

    return {
      score,
      totalQuestions,
      readiness: deriveReadinessLabel(scoreRatio, knowledgeGaps.length),
      generationMethod: 'adaptive diagnostic',
      lessonBreakdown,
      knowledgeGaps,
      strengths,
      responses
    };
  }

  function isFinished() {
    return finished;
  }

  return { next, answer, getResults, isFinished };
}
