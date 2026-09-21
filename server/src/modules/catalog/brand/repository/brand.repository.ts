import { getDBConnection } from '@/config/db';
import { ProductEntity } from '@/modules/catalog/products/product/model/product.entity';
import { DeepPartial, Repository } from 'typeorm';
import { BrandEntity } from '../model/brand.entity';

/**
 * Data-access layer: owns HOW brand data is read/written.
 * The TypeORM repository instance is cached to avoid re-resolving on every call.
 */
export class BrandsRepository {
  private repository?: Repository<BrandEntity>;

  private async getRepository(): Promise<Repository<BrandEntity>> {
    if (!this.repository) {
      const connection = await getDBConnection();
      this.repository = connection.getRepository(BrandEntity);
    }
    return this.repository as Repository<BrandEntity>;
  }

  async findManyPaginated(skip: number, take: number): Promise<[BrandEntity[], number]> {
    const repository = await this.getRepository();
    return repository.findAndCount({ skip, take, order: { id: 'ASC' } });
  }

  async findById(id: string | number): Promise<BrandEntity | null> {
    const repository = await this.getRepository();
    return repository.findOneBy({ id: Number(id) });
  }

  /** How many products use this brand (hard FK - blocks deletion). */
  async countProducts(id: number): Promise<number> {
    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductEntity);
    return repository.countBy({ brandId: id });
  }

  async create(data: DeepPartial<BrandEntity>): Promise<BrandEntity> {
    const repository = await this.getRepository();
    return repository.save(repository.create(data));
  }

  async save(data: DeepPartial<BrandEntity>): Promise<BrandEntity> {
    const repository = await this.getRepository();
    return repository.save(data);
  }

  async delete(id: string | number): Promise<void> {
    const repository = await this.getRepository();
    await repository.delete({ id: Number(id) });
  }
}

export const brandsRepository = new BrandsRepository();
