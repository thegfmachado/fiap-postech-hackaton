import type { IAuthQueries } from "@mindease/database/queries";
import { HttpError } from "@mindease/services";
import { IAuthService } from "./auth-service.interface";
import type { IUser } from "@mindease/models";

export class AuthService implements IAuthService {
  private readonly queries: IAuthQueries

  constructor(queries: IAuthQueries) {
    this.queries = queries;
  }

  async signUp(user: IUser) {
    try {
      const newUser = await this.queries.signUp(user);
      return newUser;
    } catch (error) {
      console.error('Error signing up user:', error);
      throw new HttpError(500, 'Error signing up user');
    }
  }

  async signInWithPassword(email: string, password: string) {
    try {
      const user = await this.queries.signInWithPassword(email, password);

      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      console.error('Error signing in:', error);
      throw new HttpError(500, 'Error signing in');
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.queries.getCurrentUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw new HttpError(500, 'Error getting current user');
    }
  }

  async signOut() {
    try {
      await this.queries.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw new HttpError(500, 'Error signing out');
    }
  }

  async forgotPassword(email: string) {
    try {
      await this.queries.forgotPassword(email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new HttpError(500, 'Error sending password reset email');
    }
  }

  async updateUser(user: Partial<IUser>) {
    try {
      const updatedUser = await this.queries.updateUser(user);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new HttpError(500, 'Error updating user');
    }
  }
}
