import React from 'react'
import userService from '../Services/users'
import { useToken } from '../Services/currentUser'

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
        
        <button id={name} className="addToCartBttn" onClick={handleAddingProduct}>
          Add To Cart
        </button>
      </div>
    </div>
  )
}

export default Product
