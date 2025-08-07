import { User, IUser } from '../models/User';
import { AppError } from '../utils/AppError';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'; 

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  static async register(data: RegisterData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Create new user
    const user = await User.create(data);

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, accessToken, refreshToken };
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    // Check if user exists and password is correct
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user || !(await user.comparePassword(data.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, accessToken, refreshToken };
  }

  static async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: undefined });
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }

  static async updateProfile(userId: string, data: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { ...data },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}