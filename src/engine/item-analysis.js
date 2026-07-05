/**
 * ClassConnect - Item Analysis
 * Computes difficulty and discrimination metrics for generated assessments.
 */

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value, precision = 2) {
  return Math.round(value * (10 ** precision)) / (10 ** precision);
}

export function computeAssessmentItemAnalysis(assessment, submissions) {
  const normalizedSubmissions = submissions.map((submission) => ({
    ...submission,
    totalNormalized: submission.grading?.maxScore
      ? submission.grading.totalScore / submission.grading.maxScore
      : 0
  }));
  const sorted = normalizedSubmissions.slice().sort((left, right) => right.totalNormalized - left.totalNormalized);
  const groupSize = Math.max(1, Math.ceil(sorted.length / 3));
  const upperGroup = sorted.slice(0, groupSize);
  const lowerGroup = sorted.slice(-groupSize);

  return assessment.questions.map((question) => {
    const itemScores = normalizedSubmissions
      .map((submission) => submission.grading?.questionScores?.find((entry) => entry.questionId === question.id))
      .filter(Boolean);
    const difficultyIndex = average(itemScores.map((entry) => entry.normalizedScore));
    const upperAverage = average(upperGroup
      .map((submission) => submission.grading?.questionScores?.find((entry) => entry.questionId === question.id)?.normalizedScore)
      .filter((value) => typeof value === 'number'));
    const lowerAverage = average(lowerGroup
      .map((submission) => submission.grading?.questionScores?.find((entry) => entry.questionId === question.id)?.normalizedScore)
      .filter((value) => typeof value === 'number'));
    const discriminationIndex = upperAverage - lowerAverage;

    let status = 'Healthy';
    if (difficultyIndex < 0.25) {
      status = 'Too Hard';
    } else if (difficultyIndex > 0.85) {
      status = 'Too Easy';
    } else if (discriminationIndex < 0.15) {
      status = 'Weak Discriminator';
    }

    return {
      questionId: question.id,
      type: question.type,
      prompt: question.prompt,
      objective: question.objective,
      difficultyIndex: round(difficultyIndex),
      discriminationIndex: round(discriminationIndex),
      meanScore: round(average(itemScores.map((entry) => entry.score || 0))),
      status,
      submissionCount: itemScores.length
    };
  });
}

export function buildAssessmentOverview(assessment, submissions) {
  const itemAnalysis = computeAssessmentItemAnalysis(assessment, submissions);
  const averagePercentage = submissions.length > 0
    ? Math.round(average(submissions.map((submission) => submission.grading?.percentage || 0)))
    : 0;
  const flaggedIntegrityCount = submissions.filter((submission) => submission.integrity?.label === 'High').length;
  const flaggedProctorCount = submissions.filter((submission) => submission.proctor?.label === 'High').length;

  return {
    assessmentId: assessment.id,
    title: assessment.title,
    generatedBy: assessment.generatedBy,
    submissionCount: submissions.length,
    averagePercentage,
    flaggedIntegrityCount,
    flaggedProctorCount,
    itemAnalysis
  };
}
