import { isForeignKeyViolation } from '@/utils/dbErrors';
import ErrorResponse from '@/utils/errorResponse';
import { fileDeleteFunction } from '@/utils/fileDeleteFunction';
import { createSlug } from '@/utils/slugify';
import { toAntdTreeRows } from '@/utils/tree';
import { CategoriesEntity } from '../model/categories.entity';
import { categoriesRepository } from '../repository/categories.repository';
import {
  CreateCategoryInput,
  MAX_DEPTH,
  PaginatedResult,
  UpdateCategoryInput,
} from '../types/categories.types';

/**
 * Business-logic layer: orchestrates repositories + shared services,
 * enforces domain rules, and throws typed errors the controller translates.
 * No express / HTTP types here - fully unit-testable.
 */
export class CategoriesService {
  async getAll(
    pagination?: { page?: number; perPage?: number; skip?: number; take?: number },
    search?: string,
  ): Promise<PaginatedResult> {
    const [data, total] = await categoriesRepository.findManyPaginated(
      pagination?.skip,
      pagination?.take,
      search,
    );
    const rows = toAntdTreeRows(data);
    return {
      data: rows as any,
      total,
      page: pagination?.page ?? 1,
      perPage: pagination?.perPage ?? total,
    };
  }

  /** Admin tree used by the antd table + parent select - single endpoint, both consumers. */
  async getTree() {
    const trees = await categoriesRepository.findTree();
    return toAntdTreeRows(trees);
  }

  /** Active nested menu for the public storefront header. */
  async getMenu() {
    return categoriesRepository.findActiveMenuTree();
  }

  async getById(id: string): Promise<CategoriesEntity> {
    const category = await categoriesRepository.findById(id);
    if (!category) throw new ErrorResponse('Category not found', 404);
    return category;
  }

  async create(input: CreateCategoryInput): Promise<CategoriesEntity> {
    const slug = createSlug(input.name);

    let level = 1;
    let parent: CategoriesEntity | null = null;

    if (input.parentId) {
      parent = await categoriesRepository.findById(input.parentId);
      if (!parent) throw new ErrorResponse('Parent category not found', 400);
      if (parent.level >= MAX_DEPTH)
        throw new ErrorResponse('No new child allowed for this category', 400);
      level = parent.level + 1;
    }

    return categoriesRepository.create({
      name: input.name,
      slug,
      image: input.image ?? undefined,
      description: input.description ?? undefined,
      level,
      parent: parent ?? undefined,
      isFeatured: input.isFeatured,
      active: input.active ?? true,
      userId: input.userId,
    });
  }

  async update(id: string, input: UpdateCategoryInput): Promise<CategoriesEntity> {
    const category = await categoriesRepository.findById(id);
    if (!category) throw new ErrorResponse('Category not found', 400);

    const slug = createSlug(input.name);

    // When a parent is selected, re-attach and fix the level; otherwise keep the current parent.
    if (input.parentId) {
      const parentCategory = await categoriesRepository.findById(input.parentId);
      if (!parentCategory) throw new ErrorResponse('Parent category not found', 400);

      Object.assign(category, {
        name: input.name,
        slug,
        image: input.image,
        description: input.description,
        level: parentCategory.level + 1,
        parent: parentCategory,
        active: input.active,
        isFeatured: input.isFeatured,
      });
    } else {
      Object.assign(category, {
        name: input.name,
        slug,
        image: input.image,
        description: input.description,
        active: input.active,
        isFeatured: input.isFeatured,
      });
    }

    return categoriesRepository.save(category);
  }

  async remove(id: string): Promise<CategoriesEntity> {
    const category = await categoriesRepository.findById(id);
    if (!category) throw new ErrorResponse('Category not found', 404);

    const childrenCount = category.children?.length ?? 0;
    if (childrenCount > 0) {
      throw new ErrorResponse(
        `Cannot delete: this category contains ${childrenCount} sub-categor${childrenCount === 1 ? 'y' : 'ies'}. Move or delete them first.`,
        409,
      );
    }

    const productCount = await categoriesRepository.countProductReferences(Number(id));
    if (productCount > 0) {
      throw new ErrorResponse(
        `Cannot delete: ${productCount} product(s) are assigned to this category. Unassign them first.`,
        409,
      );
    }

    // Best-effort cleanup of the associated file record + MinIO object.
    if (category.image) {
      await fileDeleteFunction([category.image]);
    }

    try {
      await categoriesRepository.delete(id);
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ErrorResponse(
          'This category is referenced elsewhere (e.g. posts, discounts) and cannot be deleted. Remove those references first.',
          409,
        );
      }
      throw error;
    }
    return category;
  }
}

export const categoriesService = new CategoriesService();
