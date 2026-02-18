import { describe, test, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth-service';
import { HttpError } from '@mindease/services';
import type { IAuthQueries } from '@mindease/database/queries';
import type { IUser } from '@mindease/models';
import type { User } from '@supabase/supabase-js';

describe('AuthService', () => {
  let authService: AuthService;
  let mockQueries: IAuthQueries;

  const mockSupabaseUser: User = {
    id: 'user-1',
    app_metadata: {},
    user_metadata: { name: 'Test User' },
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00.000Z',
    email: 'test@example.com',
  } as User;

  const mockIUser: IUser = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
  };

  beforeEach(() => {
    mockQueries = {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      getCurrentUser: vi.fn(),
      signOut: vi.fn(),
      forgotPassword: vi.fn(),
      updateUser: vi.fn(),
    } as IAuthQueries;

    authService = new AuthService(mockQueries);
  });

  test('should sign up a new user', async () => {
    const newUser: IUser = {
      email: 'newuser@example.com',
      name: 'New User',
      password: 'newPassword123',
    };

    const newSupabaseUser: User = {
      ...mockSupabaseUser,
      email: newUser.email,
      user_metadata: { name: newUser.name },
    };

    vi.mocked(mockQueries.signUp).mockResolvedValue(newSupabaseUser);

    const result = await authService.signUp(newUser);

    expect(result).toEqual(newSupabaseUser);
    expect(mockQueries.signUp).toHaveBeenCalledWith(newUser);
  });

  test('should throw HttpError when signup fails', async () => {
    vi.mocked(mockQueries.signUp).mockRejectedValue(new Error('Database error'));

    await expect(authService.signUp(mockIUser)).rejects.toThrow(HttpError);
    await expect(authService.signUp(mockIUser)).rejects.toThrow(
      'Error signing up user'
    );
  });

  test('should sign in user with valid credentials', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    vi.mocked(mockQueries.signInWithPassword).mockResolvedValue(mockSupabaseUser);

    const result = await authService.signInWithPassword(email, password);

    expect(result).toEqual(mockSupabaseUser);
    expect(mockQueries.signInWithPassword).toHaveBeenCalledWith(email, password);
  });

  test('should throw 404 when signing in with user not found', async () => {
    vi.mocked(mockQueries.signInWithPassword).mockResolvedValue(null);

    try {
      await authService.signInWithPassword('wrong@example.com', 'password');
      expect.fail('Should have thrown HttpError');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(404);
      expect((error as HttpError).message).toBe('User not found');
    }
  });

  test('should throw HttpError when signin fails', async () => {
    vi.mocked(mockQueries.signInWithPassword).mockRejectedValue(
      new Error('Database error')
    );

    try {
      await authService.signInWithPassword('test@example.com', 'password');
      expect.fail('Should have thrown HttpError');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(500);
    }
  });

  test('should return current user', async () => {
    vi.mocked(mockQueries.getCurrentUser).mockResolvedValue(mockSupabaseUser);

    const result = await authService.getCurrentUser();

    expect(result).toEqual(mockSupabaseUser);
    expect(mockQueries.getCurrentUser).toHaveBeenCalled();
  });

  test('should throw HttpError when getting current user fails', async () => {
    vi.mocked(mockQueries.getCurrentUser).mockRejectedValue(
      new Error('Database error')
    );

    await expect(authService.getCurrentUser()).rejects.toThrow(HttpError);
    await expect(authService.getCurrentUser()).rejects.toThrow(
      'Error getting current user'
    );
  });

  test('should sign out user', async () => {
    vi.mocked(mockQueries.signOut).mockResolvedValue(undefined);

    await authService.signOut();

    expect(mockQueries.signOut).toHaveBeenCalled();
  });

  test('should throw HttpError when signout fails', async () => {
    vi.mocked(mockQueries.signOut).mockRejectedValue(new Error('Auth error'));

    await expect(authService.signOut()).rejects.toThrow(HttpError);
    await expect(authService.signOut()).rejects.toThrow('Error signing out');
  });

  test('should send password reset email', async () => {
    const email = 'test@example.com';
    vi.mocked(mockQueries.forgotPassword).mockResolvedValue(undefined);

    await authService.forgotPassword(email);

    expect(mockQueries.forgotPassword).toHaveBeenCalledWith(email);
  });

  test('should throw HttpError when sending password reset email fails', async () => {
    vi.mocked(mockQueries.forgotPassword).mockRejectedValue(
      new Error('Email service error')
    );

    await expect(authService.forgotPassword('test@example.com')).rejects.toThrow(
      HttpError
    );
    await expect(authService.forgotPassword('test@example.com')).rejects.toThrow(
      'Error sending password reset email'
    );
  });

  test('should update user data', async () => {
    const updatedUser = { ...mockSupabaseUser, user_metadata: { name: 'Updated Name' } };
    vi.mocked(mockQueries.updateUser).mockResolvedValue(updatedUser);

    const updateData: Partial<IUser> = { name: 'Updated Name' };
    const result = await authService.updateUser(updateData);

    expect(result).toEqual(updatedUser);
    expect(mockQueries.updateUser).toHaveBeenCalledWith(updateData);
  });

  test('should throw HttpError when updating user fails', async () => {
    vi.mocked(mockQueries.updateUser).mockRejectedValue(new Error('Database error'));

    await expect(authService.updateUser({ name: 'Test' })).rejects.toThrow(HttpError);
    await expect(authService.updateUser({ name: 'Test' })).rejects.toThrow(
      'Error updating user'
    );
  });
});
