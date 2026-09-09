import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('staff navigation only exposes role-authorised workspaces', async () => {
  const shell = await read('src/components/staff-shell.js');
  const storage = await read('src/engine/storage.js');
  assert.match(shell, /permission: 'users\.manage'/);
  assert.match(shell, /permission: 'lab\.monitor'/);
  assert.match(storage, /\[USER_ROLES\.INVI?GILATOR\]: \['lab\.monitor'\]/);
});

test('new staff workspaces have explicit route permissions', async () => {
  const main = await read('src/main.js');
  assert.match(main, /path === '\/students'.*'roster\.manage'/);
  assert.match(main, /path === '\/admin'.*'users\.manage'/);
  assert.match(main, /renderStaffAccessDenied/);
});

test('dashboard scopes teacher data through assigned class IDs', async () => {
  const dashboard = await read('src/views/dashboard.js');
  assert.match(dashboard, /getAccessibleClassIds/);
  assert.match(dashboard, /scopedStudents/);
  assert.match(dashboard, /setStaffClassContext/);
});
