import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import productService from '../Services/products.ts'
import { NativeSelect, Button } from '@mantine/core'
import userService from '../Services/users'
import { useToken } from '../Services/currentUser'
import './view.css'

interface Product {
  id: string
  name: string
  price: number
  icon: string
  description: string
}

export const DisplayProductFullPage = () => {
  const { productId } = useParams<{ productId: string | undefined }>()
  const [product, setProduct] = useState<Product | null>(null)
  const { token } = useToken()

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

  const handleAddingProduct = async () => {
    try {
      if (!productId) {
        console.error('Product ID is undefined')
        return
      }
      console.log('Id is:', productId)
      await userService.addProductToBasket(productId, token)
      console.log('Product added to cart successfully.')
    } catch (error: any) {
      console.log(
        error.response?.data.message ||
          'An error occurred while adding the product to the cart.',
      )
    
    }
  }

  return (
    <div>
      <div className="productInfo">
        <p className="productName">{product.name}</p>
        <p className="productDescription">{product.description}</p>
        <p className="productPrice">{product.price},00 €</p>
        <NativeSelect
          className="sizes"
          size="xl"
          radius="lg"
          data={['XS', 'S', 'M', 'L', 'XL']}
          defaultValue="Select Size"
        />
        <Button
          className="button"
          variant="filled"
          color="rgba(0, 0, 0, 1)"
          radius="xs"
          onClick={handleAddingProduct}
        >
          Add To Cart
        </Button>
      </div>

      <div className="productCard">
        <img
          className="productImage"
          src={`/productPng/${product.icon}`}
          alt={product.name.toString()}
        />
      </div>
    </div>
  )
}
