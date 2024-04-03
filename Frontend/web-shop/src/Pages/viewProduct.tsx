import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import productService from '../Services/products.ts'

interface Product {
  id: string
  name: string
  price: number
  imageFilename: string
}

export const DisplayProductFullPage = () => {
  const { productId } = useParams<{ productId: string }>() 
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productId) {
          console.log("Fetching data for productId:", productId);
          const fetchedProduct = await productService.getProductById(productId)
          setProduct(fetchedProduct)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [productId])

  console.log("This is the product:", product)
  
  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Product: {product.name}</h1>
      <p>Price: €{product.price}</p>
      <img src={`/productPng/${product.imageFilename}`} alt={product.name} />
    </div>
  )
}
