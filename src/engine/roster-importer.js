/**
 * ClassConnect - Roster Importer Engine
 * Parses, validates, and normalizes student roster CSV files for bulk onboarding.
 */

export function generateSampleRosterCSV() {
  return [
    'Index Number,Full Name,Class,Gender,PIN',
    'GES-B7-0101,Kwame Mensah,B7 — JHS 1A,Male,1234',
    'GES-B7-0102,Ama Serwaa,B7 — JHS 1A,Female,5678',
    'GES-B7-0103,Kofi Boateng,B7 — JHS 1A,Male,',
    'GES-B7-0104,Abena Osei,B7 — JHS 1B,Female,9012',
    'GES-B7-0105,Yaw Appiah,B7 — JHS 1B,Male,'
  ].join('\n');
}

export function downloadSampleRosterCSV() {
  const csv = generateSampleRosterCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'classconnect_sample_roster.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (tabCount > commaCount && tabCount > semiCount) return '\t';
  if (semiCount > commaCount) return ';';
  return ',';
}

function parseCSVRows(csvText) {
  const delimiter = detectDelimiter(csvText);
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 1) return [];

  return lines.map((line) => {
    const row = [];
    let insideQuotes = false;
    let currentCell = '';

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === delimiter && !insideQuotes) {
        row.push(currentCell.trim().replace(/^"|"$/g, ''));
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    row.push(currentCell.trim().replace(/^"|"$/g, ''));
    return row;
  });
}

function findColumnIndex(headers, aliases = []) {
  const normalized = headers.map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  for (const alias of aliases) {
    const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idx = normalized.indexOf(cleanAlias);
    if (idx !== -1) return idx;
  }
  return -1;
}

function normalizeGender(val = '') {
  const clean = val.trim().toLowerCase();
  if (clean.startsWith('m') || clean === 'boy') return 'Male';
  if (clean.startsWith('f') || clean === 'girl') return 'Female';
  return 'Unspecified';
}

function generateRandomPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/**
 * Parses and validates CSV content.
 * @param {string} csvText - Raw text from the uploaded CSV file.
 * @param {Array} existingClasses - List of classes currently in database.
 * @param {Array} existingStudents - List of students currently in database.
 * @param {number|null} targetClassId - Optional default class ID if row has no class column.
 */
export function parseRosterCSV(csvText, existingClasses = [], existingStudents = [], targetClassId = null) {
  const rows = parseCSVRows(csvText);

  if (rows.length < 2) {
    return {
      success: false,
      error: 'The CSV file must contain a header row and at least one student record.',
      validRecords: [],
      warnings: [],
      errors: []
    };
  }

  const headers = rows[0];
  const nameIdx = findColumnIndex(headers, ['fullname', 'name', 'studentname', 'learnername']);
  const indexIdx = findColumnIndex(headers, ['indexnumber', 'indexno', 'id', 'admissionno', 'studentid']);
  const classIdx = findColumnIndex(headers, ['class', 'grade', 'stream', 'section', 'classstream']);
  const genderIdx = findColumnIndex(headers, ['gender', 'sex']);
  const pinIdx = findColumnIndex(headers, ['pin', 'password', 'code', 'logincode']);

  if (nameIdx === -1 && indexIdx === -1) {
    return {
      success: false,
      error: 'CSV header must include at least a "Full Name" or "Index Number" column.',
      validRecords: [],
      warnings: [],
      errors: []
    };
  }

  const validRecords = [];
  const errors = [];
  const warnings = [];
  const seenIndexes = new Set();
  const seenNames = new Set();

  const classMapByName = new Map();
  existingClasses.forEach((c) => {
    classMapByName.set(c.name.toLowerCase().trim(), c.id);
    if (c.gradeLevel && c.stream) {
      classMapByName.set(`${c.gradeLevel} ${c.stream}`.toLowerCase().trim(), c.id);
      classMapByName.set(`${c.gradeLevel}-${c.stream}`.toLowerCase().trim(), c.id);
    }
  });

  const defaultClassId = targetClassId || existingClasses[0]?.id || 1;

  for (let rowNum = 1; rowNum < rows.length; rowNum += 1) {
    const row = rows[rowNum];
    const rawName = nameIdx !== -1 ? (row[nameIdx] || '').trim() : '';
    const rawIndex = indexIdx !== -1 ? (row[indexIdx] || '').trim() : '';
    const rawClass = classIdx !== -1 ? (row[classIdx] || '').trim() : '';
    const rawGender = genderIdx !== -1 ? row[genderIdx] : '';
    const rawPin = pinIdx !== -1 ? (row[pinIdx] || '').trim() : '';

    if (!rawName && !rawIndex) {
      continue; // Skip empty row
    }

    if (rawName.length < 2 && !rawIndex) {
      errors.push(`Row ${rowNum + 1}: Student name "${rawName}" is too short.`);
      continue;
    }

    // Resolve class ID
    let resolvedClassId = defaultClassId;
    let className = existingClasses.find((c) => c.id === defaultClassId)?.name || 'Default Class';

    if (rawClass) {
      const matchId = classMapByName.get(rawClass.toLowerCase().trim());
      if (matchId) {
        resolvedClassId = matchId;
        className = existingClasses.find((c) => c.id === matchId)?.name || rawClass;
      } else {
        warnings.push(`Row ${rowNum + 1}: Class "${rawClass}" not recognized. Assigned to ${className}.`);
      }
    }

    // PIN check
    let pin = rawPin;
    let pinGenerated = false;
    if (!pin || !/^\d{4}$/.test(pin)) {
      pin = generateRandomPin();
      pinGenerated = true;
    }

    // Duplicate checks inside file
    if (rawIndex) {
      if (seenIndexes.has(rawIndex.toLowerCase())) {
        errors.push(`Row ${rowNum + 1}: Duplicate Index Number "${rawIndex}" found in CSV.`);
        continue;
      }
      seenIndexes.add(rawIndex.toLowerCase());
    }

    const nameKey = `${rawName.toLowerCase()}::${resolvedClassId}`;
    if (rawName && seenNames.has(nameKey)) {
      warnings.push(`Row ${rowNum + 1}: Student "${rawName}" appears multiple times in this class.`);
    }
    if (rawName) {
      seenNames.add(nameKey);
    }

    // Check if matching existing student in database
    const existingMatch = existingStudents.find((s) =>
      (rawIndex && s.indexNumber && s.indexNumber.toLowerCase() === rawIndex.toLowerCase())
      || (rawName && s.name.toLowerCase() === rawName.toLowerCase() && s.classId === resolvedClassId)
    );

    validRecords.push({
      rowNumber: rowNum + 1,
      name: rawName || rawIndex,
      indexNumber: rawIndex || null,
      classId: resolvedClassId,
      className,
      gender: normalizeGender(rawGender),
      pin,
      pinGenerated,
      status: 'active',
      isUpdate: Boolean(existingMatch),
      existingId: existingMatch?.id || null
    });
  }

  return {
    success: validRecords.length > 0,
    validRecords,
    errors,
    warnings,
    summary: {
      totalRows: rows.length - 1,
      validCount: validRecords.length,
      errorCount: errors.length,
      warningCount: warnings.length,
      newCount: validRecords.filter((r) => !r.isUpdate).length,
      updateCount: validRecords.filter((r) => r.isUpdate).length,
      autoPinsGenerated: validRecords.filter((r) => r.pinGenerated).length
    }
  };
}
