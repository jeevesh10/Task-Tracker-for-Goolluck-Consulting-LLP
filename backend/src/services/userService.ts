import { Role } from '@prisma/client';
import { UpdateRoleDto } from '../dto';
import { userRepository } from '../repositories/userRepository';
import { AppError } from '../types';

export const userService = {
  async getAllUsers() {
    return userRepository.findAll();
  },

  async getAssignees() {
    return userRepository.findAssignees();
  },

  async updateUserRole(userId: string, dto: UpdateRoleDto) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return userRepository.updateRole(userId, dto.role as Role);
  },
};
