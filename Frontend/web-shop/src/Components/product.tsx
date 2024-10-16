import React from 'react'
import userService from '../Services/users'
import { useToken } from '../Services/currentUser'
import { Card } from '@mantine/core'
import './components.css'
import { useNavigate } from 'react-router'

interface ProductProps {
  id: string
  name: string
  price: number
  imageFilename: string
}

const Product: React.FC<ProductProps> = ({
  id,
  name,
  price,
  imageFilename,
}) => {
  const { token } = useToken()
  const navigate = useNavigate()

  const handleViewingProduct = (productId: string) => {
    try {
      navigate(`/viewProduct/${productId}`)
    } catch (error: any) {
      console.log(error.response?.data?.message)
      return error.response?.data?.message
    }
  }

  const handleAddingProduct = async () => {
    try {
      const response = await userService.addProductToBasket(id, token)
      console.log(response)
    } catch (error: any) {
      console.log(error.response.data.message)
      return error.response.data.message
    }
  }

  return (
    <Card
      shadow="xl"
      padding="lg"
      radius="xl"
      withBorder
      className="product-card"
    >
      <div className="product">
        <img src={`/productPng/${imageFilename}`} alt={name.toString()} />
        <div className="description">
          <p>
            <b>{name}</b>
          </p>
          <p>
            <b>€{price}</b>
          </p>
        </div>
        <div>
          <button
            id={name}
            className="addToCartBttn"
            onClick={handleAddingProduct}
          >
            Add To Cart
          </button>
          <button
            className="addToCartBttn"
            onClick={() => handleViewingProduct(id)}
          >
            {' '}
            View{' '}
          </button>
        </div>
      </div>
    </Card>
  )
}

export default Product
