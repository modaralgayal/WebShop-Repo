import React, { useState } from 'react'
import { useToken } from '../Services/currentUser'
import userService from '../Services/users'
import './cart.css'

export const CartItem = (props: any) => {
  const { data, onCartItemChanged } = props
  // @ts-ignore
  const { _id, category, count, icon, name, price } = data
  const { token } = useToken()

  const [inputValue, setInputValue] = useState(count)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handlePlus = async () => {
    try {
      setInputValue((prevCount: any) => prevCount + 1)
      await userService.addProductToBasket(_id, token)
      onCartItemChanged()
    } catch (error: any) {
      throw new Error(error.response.data.message)
    }
  }

  const handleMinus = async () => {
    if (inputValue === 1) {
      const confirmed = window.confirm(
        'Are you sure you want to delete the item from the basket?',
      )
      if (!confirmed) {
        return
      }
    }

    try {
      setInputValue((prevCount: any) => Math.max(prevCount - 1, 0))
      await userService.deleteProductFromBasket(_id, token)
      onCartItemChanged()
    } catch (error: any) {
      throw new Error(error.response.data.message)
    }
  }

  return (
    <div className="cartItem">
      <img src={`/productPng/${icon}`} alt={name.toString()} />
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p>{price}€</p>

        <div className="countHandler">
          <button onClick={handleMinus}> - </button>
          <input value={inputValue} onChange={handleInputChange} />
          <button onClick={handlePlus}> + </button>
        </div>
      </div>
    </div>
  )
}
