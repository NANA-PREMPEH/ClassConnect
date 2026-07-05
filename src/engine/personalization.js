/**
 * ClassConnect - Personalization Engine
 * Builds learner profiles, adaptive lesson sequencing, revision queues, and risk signals.
 */

import { lessons } from '../data/lessons.js';

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function roundPercent(value) {
  return Math.round(clamp(value) * 100);
}

function getDiagnosticMap(diagnostic) {
  const entries = diagnostic?.lessonBreakdown || [];
  return new Map(entries.map((entry) => [entry.lessonId, entry]));
}

function getLatestResultByLesson(results) {
  const latestByLesson = new Map();
  results
    .slice()
    .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt))
    .forEach((result) => {
      if (!latestByLesson.has(result.lessonId)) {
        latestByLesson.set(result.lessonId, result);
      }
    });

  return latestByLesson;
}

function getRecentMissesByLesson(results) {
  const missesByLesson = new Map();

  results
    .slice()
    .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt))
    .slice(0, 3)
    .forEach((result) => {
      const misses = result.responses?.filter((response) => !response.correct).length || 0;
      missesByLesson.set(result.lessonId, (missesByLesson.get(result.lessonId) || 0) + misses);
    });

  return missesByLesson;
}

function deriveMasteryStatus(mastery) {
  if (mastery >= 0.8) return 'mastered';
  if (mastery >= 0.6) return 'growing';
  if (mastery >= 0.4) return 'review';
  return 'urgent';
}

function deriveReadiness(lessonProfiles) {
  const averageMastery = average(lessonProfiles.map((profile) => profile.mastery));
  const urgentCount = lessonProfiles.filter((profile) => profile.status === 'urgent').length;

  if (averageMastery >= 0.75 && urgentCount === 0) {
    return {
      label: 'Ready to Accelerate',
      tone: 'success',
      description: 'You have strong foundations across the strand. Push into harder quizzes and extension practice.'
    };
  }

  if (averageMastery >= 0.55) {
    return {
      label: 'Foundations Growing',
      tone: 'accent',
      description: 'You are building confidence. Focus on the weakest topics first, then continue the recommended path.'
    };
  }

  return {
    label: 'Needs Guided Support',
    tone: 'danger',
    description: 'Your learning path should begin with a few targeted reviews before moving ahead.'
  };
}

function createRevisionQueue(lessonProfiles, results, diagnostic) {
  const recentMissesByLesson = getRecentMissesByLesson(results);
  const diagnosticMap = getDiagnosticMap(diagnostic);

  const queue = lessonProfiles
    .map((profile) => {
      const diagnosticEntry = diagnosticMap.get(profile.lessonId);
      const recentMisses = recentMissesByLesson.get(profile.lessonId) || 0;
      const reasons = [];
      let priority = 0;

      if (diagnosticEntry && diagnosticEntry.accuracy < 0.5) {
        reasons.push('low diagnostic readiness');
        priority += 25;
      }

      if (profile.latestQuizScore !== null && profile.latestQuizScore < 0.6) {
        reasons.push('recent quiz performance dropped');
        priority += 20;
      }

      if (recentMisses > 0) {
        reasons.push(`${recentMisses} recent missed question${recentMisses === 1 ? '' : 's'}`);
        priority += recentMisses * 6;
      }

      if (!profile.completed) {
        priority += 8;
      }

      if (!reasons.length && profile.mastery >= 0.65) {
        return null;
      }

      return {
        lessonId: profile.lessonId,
        title: profile.title,
        priority,
        reason: reasons.length ? reasons.join(', ') : 'This topic will benefit from one more focused review.',
        action: `Revisit ${profile.title}, then use the AI Tutor before retaking the quiz.`
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.priority - left.priority)
    .slice(0, 4);

  return queue;
}

function createRecommendedSequence(lessonProfiles) {
  const urgentIncomplete = lessonProfiles
    .filter((profile) => !profile.completed && profile.status === 'urgent')
    .sort((left, right) => left.lessonId - right.lessonId);
  const reviewIncomplete = lessonProfiles
    .filter((profile) => !profile.completed && profile.status === 'review')
    .sort((left, right) => left.lessonId - right.lessonId);
  const readyIncomplete = lessonProfiles
    .filter((profile) => !profile.completed && (profile.status === 'growing' || profile.status === 'mastered'))
    .sort((left, right) => left.lessonId - right.lessonId);
  const reviewCompleted = lessonProfiles
    .filter((profile) => profile.completed && (profile.status === 'urgent' || profile.status === 'review'))
    .sort((left, right) => left.mastery - right.mastery || left.lessonId - right.lessonId);
  const strongCompleted = lessonProfiles
    .filter((profile) => profile.completed && (profile.status === 'growing' || profile.status === 'mastered'))
    .sort((left, right) => left.lessonId - right.lessonId);

  return [
    ...urgentIncomplete,
    ...reviewIncomplete,
    ...readyIncomplete,
    ...reviewCompleted,
    ...strongCompleted
  ];
}

export function predictStudentRisk(profile, results = [], diagnostic = null) {
  const sortedResults = results
    .slice()
    .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt));
  const latestResult = sortedResults[0] || null;
  const averageQuizScore = sortedResults.length > 0
    ? average(sortedResults.map((result) => result.score / result.totalQuestions))
    : null;

  let score = 0;
  const reasons = [];

  if (!diagnostic) {
    score += 10;
    reasons.push('no diagnostic profile yet');
  }

  if (profile.completionRate < 40) {
    score += 15;
    reasons.push('low lesson completion');
  }

  if (profile.knowledgeGaps.length >= 3) {
    score += 20;
    reasons.push('several knowledge gaps remain open');
  }

  if (latestResult) {
    const latestScore = latestResult.score / latestResult.totalQuestions;
    if (latestScore < 0.5) {
      score += 25;
      reasons.push('latest quiz score below 50%');
    } else if (latestScore < 0.65) {
      score += 12;
      reasons.push('latest quiz score needs support');
    }

    if (latestResult.theta < -0.75) {
      score += 25;
      reasons.push('ability estimate is trending low');
    } else if (latestResult.theta < -0.25) {
      score += 12;
      reasons.push('ability estimate suggests review');
    }
  }

  if (averageQuizScore !== null && averageQuizScore < 0.6 && sortedResults.length >= 2) {
    score += 10;
    reasons.push('recent quiz trend is still below target');
  }

  const normalizedScore = Math.min(100, score);

  if (normalizedScore >= 60) {
    return {
      score: normalizedScore,
      label: 'High',
      badge: 'danger',
      reasons,
      action: `Teacher check-in recommended. Start with ${profile.recommendedNext?.title || 'the weakest topic'} and review the revision queue.`
    };
  }

  if (normalizedScore >= 35) {
    return {
      score: normalizedScore,
      label: 'Moderate',
      badge: 'warning',
      reasons,
      action: `Guide the learner through ${profile.recommendedNext?.title || 'the next recommended lesson'} and schedule a tutor session.`
    };
  }

  return {
    score: normalizedScore,
    label: 'Low',
    badge: 'success',
    reasons: reasons.length ? reasons : ['steady progress across current evidence'],
    action: 'Keep the learner on the personalized path and use the tutor for stretch support.'
  };
}

export function buildStudentProfile({ diagnostic = null, results = [], progressRecords = [] } = {}) {
  const completedIds = new Set(progressRecords.map((record) => record.lessonId));
  const diagnosticMap = getDiagnosticMap(diagnostic);
  const latestResultsByLesson = getLatestResultByLesson(results);
  const lessonProfiles = lessons.map((lesson) => {
    const diagnosticEntry = diagnosticMap.get(lesson.id);
    const lessonResults = results
      .filter((result) => result.lessonId === lesson.id)
      .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt));
    const latestResult = latestResultsByLesson.get(lesson.id) || null;
    const latestQuizScore = latestResult ? latestResult.score / latestResult.totalQuestions : null;
    const averageQuizScore = lessonResults.length
      ? average(lessonResults.map((result) => result.score / result.totalQuestions))
      : null;
    const diagnosticScore = diagnosticEntry ? diagnosticEntry.accuracy : null;
    const completed = completedIds.has(lesson.id);

    let weightedMastery = 0;
    let totalWeight = 0;

    if (diagnosticScore !== null) {
      weightedMastery += diagnosticScore * 0.35;
      totalWeight += 0.35;
    }

    if (latestQuizScore !== null) {
      weightedMastery += latestQuizScore * 0.45;
      totalWeight += 0.45;
    }

    if (averageQuizScore !== null && lessonResults.length > 1) {
      weightedMastery += averageQuizScore * 0.1;
      totalWeight += 0.1;
    }

    if (completed) {
      weightedMastery += 0.1;
      totalWeight += 0.1;
    }

    let mastery = totalWeight > 0 ? weightedMastery / totalWeight : 0.2;
    if (completed && totalWeight === 0) {
      mastery = 0.55;
    }

    mastery = clamp(mastery);
    const status = deriveMasteryStatus(mastery);

    let recommendedFocus = 'Continue building momentum on this topic.';
    if (diagnosticEntry && diagnosticEntry.accuracy < 0.5) {
      recommendedFocus = 'The diagnostic found this topic needs early attention.';
    } else if (latestQuizScore !== null && latestQuizScore < 0.6) {
      recommendedFocus = 'Recent quiz results suggest a focused review here.';
    } else if (!completed) {
      recommendedFocus = 'This topic is ready to learn next in your path.';
    }

    return {
      lessonId: lesson.id,
      title: lesson.title,
      completed,
      mastery,
      masteryPercent: roundPercent(mastery),
      status,
      diagnosticScore,
      latestQuizScore,
      latestTheta: latestResult?.theta ?? null,
      attempts: lessonResults.length,
      recommendedFocus
    };
  });

  const recommendedSequence = createRecommendedSequence(lessonProfiles);
  const knowledgeGaps = lessonProfiles
    .filter((profile) => profile.status === 'urgent' || profile.status === 'review')
    .sort((left, right) => left.mastery - right.mastery)
    .slice(0, 3);
  const strengths = lessonProfiles
    .filter((profile) => profile.status === 'mastered' || profile.status === 'growing')
    .sort((left, right) => right.mastery - left.mastery)
    .slice(0, 3);
  const revisionQueue = createRevisionQueue(lessonProfiles, results, diagnostic);
  const readiness = deriveReadiness(lessonProfiles);
  const completionRate = lessons.length > 0
    ? Math.round((completedIds.size / lessons.length) * 100)
    : 0;

  const profile = {
    lessonProfiles,
    recommendedSequence,
    recommendedNext: recommendedSequence.find((entry) => !entry.completed) || recommendedSequence[0] || null,
    knowledgeGaps,
    strengths,
    revisionQueue,
    readiness,
    completionRate,
    completedCount: completedIds.size
  };

  profile.risk = predictStudentRisk(profile, results, diagnostic);
  return profile;
}

export function getRecommendedNextLesson(profile) {
  return profile?.recommendedNext || null;
}
