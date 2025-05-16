import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Cyberpunk Red GM Screen/)
  })

  test('displays welcome message', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Cyberpunk Red GM Screen')
    await expect(page.locator('p')).toContainText('Welcome to the interactive Game Master Screen')
  })

  test('is accessible', async ({ page }) => {
    const accessibilitySnapshot = await page.accessibility.snapshot()
    expect(accessibilitySnapshot).toBeTruthy()
  })
})