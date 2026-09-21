import { getDBConnection } from '@/config/db';
import { ProductCategoryEntity } from '@/modules/catalog/products/product-category/model/product-category.entity';
import { DeepPartial, Repository, TreeRepository } from 'typeorm';
import { CategoriesEntity } from '../model/categories.entity';

/**
 * Data-access layer: owns HOW category data is read/written.
 * TypeORM repository instances are cached to avoid re-resolving on every call.
 */
export class CategoriesRepository {
  private repository?: Repository<CategoriesEntity>;
  private treeRepository?: TreeRepository<CategoriesEntity>;

  private async getRepository(): Promise<Repository<CategoriesEntity>> {
    if (!this.repository) {
      const connection = await getDBConnection();
      this.repository = connection.getRepository(CategoriesEntity);
    }
    return this.repository as Repository<CategoriesEntity>;
  }

  private async getTreeRepository(): Promise<TreeRepository<CategoriesEntity>> {
    if (!this.treeRepository) {
      const connection = await getDBConnection();
      this.treeRepository = connection.getTreeRepository(CategoriesEntity);
    }
    return this.treeRepository as TreeRepository<CategoriesEntity>;
  }

  /** Full nested tree (all levels, all statuses) - admin list + parent select. */
  async findTree(): Promise<CategoriesEntity[]> {
    const treeRepository = await this.getTreeRepository();
    return treeRepository.findTrees();
  }

  /** Active top-level categories with active children - public menu. */
  async findActiveMenuTree(): Promise<CategoriesEntity[]> {
    const repository = await this.getRepository();
    return repository
      .createQueryBuilder('category')
      .leftJoin('category.children', 'children')
      .select([
        'category.id',
        'category.name',
        'category.slug',
        'category.image',
        'category.description',
        'category.level',
        'category.active',
        'category.isFeatured',
        'category.createdAt',
        'category.updatedAt',
        'children.id',
        'children.name',
        'children.slug',
        'children.image',
        'children.description',
        'children.level',
        'children.active',
        'children.isFeatured',
        'children.createdAt',
        'children.updatedAt',
      ])
      .where('category.active = :active', { active: true })
      .andWhere('category.parentId IS NULL')
      .andWhere('(children.id IS NULL OR children.active = :active)', { active: true })
      .getMany();
  }

  async findManyPaginated(
    skip?: number,
    take?: number,
    search?: string,
  ): Promise<[CategoriesEntity[], number]> {
    const repository = await this.getRepository();
    const queryBuilder = repository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .orderBy('category.id', 'DESC');

    if (search && search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      queryBuilder.andWhere(
        '(LOWER(category.name) LIKE :q OR LOWER(category.slug) LIKE :q OR LOWER(category.description) LIKE :q)',
        { q },
      );
    }

    if (skip !== undefined && take !== undefined) {
      queryBuilder.skip(skip).take(take);
    }

    return queryBuilder.getManyAndCount();
  }

  async findById(id: string | number): Promise<CategoriesEntity | null> {
    const repository = await this.getRepository();
    return repository.findOne({ where: { id: Number(id) }, relations: { children: true } });
  }

  /** How many products reference this category (hard FK - blocks deletion). */
  async countProductReferences(id: number): Promise<number> {
    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductCategoryEntity);
    return repository.countBy({ categoryId: id });
  }

  async create(data: DeepPartial<CategoriesEntity>): Promise<CategoriesEntity> {
    const repository = await this.getRepository();
    return repository.save(repository.create(data));
  }

  async save(data: DeepPartial<CategoriesEntity>): Promise<CategoriesEntity> {
    const repository = await this.getRepository();
    return repository.save(data);
  }

  async delete(id: string | number): Promise<void> {
    const repository = await this.getRepository();
    await repository.delete({ id: Number(id) });
  }
}

export const categoriesRepository = new CategoriesRepository();
