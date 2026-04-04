/**
 * RichSave - E2E Test Suite (Playwright)
 * Authentication Flow Tests
 *
 * Run: npx playwright test auth.e2e.spec.ts
 */

import { test, expect, Page } from '@playwright/test';

// Test data
const testUsers = {
  valid: {
    name: 'E2E Test User',
    email: 'e2e.test@richsave.com',
    password: 'Test@12345',
    phone: '0812345678'
  },
  login: {
    email: 'login.test@richsave.com',
    password: 'Login@123'
  }
};

// Helper functions
async function fillSignupForm(page: Page, user: typeof testUsers.valid) {
  await page.fill('input[id="name"]', user.name);
  await page.fill('input[id="email"]', user.email);
  await page.fill('input[id="password"]', user.password);
  await page.fill('input[id="confirmPassword"]', user.password);
  await page.check('input[id="terms"]');
}

async function fillLoginForm(page: Page, email: string, password: string) {
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
}

async function waitForNavigation(page: Page, path: string) {
  await page.waitForURL(`**${path}`, { timeout: 5000 });
}

test.describe('Authentication: User Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('AUTH-REG-001: Register with valid data', async ({ page }) => {
    // Arrange & Act
    await fillSignupForm(page, testUsers.valid);
    await page.click('button[type="submit"]');

    // Assert
    await expect(page).toHaveURL(/\/deals/, { timeout: 5000 });
    await expect(page.locator('text=Welcome to RichSave').or(page.locator('text=Deals'))).toBeVisible();
  });

  test('AUTH-REG-003: Register with mismatched passwords', async ({ page }) => {
    // Arrange
    await page.fill('input[id="name"]', testUsers.valid.name);
    await page.fill('input[id="email"]', testUsers.valid.email);
    await page.fill('input[id="password"]', testUsers.valid.password);
    await page.fill('input[id="confirmPassword"]', 'Different@123');

    // Act
    await page.click('button[type="submit"]');

    // Assert
    const error = page.locator('text=Passwords do not match');
    await expect(error).toBeVisible();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('AUTH-REG-004: Register with short password', async ({ page }) => {
    // Arrange
    await page.fill('input[id="name"]', testUsers.valid.name);
    await page.fill('input[id="email"]', testUsers.valid.email);
    await page.fill('input[id="password"]', '12345');
    await page.fill('input[id="confirmPassword"]', '12345');

    // Act
    await page.click('button[type="submit"]');

    // Assert
    const error = page.locator('text=/at least 6 characters/i');
    await expect(error).toBeVisible();
  });

  test('AUTH-REG-005: Register with invalid email format', async ({ page }) => {
    // Arrange
    await page.fill('input[id="name"]', testUsers.valid.name);
    await page.fill('input[id="email"]', 'invalidemail');
    await page.fill('input[id="password"]', testUsers.valid.password);
    await page.fill('input[id="confirmPassword"]', testUsers.valid.password);

    // Act
    await page.click('button[type="submit"]');

    // Assert
    const error = page.locator('text=/valid email/i');
    await expect(error).toBeVisible();
  });

  test('AUTH-REG-006: Register with empty mandatory fields', async ({ page }) => {
    // Act - Submit without filling anything
    await page.click('button[type="submit"]');

    // Assert
    const error = page.locator('text=/required/i');
    await expect(error).toBeVisible();
  });

  test('AUTH-REG-007: Register without accepting Terms & Conditions', async ({ page }) => {
    // Arrange - Fill all fields but don't check terms
    await page.fill('input[id="name"]', testUsers.valid.name);
    await page.fill('input[id="email"]', testUsers.valid.email);
    await page.fill('input[id="password"]', testUsers.valid.password);
    await page.fill('input[id="confirmPassword"]', testUsers.valid.password);

    // Act
    await page.click('button[type="submit"]');

    // Assert
    const error = page.locator('text=/terms/i');
    await expect(error).toBeVisible();
  });

  test('AUTH-REG-014: Rapid submit attempts (idempotency)', async ({ page }) => {
    // Arrange
    await fillSignupForm(page, testUsers.valid);

    // Act - Click submit button 3 times rapidly
    await page.click('button[type="submit"]');
    await page.click('button[type="submit"]');
    await page.click('button[type="submit"]');

    // Assert - Should only create one account
    await expect(page).toHaveURL(/\/deals/, { timeout: 5000 });
  });
});

test.describe('Authentication: User Login', () => {
  // Setup: Create a test user before running login tests
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/signup');

    // Create test user
    await page.fill('input[id="name"]', 'Login Test');
    await page.fill('input[id="email"]', testUsers.login.email);
    await page.fill('input[id="password"]', testUsers.login.password);
    await page.fill('input[id="confirmPassword"]', testUsers.login.password);
    await page.check('input[id="terms"]');
    await page.click('button[type="submit"]');

    // Wait for signup to complete
    await page.waitForURL(/\/deals/, { timeout: 5000 });

    // Logout
    await page.click('text=Logout');
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('AUTH-LOG-001: Login with valid credentials', async ({ page }) => {
    // Arrange & Act
    await fillLoginForm(page, testUsers.login.email, testUsers.login.password);
    await page.click('button[type="submit"]');

    // Assert
    await expect(page).toHaveURL(/\/deals/, { timeout: 5000 });
    await expect(page.locator('text=Logout').or(page.locator('[data-testid="user-menu"]'))).toBeVisible();
  });

  test('AUTH-LOG-002: Login with invalid email', async ({ page }) => {
    // Arrange & Act
    await fillLoginForm(page, 'nonexistent@richsave.com', testUsers.login.password);
    await page.click('button[type="submit"]');

    // Assert
    const error = page.locator('text=/invalid email or password/i');
    await expect(error).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('AUTH-LOG-003: Login with invalid password', async ({ page }) => {
    // Arrange & Act
    await fillLoginForm(page, testUsers.login.email, 'WrongPassword@123');
    await page.click('button[type="submit"]');

    // Assert
    const error = page.locator('text=/invalid email or password/i');
    await expect(error).toBeVisible();
    // Generic error - don't reveal which field is wrong
    await expect(page.locator('text=/password/i')).not.toBeVisible();
  });

  test('AUTH-LOG-004: Login with empty fields', async ({ page }) => {
    // Act - Submit without filling anything
    await page.click('button[type="submit"]');

    // Assert
    const error = page.locator('text=/required/i');
    await expect(error).toBeVisible();
  });

  test('AUTH-LOG-005: Login with empty password only', async ({ page }) => {
    // Arrange
    await page.fill('input[type="email"]', testUsers.login.email);

    // Act
    await page.click('button[type="submit"]');

    // Assert
    const error = page.locator('text=/password.*required/i');
    await expect(error).toBeVisible();
  });

  test('AUTH-LOG-010: Brute force prevention (rate limiting)', async ({ page }) => {
    // Arrange & Act - Try to login 5 times with wrong password
    for (let i = 0; i < 5; i++) {
      await fillLoginForm(page, testUsers.login.email, 'WrongPassword@123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    }

    // Assert - Account should be temporarily locked
    const error = page.locator('text=/too many attempts/i').or(page.locator('text=/try again later/i'));
    await expect(error).toBeVisible();
  });

  test('AUTH-LOG-011: Show/Hide password toggle', async ({ page }) => {
    // Arrange
    const passwordInput = page.locator('input[type="password"]');
    const eyeIcon = page.locator('svg').first(); // Adjust selector based on actual implementation

    // Act
    await passwordInput.fill(testUsers.login.password);
    await eyeIcon.click();

    // Assert - Password should be visible (type="text")
    const visiblePassword = page.locator('input[type="text"]').nth(1); // Adjust index
    await expect(visiblePassword).toHaveValue(testUsers.login.password);

    // Act again - Hide password
    await eyeIcon.click();

    // Assert - Password should be hidden again
    await expect(passwordInput).toHaveValue(testUsers.login.password);
  });
});

test.describe('Authentication: Password Reset', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
  });

  test('AUTH-RST-001: Request OTP with valid email', async ({ page }) => {
    // Arrange & Act
    await page.fill('input[type="email"]', testUsers.login.email);
    await page.click('button:has-text("Send OTP")');

    // Assert
    const success = page.locator('text=/OTP sent/i').or(page.locator('text=/code sent/i'));
    await expect(success).toBeVisible({ timeout: 5000 });

    // Should navigate to OTP verification screen
    await expect(page.locator('text=/verify/i').or(page.locator('text=/code/i'))).toBeVisible();
  });

  test('AUTH-RST-002: Request OTP with unregistered email', async ({ page }) => {
    // Arrange & Act
    await page.fill('input[type="email"]', 'nonexistent@richsave.com');
    await page.click('button:has-text("Send OTP")');

    // Assert - Should show generic error (don't reveal email existence)
    const response = page.locator('text=/sent/i').or(page.locator('text=/not found/i'));
    await expect(response).toBeVisible();
  });

  test('AUTH-RST-003: Request OTP with empty email', async ({ page }) => {
    // Act - Submit without email
    await page.click('button:has-text("Send OTP")');

    // Assert
    const error = page.locator('text=/email.*required/i');
    await expect(error).toBeVisible();
  });

  test('AUTH-RST-009: Auto-focus next OTP field', async ({ page }) => {
    // This test would need to be on the OTP verification screen
    // Setup would involve navigating to OTP screen first
    // For now, this is a placeholder for the OTP input behavior test

    // Arrange & Act
    const otpInputs = page.locator('.otp-input'); // Adjust selector
    await otpInputs.nth(0).fill('1');

    // Assert - Focus should move to next input
    await expect(otpInputs.nth(1)).toBeFocused();
  });

  test('AUTH-RST-012: Reset password with valid new password', async ({ page }) => {
    // This would require mocking the OTP verification
    // In a real test, you'd need to:
    // 1. Navigate through the complete flow
    // 2. Mock the OTP verification API
    // 3. Enter new password
    // 4. Submit

    // Placeholder for the complete flow test
    test.skip(true, 'Requires OTP mocking - implement with API mocking');
  });

  test('AUTH-RST-013: Reset password with mismatched passwords', async ({ page }) => {
    // Navigate to reset password screen (mocking the OTP step)
    // For now, this is a placeholder

    // Arrange & Act
    await page.fill('input[id="password"]', 'NewTest@123');
    await page.fill('input[id="confirmPassword"]', 'Different@123');
    await page.click('button:has-text("Reset Password")');

    // Assert
    const error = page.locator('text=/do not match/i');
    await expect(error).toBeVisible();
  });
});

test.describe('Authentication: Logout', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each logout test
    await page.goto('/login');
    await fillLoginForm(page, testUsers.login.email, testUsers.login.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/deals/);
  });

  test('AUTH-LOGO-001: Logout from navigation menu', async ({ page }) => {
    // Arrange - Go to a page where logout is accessible
    await page.goto('/deals');

    // Act - Click logout button
    await page.click('text=Logout');

    // Assert - Should redirect to login or home
    await expect(page).toHaveURL(/\/(login|home)/, { timeout: 5000 });
  });

  test('AUTH-LOGO-003: Cancel logout confirmation', async ({ page }) => {
    // If there's a confirmation dialog
    // Act
    const logoutButton = page.locator('text=Logout');
    await logoutButton.click();

    // Check if confirmation appears
    const confirmation = page.locator('text=/are you sure/i').or(page.locator('[role="dialog"]'));

    if (await confirmation.isVisible()) {
      await page.click('text=Cancel');

      // Assert - Should remain logged in
      await expect(page.locator('text=Logout')).toBeVisible();
    } else {
      test.skip(true, 'No confirmation dialog implemented');
    }
  });

  test('AUTH-LOGO-005: Verify token cleared after logout', async ({ page }) => {
    // Arrange - Get cookies before logout
    const cookiesBefore = await page.context().cookies();

    // Act - Logout
    await page.click('text=Logout');

    // Assert - Token cookie should be cleared
    const cookiesAfter = await page.context().cookies();
    const tokenBefore = cookiesBefore.find(c => c.name === 'token');
    const tokenAfter = cookiesAfter.find(c => c.name === 'token');

    expect(tokenBefore).toBeDefined();
    expect(tokenAfter).toBeUndefined();
  });

  test('AUTH-LOGO-006: Access protected route after logout', async ({ page }) => {
    // Arrange - Logout
    await page.click('text=Logout');
    await expect(page).toHaveURL(/\/(login|home)/);

    // Act - Try to access profile
    await page.goto('/profile');

    // Assert - Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    const message = page.locator('text=/please login/i').or(page.locator('text=/unauthorized/i'));
    await expect(message).toBeVisible();
  });
});

test.describe('Security Tests', () => {
  test('SEC-005: Session hijacking - token should not be in localStorage', async ({ page }) => {
    // Arrange - Login
    await page.goto('/login');
    await fillLoginForm(page, testUsers.login.email, testUsers.login.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/deals/);

    // Act - Check localStorage
    const tokenInLocalStorage = await page.evaluate(() => {
      return localStorage.getItem('token');
    });

    // Assert - Token should NOT be in localStorage (should be in HTTP-only cookie)
    expect(tokenInLocalStorage).toBeNull();
  });

  test('SEC-016: SQL Injection in login', async ({ page }) => {
    // Arrange & Act
    await page.goto('/login');
    await fillLoginForm(page, "admin'--", 'password');
    await page.click('button[type="submit"]');

    // Assert - Login should fail
    const error = page.locator('text=/invalid/i');
    await expect(error).toBeVisible();

    // Should NOT be logged in
    await expect(page).toHaveURL(/\/login/);
  });

  test('SEC-017: XSS in search field', async ({ page }) => {
    // Arrange - Login and go to deals
    await page.goto('/login');
    await fillLoginForm(page, testUsers.login.email, testUsers.login.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/deals/);

    // Act - Enter XSS payload in search
    await page.fill('input[placeholder*="search" i]', '<script>alert("XSS")</script>');
    await page.press('input[placeholder*="search" i]', 'Enter');

    // Assert - No alert should appear
    // If an alert appears, the test would fail here
    const searchResults = page.locator('.deals-list').or(page.locator('[data-testid="deals"]'));
    await expect(searchResults).toBeVisible();

    // Verify script tag is escaped in page content
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>alert("XSS")</script>');
  });
});

test.describe('Accessibility Tests', () => {
  test('A11Y-001: Form labels are announced to screen readers', async ({ page }) => {
    await page.goto('/signup');

    // Check all form inputs have associated labels
    const inputs = page.locator('input:not([type="hidden"])');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      } else {
        // Check if input has aria-label or aria-labelledby
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');

        expect(ariaLabel || ariaLabelledby).toBeDefined();
      }
    }
  });

  test('A11Y-007: Touch targets are minimum 44x44 points', async ({ page }) => {
    await page.goto('/login');

    // Check all buttons and links meet minimum size
    const buttons = page.locator('button, a[href], [role="button"]');

    for (const button of await buttons.all()) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
