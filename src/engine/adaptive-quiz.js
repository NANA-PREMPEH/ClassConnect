/**
 * ClassConnect — Adaptive Quiz Engine
 * Simplified 3-Parameter Logistic (3PL) IRT model with per-question analytics.
 */

import { quizBank } from '../data/quiz-bank.js';

function round(value, precision = 2) {
  return Math.round(value * (10 ** precision)) / (10 ** precision);
}

function probability(theta, item) {
  const { discrimination, difficulty, guessing } = item;
  const exponent = -discrimination * (theta - difficulty);
  return guessing + (1 - guessing) / (1 + Math.exp(exponent));
}

function fisherInfo(theta, item) {
  const p = probability(theta, item);
  const { discrimination, guessing } = item;
  if (p <= guessing || p >= 1) return 0;

  const numerator = discrimination * discrimination * ((p - guessing) ** 2);
  const denominator = ((1 - guessing) ** 2) * p * (1 - p);
  return denominator > 0 ? numerator / denominator : 0;
}

function estimateAbility(responses) {
  if (responses.length === 0) return 0;

  const allCorrect = responses.every((response) => response.correct);
  const allWrong = responses.every((response) => !response.correct);
  if (allCorrect) return Math.min(3, 0.5 * responses.length);
  if (allWrong) return Math.max(-3, -0.5 * responses.length);

  let theta = 0;
  const maxIter = 30;
  const tolerance = 0.001;

  for (let index = 0; index < maxIter; index += 1) {
    let sumFirst = 0;
    let sumSecond = 0;

    for (const response of responses) {
      const p = probability(theta, response.item);
      const q = 1 - p;
      const { discrimination, guessing } = response.item;
      const pStar = (p - guessing) / (1 - guessing);
      const weight = discrimination * pStar * q;

      if (response.correct) {
        sumFirst += weight / p;
      } else {
        sumFirst -= weight / q;
      }

      sumSecond -= (weight * weight) / (p * q);
    }

    if (Math.abs(sumSecond) < 1e-10) break;

    const delta = sumFirst / sumSecond;
    theta -= delta;
    theta = Math.max(-3, Math.min(3, theta));

    if (Math.abs(delta) < tolerance) break;
  }

  return theta;
}

function standardError(theta, responses) {
  let totalInfo = 0;
  for (const response of responses) {
    totalInfo += fisherInfo(theta, response.item);
  }

  return totalInfo > 0 ? 1 / Math.sqrt(totalInfo) : 999;
}

function selectNextItem(theta, remainingItems) {
  let bestItem = null;
  let bestInfo = -Infinity;

  for (const item of remainingItems) {
    const info = fisherInfo(theta, item);
    if (info > bestInfo) {
      bestInfo = info;
      bestItem = item;
    }
  }

  return bestItem;
}

export function abilityLevel(theta) {
  if (theta < -1) {
    return { label: 'Beginner', color: '#FB7185', description: 'Just getting started — keep learning and practicing!' };
  }

  if (theta < 0) {
    return { label: 'Developing', color: '#FBBF24', description: 'You understand the basics. Review the tricky parts and try again!' };
  }

  if (theta < 1) {
    return { label: 'Proficient', color: '#818CF8', description: "Great understanding! You've got a solid grasp of this topic." };
  }

  return { label: 'Advanced', color: '#34D399', description: "Excellent! You've mastered this topic. Ready for the next challenge!" };
}

export function createQuizSession(lessonId = null, maxQuestions = 10) {
  let pool = lessonId ? quizBank.filter((item) => item.lessonId === lessonId) : [...quizBank];
  pool = pool.sort(() => Math.random() - 0.5);

  const usedIds = new Set();
  const responses = [];
  const thetaTrajectory = [];
  let theta = 0;
  let currentItem = null;
  let questionNumber = 0;
  let finished = false;
  let currentQuestionStartedAt = null;

  function next() {
    if (finished) return null;

    const remaining = pool.filter((item) => !usedIds.has(item.id));
    if (remaining.length === 0 || questionNumber >= maxQuestions) {
      finished = true;
      return null;
    }

    if (questionNumber >= 5) {
      const se = standardError(theta, responses);
      if (se < 0.3) {
        finished = true;
        return null;
      }
    }

    currentItem = selectNextItem(theta, remaining);
    usedIds.add(currentItem.id);
    questionNumber += 1;
    currentQuestionStartedAt = Date.now();

    return {
      question: currentItem,
      questionNumber,
      totalQuestions: Math.min(maxQuestions, pool.length),
      currentTheta: theta,
      difficulty: currentItem.difficulty > 0.5 ? 'Hard' : currentItem.difficulty < -0.5 ? 'Easy' : 'Medium'
    };
  }

  function answer(selectedIndex) {
    if (!currentItem) return null;

    const answeredAt = Date.now();
    const thetaBefore = theta;
    const correct = selectedIndex === currentItem.correctIndex;
    const response = {
      item: currentItem,
      selectedIndex,
      correct,
      questionNumber,
      presentedAt: currentQuestionStartedAt || answeredAt,
      answeredAt,
      elapsedMs: Math.max(0, answeredAt - (currentQuestionStartedAt || answeredAt)),
      thetaBefore
    };

    responses.push(response);
    theta = estimateAbility(responses);

    response.thetaAfter = theta;
    response.standardErrorAfter = standardError(theta, responses);

    thetaTrajectory.push({
      questionId: currentItem.id,
      questionNumber,
      thetaBefore: round(thetaBefore),
      thetaAfter: round(theta),
      standardErrorAfter: round(response.standardErrorAfter),
      elapsedMs: response.elapsedMs,
      correct
    });

    currentQuestionStartedAt = null;

    return {
      correct,
      correctIndex: currentItem.correctIndex,
      thetaBefore,
      thetaAfter: theta,
      standardErrorAfter: response.standardErrorAfter,
      elapsedMs: response.elapsedMs,
      level: abilityLevel(theta)
    };
  }

  function getCurrentElapsedMs() {
    if (!currentQuestionStartedAt) return 0;
    return Math.max(0, Date.now() - currentQuestionStartedAt);
  }

  function getResults() {
    const score = responses.filter((response) => response.correct).length;
    const level = abilityLevel(theta);
    const se = standardError(theta, responses);
    const totalTimeMs = responses.reduce((sum, response) => sum + response.elapsedMs, 0);
    const averageTimeMs = responses.length > 0 ? Math.round(totalTimeMs / responses.length) : 0;

    return {
      score,
      totalQuestions: responses.length,
      theta: round(theta),
      standardError: round(se),
      level: level.label,
      levelColor: level.color,
      levelDescription: level.description,
      totalTimeMs,
      averageTimeMs,
      thetaTrajectory,
      responses: responses.map((response) => ({
        questionId: response.item.id,
        lessonId: response.item.lessonId,
        stem: response.item.stem,
        options: response.item.options,
        selectedIndex: response.selectedIndex,
        correctIndex: response.item.correctIndex,
        correct: response.correct,
        questionNumber: response.questionNumber,
        elapsedMs: response.elapsedMs,
        presentedAt: response.presentedAt,
        answeredAt: response.answeredAt,
        thetaBefore: round(response.thetaBefore),
        thetaAfter: round(response.thetaAfter),
        standardErrorAfter: round(response.standardErrorAfter)
      }))
    };
  }

  function isFinished() {
    return finished;
  }

  return { next, answer, getCurrentElapsedMs, getResults, isFinished };
}
