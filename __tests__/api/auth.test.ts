import { loginUser, registerUser, verifyToken, generateToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Authentication Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('JWT Token Functions', () => {
    test('generateToken should create a valid token', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: UserRole.CUSTOMER,
      };

      const token = generateToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    test('verifyToken should validate a token correctly', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: UserRole.CUSTOMER,
      };

      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(payload.userId);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.role).toBe(payload.role);
    });

    test('verifyToken should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });

  describe('loginUser', () => {
    test('should return user and token for valid credentials', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        password: '$2a$10$hashedpassword', // Mock hashed password
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.CUSTOMER,
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Mock bcrypt compare to return true
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await loginUser('test@example.com', 'password123');

      expect(result).toBeDefined();
      expect(result?.user.email).toBe('test@example.com');
      expect(result?.token).toBeDefined();
    });

    test('should return null for invalid email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await loginUser('invalid@example.com', 'password123');

      expect(result).toBeNull();
    });

    test('should return null for invalid password', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        password: '$2a$10$hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.CUSTOMER,
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Mock bcrypt compare to return false
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await loginUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });

    test('should return null for inactive user', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        password: '$2a$10$hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.CUSTOMER,
        isActive: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await loginUser('test@example.com', 'password123');

      expect(result).toBeNull();
    });
  });

  describe('registerUser', () => {
    test('should create new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        phone: '05551234567',
      };

      const mockCreatedUser = {
        id: 'new-user-id',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: UserRole.CUSTOMER,
      };

      // Mock that user doesn't exist
      mockPrisma.user.findUnique.mockResolvedValue(null);
      // Mock user creation
      mockPrisma.user.create.mockResolvedValue(mockCreatedUser as any);

      const result = await registerUser(userData);

      expect(result).toBeDefined();
      expect(result?.user.email).toBe(userData.email);
      expect(result?.token).toBeDefined();
    });

    test('should return null if user already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User',
      };

      const mockExistingUser = {
        id: 'existing-user-id',
        email: userData.email,
      };

      // Mock that user already exists
      mockPrisma.user.findUnique.mockResolvedValue(mockExistingUser as any);

      const result = await registerUser(userData);

      expect(result).toBeNull();
    });
  });
});