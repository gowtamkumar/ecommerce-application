import { getBrands } from '@/lib/apis/brand';
import { getPublicCategories } from '@/lib/apis/categories';
import { getColors } from '@/lib/apis/color';
import React from 'react'
import FilterSidebarDetails from './FilterSidebarDetails';

export default async function FilterSidebar() {
  const category = await getPublicCategories();
  const brands = await getBrands();
  const colors = await getColors();
  return (
    <FilterSidebarDetails categories={category.data} brands={brands.data} colors={colors.data} />
  )
}
