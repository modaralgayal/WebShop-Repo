import React, { useState, useEffect } from 'react';
import productService from '../Services/products';
import Product from './product';
import "./shop.css"

interface ProductInt {  
  _id: string;
  name: string;
  price: number;
  icon: string;
  // Define other properties based on your product schema
}
const Shop: React.FC = () => {
  const [products, setProducts] = useState<ProductInt[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts: ProductInt[] = await productService.getAll();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []); // Run once on component mount

  return (
    <div className="shop">
      <div className="shopTitle">
        <h1> Modar's Shop </h1>
      </div>

      <div className="products">
        {/* Render your products using the Product component */}
        {products.map((product) => (
          <Product
                id={product._id.toString()}
                name={product.name}
                price={product.price}
                imageFilename={product.icon}         />
        ))}
      </div>
    </div>
  );
};

export default Shop;
