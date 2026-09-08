/**
 * ClassConnect - Gradebook & GES Assessment Engine
 * Implements Continuous Assessment (SBA) weighting, Ghana BECE 9-point grading scale,
 * class ranking calculation, and master broadsheet data aggregation.
 */

import { lessons } from '../data/lessons.js';

export const DEFAULT_GRADEBOOK_WEIGHTS = {
  sbaPercent: 30,       // Formative quizzes & lesson completions
  diagnosticPercent: 20, // Diagnostic readiness & foundational baseline
  examPercent: 50        // Summative end-of-term assessment
};

/**
 * Maps a numerical percentage (0-100) to the official Ghana Education Service (GES)
 * and WAEC BECE 9-point grading scale.
 */
export function getBECEGrade(percentage) {
  const score = Math.max(0, Math.min(100, Math.round(percentage || 0)));

  if (score >= 90) {
    return {
      grade: 1,
      label: 'Grade 1',
      descriptor: 'Excellent',
      letter: 'A1',
      tone: 'success',
      remark: 'Outstanding performance and deep conceptual mastery.'
    };
  }
  if (score >= 80) {
    return {
      grade: 2,
      label: 'Grade 2',
      descriptor: 'Very Good',
      letter: 'B2',
      tone: 'success',
      remark: 'Very strong mastery; consistently demonstrates high ability.'
    };
  }
  if (score >= 70) {
    return {
      grade: 3,
      label: 'Grade 3',
      descriptor: 'Good',
      letter: 'B3',
      tone: 'primary',
      remark: 'Solid grasp of fundamental computing concepts.'
    };
  }
  if (score >= 60) {
    return {
      grade: 4,
      label: 'Grade 4',
      descriptor: 'High Average',
      letter: 'C4',
      tone: 'primary',
      remark: 'Satisfactory work; demonstrates steady progress in computing tasks.'
    };
  }
  if (score >= 55) {
    return {
      grade: 5,
      label: 'Grade 5',
      descriptor: 'Average',
      letter: 'C5',
      tone: 'accent',
      remark: 'Fair understanding; needs targeted practice on technical terms.'
    };
  }
  if (score >= 50) {
    return {
      grade: 6,
      label: 'Grade 6',
      descriptor: 'Low Average',
      letter: 'C6',
      tone: 'warning',
      remark: 'Average performance; additional review of key concepts required.'
    };
  }
  if (score >= 45) {
    return {
      grade: 7,
      label: 'Grade 7',
      descriptor: 'Lower',
      letter: 'D7',
      tone: 'warning',
      remark: 'Below expected standard; regular remediation recommended.'
    };
  }
  if (score >= 40) {
    return {
      grade: 8,
      label: 'Grade 8',
      descriptor: 'Lowest',
      letter: 'E8',
      tone: 'danger',
      remark: 'Weak performance; urgent intervention needed in basic computing.'
    };
  }
  return {
    grade: 9,
    label: 'Grade 9',
    descriptor: 'Fail',
    letter: 'F9',
    tone: 'danger',
    remark: 'Did not meet minimum competency requirements. Remedial support required.'
  };
}

/**
 * Converts a numeric rank to an academic ordinal string (e.g. 1 -> 1st, 2 -> 2nd, 3 -> 3rd).
 */
export function getOrdinalRank(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Calculates a single student's academic marks across formative quizzes, diagnostic, and exams.
 */
export function calculateStudentGrade(student, { results = [], progress = [], diagnostics = [], submissions = [], weights = DEFAULT_GRADEBOOK_WEIGHTS }) {
  const studentResults = results.filter((r) => r.studentId === student.id);
  const studentProgress = progress.filter((p) => p.studentId === student.id);
  const studentDiagnostics = diagnostics.filter((d) => d.studentId === student.id);
  const studentSubmissions = submissions.filter((s) => s.studentId === student.id);

  // 1. Formative Lesson Quizzes Breakdown
  const lessonScores = {};
  lessons.forEach((l) => {
    const quiz = studentResults
      .filter((r) => r.lessonId === l.id)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

    lessonScores[l.id] = quiz && quiz.totalQuestions > 0
      ? Math.round((quiz.score / quiz.totalQuestions) * 100)
      : null;
  });

  const validQuizScores = Object.values(lessonScores).filter((s) => s !== null);
  const rawQuizAverage = validQuizScores.length > 0
    ? validQuizScores.reduce((sum, val) => sum + val, 0) / validQuizScores.length
    : 0;

  // Completion factor (rewards completing lessons)
  const completionPercent = (studentProgress.length / Math.max(1, lessons.length)) * 100;
  const sbaRaw = Math.round(rawQuizAverage * 0.8 + completionPercent * 0.2);

  // 2. Diagnostic Score
  const latestDiagnostic = studentDiagnostics.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
  let diagnosticRaw = 50; // default baseline if not taken
  if (latestDiagnostic) {
    const theta = latestDiagnostic.estimatedTheta ?? 0;
    // Map theta (-3 to +3) to 0-100%
    diagnosticRaw = Math.max(0, Math.min(100, Math.round(50 + theta * 16.67)));
  }

  // 3. Summative Exam Score
  const latestSubmission = studentSubmissions.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
  let examRaw = null;
  if (latestSubmission && latestSubmission.maxScore > 0) {
    examRaw = Math.round((latestSubmission.totalScore / latestSubmission.maxScore) * 100);
  } else if (validQuizScores.length > 0) {
    // If no standalone exam submitted yet, use latest quiz average as projected exam mark
    examRaw = Math.round(rawQuizAverage);
  } else {
    examRaw = 0;
  }

  // 4. Weighted Calculation
  const wSBA = (weights.sbaPercent || 30) / 100;
  const wDiag = (weights.diagnosticPercent || 20) / 100;
  const wExam = (weights.examPercent || 50) / 100;

  const weightedSBA = Math.round(sbaRaw * wSBA);
  const weightedDiag = Math.round(diagnosticRaw * wDiag);
  const weightedExam = Math.round(examRaw * wExam);

  const totalPercentage = Math.round(weightedSBA + weightedDiag + weightedExam);
  const bece = getBECEGrade(totalPercentage);

  return {
    student,
    lessonScores,
    rawQuizAverage: Math.round(rawQuizAverage),
    completionCount: studentProgress.length,
    sbaRaw,
    weightedSBA,
    diagnosticRaw,
    weightedDiag,
    examRaw,
    weightedExam,
    totalPercentage,
    bece,
    quizzesTaken: studentResults.length,
    hasExamSubmission: Boolean(latestSubmission),
    latestDiagnostic
  };
}

/**
 * Computes official academic ordinal rankings for a cohort of students.
 */
export function calculateClassRankings(studentsGraded) {
  const sorted = studentsGraded.slice().sort((a, b) => {
    if (b.totalPercentage !== a.totalPercentage) {
      return b.totalPercentage - a.totalPercentage;
    }
    return b.sbaRaw - a.sbaRaw;
  });

  return sorted.map((entry, index) => ({
    ...entry,
    rankNumber: index + 1,
    rankOrdinal: getOrdinalRank(index + 1),
    isTopThree: index < 3
  }));
}

/**
 * Aggregates all data needed for the Master Broadsheet view.
 */
export function buildClassBroadsheet(classId, { classes = [], students = [], results = [], progress = [], diagnostics = [], submissions = [], weights = DEFAULT_GRADEBOOK_WEIGHTS }) {
  const currentClass = classId === 'all'
    ? { id: 'all', name: 'All Classes', gradeLevel: 'B7', academicYear: '2026/2027', term: 'Term 1' }
    : classes.find((c) => String(c.id) === String(classId)) || classes[0] || { id: 1, name: 'General', gradeLevel: 'B7' };

  const classStudents = classId === 'all'
    ? students
    : students.filter((s) => String(s.classId) === String(currentClass.id));

  const gradedList = classStudents.map((student) =>
    calculateStudentGrade(student, { results, progress, diagnostics, submissions, weights })
  );

  const rankedStudents = calculateClassRankings(gradedList);

  const classAverage = rankedStudents.length > 0
    ? Math.round(rankedStudents.reduce((sum, s) => sum + s.totalPercentage, 0) / rankedStudents.length)
    : 0;

  const highestScore = rankedStudents.length > 0
    ? Math.max(...rankedStudents.map((s) => s.totalPercentage))
    : 0;

  const lowestScore = rankedStudents.length > 0
    ? Math.min(...rankedStudents.map((s) => s.totalPercentage))
    : 0;

  const gradeDistribution = {};
  for (let g = 1; g <= 9; g += 1) {
    gradeDistribution[g] = rankedStudents.filter((s) => s.bece.grade === g).length;
  }

  return {
    classInfo: currentClass,
    weights,
    lessons,
    students: rankedStudents,
    statistics: {
      totalStudents: rankedStudents.length,
      classAverage,
      highestScore,
      lowestScore,
      gradeDistribution
    }
  };
}

/**
 * Formats broadsheet records into CSV text for direct school administrative export.
 */
export function exportBroadsheetAsCSV(broadsheet) {
  const headers = [
    'Rank',
    'Index Number',
    'Student Name',
    'Class',
    ...lessons.map((l) => `L${l.id}: ${l.title}`),
    `SBA Raw (${broadsheet.weights.sbaPercent}%)`,
    `Diagnostic Raw (${broadsheet.weights.diagnosticPercent}%)`,
    `Exam Raw (${broadsheet.weights.examPercent}%)`,
    'Total Percentage',
    'BECE Grade',
    'Descriptor'
  ];

  const rows = broadsheet.students.map((s) => [
    s.rankOrdinal,
    `"${s.student.indexNumber || ''}"`,
    `"${s.student.name}"`,
    `"${broadsheet.classInfo.name}"`,
    ...lessons.map((l) => s.lessonScores[l.id] !== null ? `${s.lessonScores[l.id]}%` : 'N/A'),
    `${s.sbaRaw}%`,
    `${s.diagnosticRaw}%`,
    `${s.examRaw}%`,
    `${s.totalPercentage}%`,
    `Grade ${s.bece.grade}`,
    `"${s.bece.descriptor}"`
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Compiles comprehensive data for an individual student's printable terminal report card.
 */
export function buildStudentReportCardData(studentId, { classes = [], students = [], results = [], progress = [], diagnostics = [], submissions = [], weights = DEFAULT_GRADEBOOK_WEIGHTS }) {
  const student = students.find((s) => s.id === Number.parseInt(studentId, 10));
  if (!student) return null;

  const studentClass = classes.find((c) => c.id === student.classId) || classes[0] || {
    id: 1,
    name: 'B7 — JHS 1A',
    gradeLevel: 'B7',
    academicYear: '2026/2027',
    term: 'Term 1',
    teacherName: 'Class Teacher'
  };

  const broadsheet = buildClassBroadsheet(studentClass.id, {
    classes,
    students,
    results,
    progress,
    diagnostics,
    submissions,
    weights
  });

  const studentData = broadsheet.students.find((s) => s.student.id === student.id);
  if (!studentData) return null;

  // Student specific theta history
  const studentResults = results
    .filter((r) => r.studentId === student.id)
    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

  const thetaHistory = studentResults.map((r) => ({
    completedAt: r.completedAt,
    lessonId: r.lessonId,
    lessonTitle: lessons.find((l) => l.id === r.lessonId)?.title || `Lesson ${r.lessonId}`,
    theta: Number((r.theta || 0).toFixed(2))
  }));

  // Curated strand performance breakdown matching GES CCP curriculum
  const strands = lessons.map((lesson) => {
    const rawScore = studentData.lessonScores[lesson.id];
    const isCompleted = progress.some((p) => p.studentId === student.id && p.lessonId === lesson.id);

    let performanceRemark = 'Not yet attempted.';
    if (rawScore !== null) {
      if (rawScore >= 80) performanceRemark = 'Mastered core objectives.';
      else if (rawScore >= 60) performanceRemark = 'Demonstrates competent understanding.';
      else performanceRemark = 'Requires further reinforcement.';
    }

    return {
      id: lesson.id,
      title: lesson.title,
      strand: `Strand ${lesson.id}: Computer Systems`,
      score: rawScore,
      isCompleted,
      remark: performanceRemark
    };
  });

  return {
    student,
    studentClass,
    studentData,
    classTotalStudents: broadsheet.students.length,
    classAverage: broadsheet.statistics.classAverage,
    strands,
    thetaHistory,
    weights,
    attendance: {
      daysPresent: Math.min(60, 52 + (student.id % 8)),
      totalDays: 60
    },
    conduct: studentData.totalPercentage >= 70
      ? 'Exemplary behavior, attentive during lab practicals, and shows positive initiative.'
      : 'Well behaved; advised to dedicate more time to hands-on computer practice.',
    headmasterRemark: studentData.totalPercentage >= 70
      ? 'An impressive performance. Keep up the high standard.'
      : 'Has potential to do much better with consistent study and practice.'
  };
}
