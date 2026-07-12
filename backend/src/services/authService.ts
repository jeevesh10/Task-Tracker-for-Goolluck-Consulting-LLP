import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { config } from '../config';
import { SignupDto, LoginDto } from '../dto';
import { userRepository } from '../repositories/userRepository';
import { AppError, JwtPayload } from '../types';

function generateToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwtSecret, options);
}

export const authService = {
  async signup(dto: SignupDto) {
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) {
      throw new AppError(409, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: (dto.role as Role) || Role.MEMBER,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  },

  async login(dto: LoginDto) {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  },
};
