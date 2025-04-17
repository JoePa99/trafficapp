import { test, expect } from '@playwright/test'

test('complete traffic report generation flow', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:3000')

  // Step 1: Upload files
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles([
    'sample_data/traffic_spec.csv',
    'sample_data/station_list.csv',
  ])

  // Wait for upload to complete
  await expect(page.locator('text=Review Data')).toBeVisible()

  // Step 2: Review and confirm mappings
  await page.click('button:has-text("Continue")')

  // Wait for generation step
  await expect(page.locator('text=Generate Reports')).toBeVisible()

  // Step 3: Generate reports
  await page.click('button:has-text("Generate Reports")')

  // Wait for generation to complete
  await expect(page.locator('text=Download Reports')).toBeVisible()

  // Verify PDF downloads
  const downloadPromise = page.waitForEvent('download')
  await page.click('button:has-text("Download")')
  const download = await downloadPromise
  expect(download.suggestedFilename()).toContain('.pdf')
}) 