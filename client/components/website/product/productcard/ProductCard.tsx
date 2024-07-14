import React from 'react'
import ProductCardDetails from './ProductCardDetails'
import { getProducts } from '@/lib/apis/product'

export default async function ProductCard() {
  const products = await getProducts()
  return (
    <ProductCardDetails products={products} />
  )
}
