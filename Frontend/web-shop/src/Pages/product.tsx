import React from "react";

interface ProductProps {
  name: string;
  price: number;
  imageFilename: string;
}

const Product: React.FC<ProductProps> = ({ name, price, imageFilename }) => {
  const path = `productPng/${imageFilename.toString()}`
  console.log(path)
  return (
    <div className="product">
      <h2>{name}</h2>
      <p>{price}</p>
      <img
        src={path}
        alt={name.toString()}
      />
      {/* Render other product details */}
    </div>
  );
};

export default Product;
