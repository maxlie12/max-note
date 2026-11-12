// Browser smoke verification of real Max Note UI interactions (synthetic data only).
// Runs against a temporary local HTTP server in GitHub Actions, not production or a real iPhone.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const URL = 'http://127.0.0.1:4173/';

async function openWithRetry(page) {
  for (let attempt = 0; attempt < 15; attempt++) {
    try { await page.goto(URL, { waitUntil: 'load', timeout: 3000 }); return; }
    catch (error) { if (attempt === 14) throw error; await new Promise(r => setTimeout(r, 400)); }
  }
}
async function tab(page, name) {
  await page.locator('[data-tab="' + name + '"]').click();
}
async function addTask(page, title, project = 'main') {
  await tab(page, 'inbox');
  await page.locator('#title').fill(title);
  await page.locator('#project').selectOption(project);
  await page.locator('#next').fill('Bước tiếp có thể làm');
  await page.locator('#task-form button[type="submit"]').click();
  await page.getByText(title, { exact: true }).first().waitFor();
}
async function scenario(browser, width) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, acceptDownloads: true });
  const page = await context.newPage();
  const label = width + 'px';
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let cancelNextImport = false;
  page.on('dialog', dialog => {
    if (cancelNextImport) { cancelNextImport = false; return dialog.dismiss(); }
    return dialog.accept();
  });
  await openWithRetry(page);
  await addTask(page, 'Việc chính ' + label);
  await addTask(page, 'Việc freelance ' + label, 'freelance');
  await addTask(page, 'Việc Atlas ' + label, 'atlas');
  const active = await page.locator('#other-tasks .task').count();
  assert.equal(active, 3, label + ' should show three open tasks');
  await page.locator('#today-suggestions button').first().click();
  assert.equal(await page.locator('#today-tasks .task').count(), 1, 'focus selection should work');
  const focused = page.locator('#today-tasks .task').first();
  await focused.getByRole('button', { name: 'Sửa task' }).click();
  await focused.locator('.edit-pane input').nth(0).fill('Việc đã chỉnh ' + label);
  await focused.locator('.edit-pane select').selectOption('1');
  await focused.getByRole('button', { name: 'Lưu thay đổi' }).click();
  assert.equal(await focused.locator('.task-title').textContent(), 'Việc đã chỉnh ' + label);
  await focused.getByRole('button', { name: 'Xong', exact: true }).click();
  await tab(page, 'review');
  await page.locator('#review-status').getByText('1 Xong hôm nay').waitFor();
  await page.locator('#reflection').fill('Bản nháp chưa lưu ' + label);
  await tab(page, 'today');
  await tab(page, 'review');
  assert.equal(await page.locator('#reflection').inputValue(), 'Bản nháp chưa lưu ' + label,
    'tab switches must preserve unsaved reflection');
  await page.locator('#save-reflection').click();
  await page.reload();
  await tab(page, 'review');
  assert.equal(await page.locator('#reflection').inputValue(), 'Bản nháp chưa lưu ' + label,
    'saved reflection must survive reload');
  assert.equal(await page.locator('#review-status').getByText('1 Xong hôm nay').count(), 1);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#export').click()
  ]);
  assert.match(download.suggestedFilename(), /^max-note-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const exported = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
  assert.equal(exported.tasks.length, 3);
  assert.equal(exported.tasks.filter(x => x.status === 'done').length, 1);
  assert.equal(exported.reflections[Object.keys(exported.reflections)[0]], 'Bản nháp chưa lưu ' + label);

  // Corrupt input should not replace working data.
  await page.locator('#import-file').setInputFiles({
    name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{broken')
  });
  await page.getByText(/Không nhập được:/).waitFor();
  assert.equal(await page.locator('#review-status').getByText('1 Xong hôm nay').count(), 1);

  // Simulate storage quota refusal on an otherwise valid import. In-memory data must stay intact.
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'max-note-mvp-v1') throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  });
  const replacement = { version: 1, tasks: [], reflections: {}, focusDate: '' };
  await page.locator('#import-file').setInputFiles({
    name: 'valid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(replacement))
  });
  await page.getByText(/Không nhập được:/).waitFor();
  assert.equal(await page.locator('#review-status').getByText('1 Xong hôm nay').count(), 1,
    'failed import must not discard active tasks');
  await page.reload();
  await tab(page, 'review');
  assert.equal(await page.locator('#review-status').getByText('1 Xong hôm nay').count(), 1,
    'failed import must not destroy persisted tasks');
  // Cancel an import, then select the exact same file: the file input must reset.
  cancelNextImport = true;
  const cancelFile = {name: 'empty.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(replacement))};
  await page.locator('#import-file').setInputFiles(cancelFile);
  assert.equal(await page.locator('#import-file').inputValue(), '', 'cancelled file input should reset');
  assert.equal(await page.locator('#project-tasks .task').count(), 3, 'cancel must preserve tasks');
  // Successful import and round-trip restore through the actual UI.
  await page.locator('#import-file').setInputFiles({name: 'empty.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(replacement))});
  await page.getByText('Đã nhập bản sao lưu.').waitFor();
  assert.equal(await page.locator('#project-tasks .task').count(), 0);
  await page.locator('#import-file').setInputFiles({name: 'restore.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(exported))});
  await page.getByText('Đã nhập bản sao lưu.').waitFor();
  assert.equal(await page.locator('#project-tasks .task').count(), 3, 'valid import must restore tasks');
  assert.equal(await page.locator('#reflection').inputValue(), 'Bản nháp chưa lưu ' + label, 'reflection restored');
  await page.reload();
  await tab(page, 'review');
  assert.equal(await page.locator('#project-tasks .task').count(), 3, 'restored tasks must survive reload');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  assert.equal(overflow, false, 'horizontal overflow at ' + label);
  assert.deepEqual(errors, [], 'browser JavaScript errors at ' + label);
  console.log('PASS ' + label + ': create/edit/focus/done/review/draft/reload/export/corrupt-import/quota-import');
  await context.close();
}
async function focusLimitScenario(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await openWithRetry(page);
  for (let i = 1; i <= 4; i++) await addTask(page, 'Focus limit ' + i);
  for (let i = 1; i <= 3; i++) {
    await page.locator('#other-tasks .task').first().getByRole('button', { name: 'Chọn hôm nay' }).click();
  }
  assert.equal(await page.locator('#today-tasks .task').count(), 3);
  await page.locator('#other-tasks .task').first().getByRole('button', { name: 'Chọn hôm nay' }).click();
  await page.getByText('Chỉ nên chọn tối đa ba việc quan trọng mỗi ngày.').waitFor();
  assert.equal(await page.locator('#today-tasks .task').count(), 3, 'fourth focus rejected');
  await page.reload();
  assert.equal(await page.locator('#today-tasks .task').count(), 3, 'same-day focus preserved');
  console.log('PASS focus-limit: three selected, fourth rejected, reload retained');
  await context.close();
}
(async () => {
  const browser = await chromium.launch({ headless: true });
  try { await scenario(browser, 390); await scenario(browser, 320); await focusLimitScenario(browser); }
  finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
