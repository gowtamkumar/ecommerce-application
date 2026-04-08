import { Repository } from 'typeorm';
import { getDBConnection } from '@/config/db';
import { UserEntity } from '../model/user.entity';

export class UserRepository {
  private repository: Repository<UserEntity> | null = null;

  private async getRepository(): Promise<Repository<UserEntity>> {
    if (!this.repository) {
      const connection = await getDBConnection();
      this.repository = connection.getRepository(UserEntity);
    }
    return this.repository!;
  }

  async findAll(options: { skip?: number; take?: number; relations?: any; select?: any }) {
    const repository = await this.getRepository();
    const [data, total] = await repository.findAndCount({
      ...options,
      order: { createdAt: 'DESC' } as any,
    });
    return { data, total };
  }

  async findById(id: string | number, relations?: any) {
    const repository = await this.getRepository();
    return repository.findOne({ where: { id: id as any }, relations });
  }

  async findByUsername(username: string) {
    const repository = await this.getRepository();
    return repository.findOne({ where: { username } });
  }

  async findByEmail(email: string) {
    const repository = await this.getRepository();
    return repository.findOne({ where: { email } });
  }

  async findByResetToken(token: string) {
    const repository = await this.getRepository();
    return repository.findOne({ where: { resetToken: token } });
  }

  async create(userData: Partial<UserEntity>) {
    const repository = await this.getRepository();
    const user = repository.create(userData);
    return repository.save(user);
  }

  async update(id: string | number, updateData: Partial<UserEntity>) {
    const repository = await this.getRepository();
    const user = await this.findById(id);
    if (!user) return null;
    const updatedUser = repository.merge(user, updateData);
    return repository.save(updatedUser);
  }

  async delete(id: string | number) {
    const repository = await this.getRepository();
    return repository.delete(id);
  }
}

export const userRepository = new UserRepository();
