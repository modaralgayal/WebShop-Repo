import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import productService from '../Services/products.ts'
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
    </div>
  )
}
