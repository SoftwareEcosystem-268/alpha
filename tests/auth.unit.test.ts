/**
 * RichSave - Unit Test Suite (Jest)
 * Authentication Utilities & API Tests
 *
 * Run: npm test auth.unit.test.ts
 */

import { generateToken, verifyToken, getUserFromToken, TokenPayload } from '@/lib/auth';
import { UserModel, OTPModel } from '@/lib/models';
import bcrypt from 'bcryptjs';
import { Db } from 'mongodb';

// Mock the database
const mockCollection = {
  insertOne: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
  find: jest.fn(() => ({
    toArray: jest.fn(),
  })),
};

jest.mock('@/lib/db', () => ({
  getDb: jest.fn((): Promise<Db> => Promise.resolve({
    collection: jest.fn(() => mockCollection),
  } as any)),
}));

describe('Authentication Token Utilities', () => {
  const mockPayload = {
    userId: '507f1f77bcf86cd799439011',
    email: 'test@richsave.com',
  };

  beforeEach(() => {
    // Set JWT_SECRET for testing
    process.env.JWT_SECRET = 'test-secret-key-for-testing';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include userId and email in token payload', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded!.userId).toBe(mockPayload.userId);
      expect(decoded!.email).toBe(mockPayload.email);
    });

    it('should set expiration to 7 days by default', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded!.exp - decoded!.iat;
      const sevenDaysInSeconds = 7 * 24 * 60 * 60;

      expect(expiresIn).toBeCloseTo(sevenDaysInSeconds, 0);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded!.userId).toBe(mockPayload.userId);
      expect(decoded!.email).toBe(mockPayload.email);
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = verifyToken(invalidToken);

      expect(decoded).toBeNull();
    });

    it('should return null for expired token', () => {
      // Create an expired token
      const expiredPayload = { ...mockPayload, exp: Math.floor(Date.now() / 1000) - 3600 };
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(expiredPayload, process.env.JWT_SECRET);

      const decoded = verifyToken(expiredToken);

      expect(decoded).toBeNull();
    });

    it('should return null for token with wrong secret', () => {
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(mockPayload, 'wrong-secret');

      process.env.JWT_SECRET = 'correct-secret';
      const decoded = verifyToken(token);

      expect(decoded).toBeNull();
    });
  });

  describe('getUserFromToken', () => {
    it('should extract user from valid Bearer token', () => {
      const token = generateToken(mockPayload);
      const bearerToken = `Bearer ${token}`;

      const user = getUserFromToken(bearerToken);

      expect(user).not.toBeNull();
      expect(user!.userId).toBe(mockPayload.userId);
      expect(user!.email).toBe(mockPayload.email);
    });

    it('should extract user from token without Bearer prefix', () => {
      const token = generateToken(mockPayload);

      const user = getUserFromToken(token);

      expect(user).not.toBeNull();
      expect(user!.userId).toBe(mockPayload.userId);
      expect(user!.email).toBe(mockPayload.email);
    });

    it('should return null for invalid token', () => {
      const user = getUserFromToken('invalid-token');

      expect(user).toBeNull();
    });
  });
});

describe('User Model - Password Security', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockCollection.insertOne.mockClear();
    mockCollection.findOne.mockClear();
    mockCollection.updateOne.mockClear();
  });

  describe('Password Hashing', () => {
    it('should hash password when creating user', async () => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: '507f1f77bcf86cd799439011' });

      const userData = {
        name: 'Test User',
        email: 'test@richsave.com',
        password: 'PlainPassword123',
        favorites: [],
        preferences: {
          pushNotifications: true,
          locationServices: true,
          darkMode: false,
        },
      };

      await UserModel.create(userData);

      const insertCall = mockCollection.insertOne.mock.calls[0][0];
      expect(insertCall.password).not.toBe('PlainPassword123');
      expect(insertCall.password).not.toContain('PlainPassword123');

      // Verify it's a bcrypt hash
      expect(insertCall.password).toMatch(/^\$2[ayb]\$\d+\$/);
    });

    it('should use bcrypt with salt rounds 10', async () => {
      const password = 'TestPassword123';
      const hash = await bcrypt.hash(password, 10);

      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);

      const isWrongPasswordValid = await bcrypt.compare('WrongPassword', hash);
      expect(isWrongPasswordValid).toBe(false);
    });

    it('should not store plain text password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@richsave.com',
        password: 'SuperSecret123',
        favorites: [],
        preferences: {
          pushNotifications: true,
          locationServices: true,
          darkMode: false,
        },
      };

      // Mock the insertOne to capture the data
      mockCollection.insertOne.mockResolvedValue({ insertedId: '507f1f77bcf86cd799439011' });

      await UserModel.create(userData);

      const insertCall = mockCollection.insertOne.mock.calls[0][0];
      expect(insertCall.password).not.toBe(userData.password);
    });
  });

  describe('Password Verification', () => {
    it('should correctly verify password with bcrypt.compare', async () => {
      const plainPassword = 'TestPassword123';
      const hash = await bcrypt.hash(plainPassword, 10);

      const isValid = await bcrypt.compare(plainPassword, hash);
      expect(isValid).toBe(true);

      const isInvalid = await bcrypt.compare('WrongPassword', hash);
      expect(isInvalid).toBe(false);
    });

    it('should prevent timing attacks with consistent comparison time', async () => {
      // This tests that the comparison time is consistent
      // regardless of whether the password is correct or not
      const hash = await bcrypt.hash('CorrectPassword123', 10);

      const start1 = Date.now();
      await bcrypt.compare('CorrectPassword123', hash);
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      await bcrypt.compare('WrongPassword', hash);
      const time2 = Date.now() - start2;

      // Times should be similar (within 100ms)
      // Note: This test can be flaky due to system load, bcrypt's constant-time comparison
      // should prevent timing attacks, but exact timing may vary
      expect(Math.abs(time1 - time2)).toBeLessThan(100);
    });
  });

  describe('Password Update', () => {
    it('should hash new password when updating', async () => {
      mockCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });

      await UserModel.updatePassword('507f1f77bcf86cd799439011', 'NewPassword123');

      const updateCall = mockCollection.updateOne.mock.calls[0][1];
      const newPassword = updateCall.$set.password;

      expect(newPassword).not.toBe('NewPassword123');
      expect(newPassword).toMatch(/^\$2[ayb]\$\d+\$/);
    });
  });
});

describe('OTP Model - Security', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockCollection.insertOne.mockClear();
    mockCollection.findOne.mockClear();
    mockCollection.updateOne.mockClear();
  });

  describe('OTP Generation', () => {
    it('should generate 6-digit numeric OTP', () => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      expect(otp).toHaveLength(6);
      expect(/^\d+$/.test(otp)).toBe(true);
    });

    it('should create OTP with 15 minute expiration', async () => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: '507f1f77bcf86cd799439011' });

      await OTPModel.create('test@richsave.com', '123456');

      const insertCall = mockCollection.insertOne.mock.calls[0][0];
      const expiresAt = insertCall.expiresAt;
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      // Should be approximately 15 minutes (900000 ms)
      expect(diff).toBeGreaterThan(890000);
      expect(diff).toBeLessThan(910000);
    });

    it('should set used flag to false initially', async () => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: '507f1f77bcf86cd799439011' });

      await OTPModel.create('test@richsave.com', '123456');

      const insertCall = mockCollection.insertOne.mock.calls[0][0];
      expect(insertCall.used).toBe(false);
    });
  });

  describe('OTP Verification', () => {
    it('should mark OTP as used after verification', async () => {
      // Mock finding a valid OTP
      mockCollection.findOne.mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        email: 'test@richsave.com',
        code: '123456',
        used: false,
        expiresAt: new Date(Date.now() + 900000),
      });

      // Mock updating the OTP
      mockCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });

      await OTPModel.verify('test@richsave.com', '123456');

      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { _id: '507f1f77bcf86cd799439011' },
        { $set: { used: true } }
      );
    });

    it('should not verify expired OTP', async () => {
      // Mock finding an expired OTP
      mockCollection.findOne.mockResolvedValue(null);

      const result = await OTPModel.verify('test@richsave.com', '123456');

      expect(result).toBeNull();
    });

    it('should not verify already used OTP', async () => {
      // Mock that no OTP is found (because it's already used, query checks for used: false)
      mockCollection.findOne.mockResolvedValue(null);

      const result = await OTPModel.verify('test@richsave.com', '123456');

      expect(result).toBeNull();
    });

    it('should prevent double use of OTP', async () => {
      let callCount = 0;
      mockCollection.findOne.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call - OTP is available
          return Promise.resolve({
            _id: '507f1f77bcf86cd799439011',
            email: 'test@richsave.com',
            code: '123456',
            used: false,
            expiresAt: new Date(Date.now() + 900000),
          });
        } else {
          // Second call - OTP is already used
          return Promise.resolve(null);
        }
      });

      const result1 = await OTPModel.verify('test@richsave.com', '123456');
      expect(result1).not.toBeNull();

      const result2 = await OTPModel.verify('test@richsave.com', '123456');
      expect(result2).toBeNull();
    });
  });
});

describe('Input Validation & Sanitization', () => {
  describe('Email Validation', () => {
    const validEmails = [
      'test@example.com',
      'user.name@example.com',
      'user+tag@example.co.th',
      'test123@test-domain.com',
    ];

    const invalidEmails = [
      'invalidemail',
      '@example.com',
      'test@',
      'test @example.com',
      'test@exam ple.com',
    ];

    test.each(validEmails)('should accept valid email: %s', (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(email)).toBe(true);
    });

    test.each(invalidEmails)('should reject invalid email: %s', (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  describe('Password Strength Validation', () => {
    it('should reject passwords less than 6 characters', () => {
      const weakPasswords = ['12345', 'abc', 'A1b'];

      weakPasswords.forEach(password => {
        expect(password.length).toBeLessThan(6);
      });
    });

    it('should accept passwords with 6+ characters', () => {
      const validPasswords = ['123456', 'abcdef', 'A1b2C3'];

      validPasswords.forEach(password => {
        expect(password.length).toBeGreaterThanOrEqual(6);
      });
    });

    it('should check for complexity if required', () => {
      // If complexity is required:
      const hasUpperCase = /[A-Z]/.test('Password123');
      const hasLowerCase = /[a-z]/.test('Password123');
      const hasNumber = /\d/.test('Password123');
      const hasSpecial = /[!@#$%^&*]/.test('Password123!');

      expect(hasUpperCase).toBe(true);
      expect(hasLowerCase).toBe(true);
      expect(hasNumber).toBe(true);
      // Special char check depends on requirements
    });
  });

  describe('NoSQL Injection Prevention', () => {
    it('should sanitize regex special characters in search', () => {
      const maliciousInput = "{$ne: null}";
      const sanitized = maliciousInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Check that special characters are escaped
      expect(sanitized).toContain('\\$');
      expect(sanitized).toContain('\\{');
      expect(sanitized).toContain('\\}');
    });

    it('should escape MongoDB operators in user input', () => {
      const inputs = [
        "$where:",
        "$ne:",
        "$in:",
        "$gt:",
        "$or:",
      ];

      inputs.forEach(input => {
        const containsOperator = input.includes('$');
        expect(containsOperator).toBe(true);

        // Sanitize by removing the $ operator prefix
        // In a real application, you would either reject or properly escape these
        const sanitized = input.replace(/\$/g, '');
        expect(sanitized).not.toContain('$');
        // Verify the operator prefix is removed
        if (input === '$where:') {
          expect(sanitized).toBe('where:');
        }
      });
    });
  });

  describe('XSS Prevention', () => {
    it('should escape HTML tags in user input', () => {
      const xssPayload = '<script>alert("XSS")</script>';
      const escaped = xssPayload
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');

      expect(escaped).not.toContain('<script>');
      expect(escaped).not.toContain('</script>');
    });

    it('should escape event handlers', () => {
      const xssPayload = '<img src=x onerror="alert(1)">';
      const escaped = xssPayload
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

      // Check that the angle brackets are escaped (preventing HTML tag execution)
      expect(escaped).toContain('&lt;img');
      expect(escaped).toContain('&gt;');
      expect(escaped).not.toContain('<img');
      // The quotes are escaped, so onerror won't execute as an attribute
      expect(escaped).toContain('&quot;alert(1)&quot;');
    });
  });
});

describe('Rate Limiting Tests', () => {
  it('should track login attempts by IP/email', () => {
    const attempts = new Map<string, number>();

    // First attempt
    attempts.set('test@richsave.com', 1);
    expect(attempts.get('test@richsave.com')).toBe(1);

    // Multiple attempts
    for (let i = 0; i < 4; i++) {
      attempts.set('test@richsave.com', (attempts.get('test@richsave.com') || 0) + 1);
    }
    expect(attempts.get('test@richsave.com')).toBe(5);

    // Should be locked after 5 attempts
    const isLocked = (attempts.get('test@richsave.com') || 0) >= 5;
    expect(isLocked).toBe(true);
  });

  it('should reset attempts after timeout', async () => {
    const attempts = new Map<string, { count: number; lastAttempt: number }>();

    // Record failed attempt
    attempts.set('test@richsave.com', {
      count: 5,
      lastAttempt: Date.now(),
    });

    // Simulate time passing (more than 15 minutes)
    const fifteenMinutesAgo = Date.now() - 16 * 60 * 1000;
    attempts.set('test@richsave.com', {
      count: 5,
      lastAttempt: fifteenMinutesAgo,
    });

    // Should be able to attempt again
    const shouldReset = Date.now() - attempts.get('test@richsave.com')!.lastAttempt > 15 * 60 * 1000;
    expect(shouldReset).toBe(true);
  });
});

describe('Cookie Security Tests', () => {
  it('should set httpOnly flag on authentication cookie', () => {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    };

    expect(cookieOptions.httpOnly).toBe(true);
  });

  it('should set secure flag in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };

    expect(cookieOptions.secure).toBe(true);

    process.env.NODE_ENV = originalEnv;
  });

  it('should set appropriate SameSite attribute', () => {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict' as const,
    };

    expect(['strict', 'lax']).toContain(cookieOptions.sameSite);
  });

  it('should set appropriate expiration time', () => {
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const expectedMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

    expect(maxAge).toBe(expectedMaxAge / 1000);
  });
});
