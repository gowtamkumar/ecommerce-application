import { Status } from '@/enums/status.enum';
import { isForeignKeyViolation } from '@/utils/dbErrors';
import ErrorResponse from '@/utils/errorResponse';
import { fileDeleteFunction } from '@/utils/fileDeleteFunction';
import { createSlug } from '@/utils/slugify';
import type { PaginationQuery } from '@/utils/pagination';
import { BrandEntity } from '../model/brand.entity';
import { brandsRepository } from '../repository/brand.repository';
import { CreateBrandInput, PaginatedResult, UpdateBrandInput } from '../types/brand.types';

/**
 * Business-logic layer: orchestrates repositories + shared services,
 * enforces domain rules, and throws typed errors the controller translates.
 * No express / HTTP types here - fully unit-testable.
 */
export class BrandsService {
  async getAll(pagination: PaginationQuery): Promise<PaginatedResult> {
    const [data, total] = await brandsRepository.findManyPaginated(
      pagination.skip,
      pagination.take,
    );
    return { data, total, page: pagination.page, perPage: pagination.perPage };
  }

  async getById(id: string): Promise<BrandEntity> {
    const brand = await brandsRepository.findById(id);
    if (!brand) throw new ErrorResponse(`Brand not found of id #${id}`, 404);
    return brand;
  }

  async create(input: CreateBrandInput): Promise<BrandEntity> {
    return brandsRepository.create({
      name: input.name,
      slug: createSlug(input.name),
      image: input.image ?? undefined,
      status: (input.status as Status) ?? Status.Active,
      userId: input.userId,
    });
  }

  async update(id: string, input: UpdateBrandInput): Promise<BrandEntity> {
    const brand = await brandsRepository.findById(id);
    if (!brand) throw new ErrorResponse(`Brand not found of id #${id}`, 404);

    Object.assign(brand, {
      name: input.name,
      slug: createSlug(input.name),
      ...(input.image !== undefined ? { image: input.image } : {}),
      ...(input.status !== undefined ? { status: input.status as Status } : {}),
    });

    return brandsRepository.save(brand);
  }

  async remove(id: string): Promise<BrandEntity> {
    const brand = await brandsRepository.findById(id);
    if (!brand) throw new ErrorResponse(`Brand not found of id #${id}`, 404);

    const productCount = await brandsRepository.countProducts(Number(id));
    if (productCount > 0) {
      throw new ErrorResponse(
        `Cannot delete: ${productCount} product(s) use this brand. Reassign them to another brand first.`,
        409,
      );
    }

    // Best-effort cleanup of the associated file record + MinIO object.
    if (brand.image) {
      await fileDeleteFunction([brand.image]);
    }

    try {
      await brandsRepository.delete(id);
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ErrorResponse(
          'This brand is referenced elsewhere (e.g. discounts) and cannot be deleted. Remove those references first.',
          409,
        );
      }
      throw error;
    }
    return brand;
  }
}

export const brandsService = new BrandsService();
