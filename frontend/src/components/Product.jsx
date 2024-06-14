import { useLocation, Link } from 'react-router-dom';
import styles from "../styles/Product.module.css";
import React, { useState, useEffect } from 'react';


import { updateUser } from '../apiService';

const ProductPage = () => {
  const location = useLocation();
  const { productId, ...product } = location.state;
  const [typeUser, settypeUser] = useState('');
  const [userId, setUserId] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        if(localStorage.getItem("user") != "guest"){
          const user = JSON.parse(localStorage.getItem("user"));
          settypeUser("logged");
          setUserId(user._id);
          setCart(user.cart)
        }else{
          settypeUser("guest")
          setCart(localStorage.getItem("cart"))
        }
    };
    fetchData();
  }, []);


  const addToCart = async () => {
    const existingProduct = cart.find((item) => item.id === productId);
  
    if (typeUser === "guest") {
      if (existingProduct) {
        alert(`${product.name} is already in the cart.`);
      } else {
        cart.push({ product_id: productId, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Added ${product.name} to the cart.`);
        document.getElementById(productId).innerHTML = `  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clipRule="evenodd" />
        </svg>`;
      }
    } else if (typeUser === "logged") {
      if (existingProduct) {
        alert(`${product.name} is already in the cart.`);
      } else {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token")
        user.cart.push({ id_product: productId, quantity: 1 });
        localStorage.setItem('user', JSON.stringify(user));
        await updateUser(userId, token, user);
        setCart(user.cart);
        alert(`Added ${product.name} to the cart.`);
        document.getElementById(productId).innerHTML = `  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clipRule="evenodd" />
        </svg>`;
      }
    }
  };

  const isProductInCart = cart?.find((item) => item.id_product === productId) !== undefined;
  

  return (
    <div>
      <div className={styles.back}>
        <Link to="/store"><span className="material-symbols-outlined"> arrow_back </span></Link>
      </div>
      <div className={styles.product}>
        <div className={styles.centraliser}>
          <div className={styles.img_section}>
            <img src={product.image} alt="" />
          </div>
          <div className={styles.information}>
            <div>
              <div className={styles.div_information}>
                <h2>{product.name}</h2>
                <div className={styles.center_information}>
                  <p>{product.description}</p>
                  <p><b>Brand:</b> {product.brand}</p>
                  <p><b>Price:</b> {product.price}</p>
                </div>
              </div>
              <button onClick={addToCart} id={productId}>
              {isProductInCart ? (
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;