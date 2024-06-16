import { useState, useEffect } from 'react';
import Style from "../styles/Cart.module.css";
import Navbar from './subcomponents/NavBar';
import { getProduct, updateUser, Order } from '../apiService';



const Cart = () => {
  const [products, setProducts] = useState([]);
  const [typeUser, setTypeUser] = useState('');
  const [country, setCountry] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [ShippingCity, setShippingCity] = useState('');


  


  useEffect(() => {
    const fetchCartProducts = async () => {
      if(localStorage.getItem("user") === "guest"){
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const productPromises = cartItems.map(async (item) => {
    
          const product = await getProduct(item.product_id);
          return { ...product, quantity: item.quantity, _id: item.product_id };
        });
        const fetchedProducts = await Promise.all(productPromises);
        console.log("shhshshshshhshs")
        console.log(fetchedProducts)
        setProducts(fetchedProducts);
        setTypeUser("guest")
      }
        else{
          const cartItems = JSON.parse(localStorage.getItem('user')).cart || [];
        const productPromises = cartItems.map(async (item) => {
          const product = await getProduct(item.id_product);
          return { ...product, quantity: item.quantity, _id: item.id_product };
        });
        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts);
          setTypeUser("logged")
        }
    };
  
    fetchCartProducts();
  }, []);
  
  const handleQuantityChange = async (productId, delta) => {
    

    if (typeUser === "guest") {
      const updatedCart = JSON.parse(localStorage.getItem('cart')).map((item) => {
        if (item.product_id === productId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity >= 0) {
            
            const quantityElement = document.getElementById(`quantity-${productId}`);

            const priceElement = document.getElementById(`price-${productId}`);
            if (quantityElement && priceElement) {
              quantityElement.innerHTML = `${newQuantity}`;
              products.map((product) => {
                if (product._id === productId) {
                  priceElement.innerHTML = `${(product.price * (item.quantity + delta)).toFixed(2)} $`;
                }
              });
            }
            return { ...item, quantity: newQuantity };
          } else {
            return item;
          }
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else if (typeUser === "logged") {
      const updatedCart = JSON.parse(localStorage.getItem('user')).cart.map((item) => {
        if (item.id_product === productId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity >= 0) {
            const quantityElement = document.getElementById(`quantity-${productId}`);
            const priceElement = document.getElementById(`price-${productId}`);
            if (quantityElement && priceElement) {
              quantityElement.innerHTML = `${newQuantity}`;
              products.map((product) => {
                if (product.id === productId) {
                  priceElement.innerHTML = `${(product.price * (item.quantity + delta)).toFixed(2)} $`;
                }
              });
            }
            return { ...item, quantity: newQuantity };
          } else {
            return item;
          }
        }
        return item;
      });
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token") 
      user.cart = updatedCart;
      localStorage.setItem("user", JSON.stringify(user));
      await updateUser(user._id, token, user);
    }
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId && product.quantity + delta >= 0
          ? { ...product, quantity: product.quantity + delta }
          : product
      )
    );
  };

  const handlePlaceOrder = async(e) => {
    e.preventDefault();   

    let user = JSON.parse(localStorage.getItem('user'))
    let products = JSON.parse(localStorage.getItem('user')).cart
    let address = country + " / " + ShippingCity + " / " + shippingAddress
  
    Order(user, products, address)
  };

  return (
    <div>
      <Navbar element="cart" />
      <div className={Style.parent}>
        <div className={Style.centraliser}>
          <div className={Style.products_information}>
            <div className={Style.info}>
              <p>Product</p>
              <p>Quantity</p>
              <p>Price</p>
            </div>
            {products.length === 0 ? (
              <div className={Style.empty_cart}>
                <p>There is nothing in the cart, go to the store.</p>
              </div>
            ) : (
              products.map((product, index) => (
                <div key={index} className={Style.product}>
                  <div className={Style.product_information}>
                    <img className={Style.product_img} src={product.image} alt="" />
                    <div className={Style.product_info}>
                      <p>{product.category}</p>
                      <p>{product.name}</p>
                      <p>{product.brand}</p>
                    </div>
                  </div>
                  <div className={Style.quantity}>
                    <button onClick={() => handleQuantityChange(product._id, -1)}>-</button>
                    <p id={`quantity-${product._id}`}>{product.quantity}</p>
                    <button onClick={() => handleQuantityChange(product._id, 1)}>+</button>
                  </div>
                  <div className={Style.price}>
                    <p id={`price-${product._id}`}>{(product.price * product.quantity).toFixed(2)} $</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={Style.checkout_information}>
  <div>
  <form onSubmit={handlePlaceOrder}>
                <h1>Shipping</h1>
                <div className={Style.select}>
                  <select
                    className={Style.select__input}
                    name="country-selector"
                    id="country-selector"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="0">Country</option>
                    <option value="IT">Italy</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                  <svg
                    className={Style.select__arrow}
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                  >
                    <polyline
                      points="3.5,6.5 8,11 12.5,6.5"
                      strokeWidth="2"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></polyline>
                  </svg>
                </div>
                <div className={Style.shipping_adress}>
                  <input
                    type="text"
                    id="shipping-city"
                    name="shipping-city"
                    placeholder="State / City"
                    required
                    value={ShippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                  />
                  <input type="text" id="shipping-address" name="shipping-address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Street & number" required />
                </div>
                <h1>Total</h1>
                <div className={Style.total}>
                  {products.length === 0 ? (
                    <div className={Style.empty_cart}>
                      <p>There is nothing in the cart.</p>
                    </div>
                  ) : (
                    <div className={Style.total_price}>
                      {products.reduce(
                        (total, product) => total + (product.price * product.quantity),
                        0
                      ).toFixed(2)}{' '}
                      $
                    </div>
                  )}
                </div>
                <div className={Style.checkout_div}>
                  <button type="submit" className={Style.checkout_button}>
                    Place Order
                  </button>
                </div>
              </form>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default Cart;