const { test, expect, describe, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Stone Cold',
        username: 'stonecold',
        password: 'austin',
      },
    });

    await page.goto('http://localhost:5173');
  });

  test('user can log in', async ({ page }) => {
    await page.getByLabel('username').fill('stonecold');
    await page.getByLabel('password').fill('austin');

    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByText('Welcome stonecold')).toBeVisible();
  });
});
