import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import productService from '../Services/products.ts'
import { NativeSelect, Button } from '@mantine/core'
import './view.css'

interface Product {
  id: string
  name: string
  price: number
  icon: string
  description: string
}

export const DisplayProductFullPage = () => {
  const { productId } = useParams<{ productId: string }>()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productId) {
          const fetchedProduct = await productService.getProductById(productId)
          setProduct(fetchedProduct)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [productId])

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <p className="productName">{product.name}</p>
      <p className="productDescription">{product.description}</p>
      <p className="productPrice">{product.price},00 €</p>
      <NativeSelect
        className="sizes"
        size="xl"
        radius="lg"
        data={['XS', 'S', 'M', 'L', 'XL']}
        value="Select Size"
      />
      <Button
        className="button"
        variant="filled"
        color="rgba(0, 0, 0, 1)"
        radius="xs"
      >
        Add To Cart
      </Button>
      <img
        className="productImage"
        src={`/productPng/${product.icon}`}
        alt={product.name.toString()}
      />
    </div>
  )
}
