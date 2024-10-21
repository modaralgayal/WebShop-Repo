import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToken } from '../Services/currentUser';
import { apiBaseUrl } from '../constants';
import './orders.css'; // Import your CSS file

export const Orders = () => {
  const [orders, setOrders] = useState<Array<{ product: string; quantity: number; _id: string }>>([]);
  const [products, setProducts] = useState<Map<string, { name: string; price: number }>>(new Map());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { token } = useToken();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/orders`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
          setOrders(response.data.ordered);
        } else {
          setErrorMessage('Failed to fetch orders.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setErrorMessage('Error fetching orders.');
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setErrorMessage('User not logged in.');
    }
  }, [token]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (orders.length === 0) return;

      try {
        const productIds = orders.map(order => order.product);
        const promises = productIds.map(id => axios.get(`${apiBaseUrl}/api/products/${id}`));
        const results = await Promise.all(promises);

        const productMap = new Map();
        results.forEach(result => {
          const { data } = result;
          productMap.set(data._id, { name: data.name, price: data.price });
        });

        setProducts(productMap);
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorMessage('Error fetching product details.');
      }
    };

    fetchProducts();
  }, [orders]);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="ordersContainer"> {/* Main container class */}
      <h2 className="ordersHeader">Your Orders</h2> {/* Header class */}
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul className="ordersList"> {/* List class */}
          {orders.map((order) => (
            <li className="orderItem" key={order._id}> {/* Item class */}
              <div className="orderDetail">
                <strong>Product:</strong> {products.get(order.product)?.name || 'Loading...'}
              </div>
              <div className="orderDetail">
                <strong>Price:</strong> €{products.get(order.product)?.price?.toFixed(2) || 'Loading...'}
              </div>
              <div className="orderDetail">
                <strong>Quantity:</strong> {order.quantity}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
