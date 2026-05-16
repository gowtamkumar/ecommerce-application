import { UserEntity } from '../model/user.entity';
import { userRepository } from '../repository/user.repository';

import { ILike } from 'typeorm';

export class UserService {
  async getAllUsers(page: number = 1, limit: number = 10, filters?: { role?: string; search?: string }) {
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};
    if (filters?.role) {
      where.role = filters.role;
    }
    if (filters?.search) {
      where.name = ILike(`%${filters.search}%`); // Or email, or username depending on logic
    }

    const { data, total } = await userRepository.findAll({
      skip,
      take,
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        type: true,
        point: true,
        image: true,
        role: true,
        status: true,
        lastLogin: true,
        lastLogout: true,
        ipAddress: true,
        diviceId: true,
        dob: true,
      },
    });

    return {
      users: data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string | number) {
    return userRepository.findById(id);
  }

  async getUserByEmail(email: string) {
    return userRepository.findByEmail(email);
  }

  async registerUser(userData: Partial<UserEntity>) {
    return userRepository.create(userData);
  }

  async updateUser(id: string | number, updateData: Partial<UserEntity>) {
    return userRepository.update(id, updateData);
  }

  async deleteUser(id: string | number) {
    return userRepository.delete(id);
  }
}

export const userService = new UserService();
