import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('CV Upload Flow - Full E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display home page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/CVScorer/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('Get Your CV Score');

    // Check feature highlights
    await expect(page.getByText('Instant analysis')).toBeVisible();
    await expect(page.getByText('Privacy-first')).toBeVisible();
    await expect(page.getByText('No sign-up needed')).toBeVisible();
    await expect(page.getByText('100% free')).toBeVisible();
  });

  test('should show upload zone', async ({ page }) => {
    // Check upload zone is visible
    const uploadZone = page.locator('text=Drag and drop your CV here');
    await expect(uploadZone).toBeVisible();

    // Check file input exists
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test('should show tips section', async ({ page }) => {
    await expect(page.getByText('Quick Tips for a High Score')).toBeVisible();
    await expect(page.getByText('Structure Matters')).toBeVisible();
    await expect(page.getByText('Content is King')).toBeVisible();
  });

  test('should reject invalid file type', async ({ page }) => {
    // Set up invalid file
    const fileInput = page.locator('input[type="file"]');
    const invalidFile = path.join(__dirname, '../fixtures/invalid.txt');

    // Upload file
    await fileInput.setInputFiles(invalidFile);

    // Wait for error message
    const errorMessage = page.locator('text=Invalid file type');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should show navbar and footer', async ({ page }) => {
    // Check navbar
    await expect(page.getByRole('link', { name: 'CVScorer' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'FAQ' })).toBeVisible();

    // Check footer
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');

    // Click About link
    await page.click('text=About');

    // Check URL
    await expect(page).toHaveURL(/.*about/);

    // Check content
    await expect(page.locator('h1')).toContainText('About CVScorer');
    await expect(page.getByText('How It Works')).toBeVisible();
  });

  test('should navigate to FAQ page', async ({ page }) => {
    await page.goto('/');

    await page.click('text=FAQ');

    await expect(page).toHaveURL(/.*faq/);
    await expect(page.locator('h1')).toContainText('Frequently Asked Questions');
  });

  test('should navigate to Privacy page', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Privacy Policy');

    await expect(page).toHaveURL(/.*privacy/);
    await expect(page.locator('h1')).toContainText('Privacy Policy');
  });

  test('should navigate back to home', async ({ page }) => {
    await page.goto('/about');

    await page.click('text=CVScorer');

    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Get Your CV Score');
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile layout
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('Drag and drop')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check h1 exists
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    expect(await h1.count()).toBe(1);
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');

    // Check navigation is accessible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check links are keyboard accessible
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focused);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');

    // Check all images have alt text
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to navigate all links
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focused);
  });
});

test.describe('Performance', () => {
  test('should load quickly', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - start;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors.length).toBe(0);
  });
});

test.describe('Error Handling', () => {
  test('should handle 404 gracefully', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    expect(response?.status()).toBe(404);
  });
});
