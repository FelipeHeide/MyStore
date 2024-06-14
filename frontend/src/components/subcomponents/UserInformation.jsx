import React, { useState, useEffect } from 'react';
import Style from "../../styles/UserInformation.module.css";
import { getOrder, getProduct } from '../../apiService';


const UserInformation = ({ user_information }) => {
  const [activeTab, setActiveTab] = useState('information');
  const [orders, setOrders] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [currentFavoriteIndex, setCurrentFavoriteIndex] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (userFromLocalStorage && userFromLocalStorage.orders) {

          const orderIds = userFromLocalStorage.orders;

          const fetchedOrders = await Promise.all(

            orderIds.map(async (orderId) => {

              const order = await getOrder(orderId, token);


              const productsWithDetails = await Promise.all(
                order.products.map(async (product) => {
                
                  const productDetails = await getProduct(product.id_product, token);

                  return {
                    ...productDetails,
                    quantity: product.quantity,
                  };

                })
              );
              return { ...order, products: productsWithDetails };
            })
          );
          setOrders(fetchedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);
  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (userFromLocalStorage && userFromLocalStorage.favorites) {
          const favoriteIds = userFromLocalStorage.favorites;
          const fetchedFavoriteProducts = await Promise.all(
            favoriteIds.map(async (productId) => {
              const product = await getProduct(productId, token);
              return product;
            })
          );
          setFavoriteProducts(fetchedFavoriteProducts);
        }
      } catch (error) {
        console.error('Error fetching favorite products:', error);
      }
    };
    fetchFavoriteProducts();
  }, []);



  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleNextOrder = () => {
    setCurrentOrderIndex((prevIndex) => (prevIndex + 1) % orders.length);
  };

  const handlePreviousOrder = () => {
    setCurrentOrderIndex((prevIndex) => (prevIndex - 1 + orders.length) % orders.length);
  };

  const handleNextFavorite = () => {
    setCurrentFavoriteIndex((prevIndex) => (prevIndex + 1) % favoriteProducts.length);
  };

  const handlePreviousFavorite = () => {
    setCurrentFavoriteIndex((prevIndex) => (prevIndex - 1 + favoriteProducts.length) % favoriteProducts.length);
  };

  const currentOrder = orders[currentOrderIndex];
  const currentFavoriteProduct = favoriteProducts[currentFavoriteIndex];



  return (
    <div className={Style.userInformationContainer}>
      <div className={Style.tabButtons}>
        <button
          className={`${Style.tabButton} ${activeTab === 'information' ? Style.active : ''}`}
          onClick={() => handleTabClick('information')}
        >
          General
        </button>
        <button
          className={`${Style.tabButton} ${activeTab === 'orders' ? Style.active : ''}`}
          onClick={() => handleTabClick('orders')}
        >
          Orders
        </button>
        <button
          className={`${Style.tabButton} ${activeTab === 'favorites' ? Style.active : ''}`}
          onClick={() => handleTabClick('favorites')}
        >
          Favorites
        </button>
      </div>
      <div className={Style.tabContent}>
        {activeTab === 'information' && (
          <div className={Style.generalInformation}>
            <h1>Welcome, {user_information.username}!</h1>
            <p><b>name:</b> {user_information.name}</p>
            <p><b>username:</b> {user_information.username}</p>
            <p><b>Email:</b> {user_information.email}</p>
            <p><a href="mailto:felipe.heide7@gmail.com">Contact us</a> to change your password.</p>
            <button className={Style.logOut} onClick={() => {
  localStorage.clear();
  window.location.reload();
}}>Log Out</button>          </div>
        )}
        {activeTab === 'orders' && (
          <div className={Style.generalInformation}>
            <h1>Orders</h1>
            <div className={Style.orderInformation}>
              {orders.length === 0 ? (
                <p>You haven't placed any orders yet. Go to the store to start shopping!</p>
              ) : (
                <div>
                  <p><b>Order:</b> {currentOrder?.products[0]?.name} &#40;{currentOrder?.products[0]?.price} $&#41; x {currentOrder?.products[0]?.quantity}</p>
                  <p><b>Address:</b> {currentOrder?.address}</p>
                  <p><b>Paid At:</b> {currentOrder?.paidAt ? new Date(currentOrder.paidAt).toLocaleString() : 'Not paid yet'}</p>
                  <p><b>Delivered At:</b> {currentOrder?.deliveredAt ? new Date(currentOrder.deliveredAt).toLocaleString() : 'Not delivered yet'}</p>
                  <p><b>Created At:</b> {new Date(currentOrder?.createdAt).toLocaleString()}</p>
                  <div className={Style.favoriteProductNavigation}>

                  <button className={Style.changeOrderButton}  onClick={handlePreviousOrder}>-</button>
                  <b className={Style.orderIndex}>{currentOrderIndex+1} /  {orders.length}</b>
                  <button className={Style.changeOrderButton}  onClick={handleNextOrder}>+</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
       {activeTab === 'favorites' && (
  <div className={Style.generalInformation}>
    <h1>Favorites</h1>
    {favoriteProducts.length === 0 ? (
      <p>You don't have any favorite products yet.</p>
    ) : (
      <div className={Style.favoriteProductContainer}>
        <div className={Style.favoriteProductDetails}>
          <h3>{currentFavoriteProduct.name}</h3>
          <p>{currentFavoriteProduct.description}</p>
          <p><b>Price:</b> {currentFavoriteProduct.price}</p>
        </div>
        <div className={Style.favoriteProductNavigation}>
          <button className={Style.changeOrderButton} onClick={handlePreviousFavorite}>-</button>
          <b className={Style.orderIndex}>{currentFavoriteIndex + 1} / {favoriteProducts.length}</b>
          <button className={Style.changeOrderButton} onClick={handleNextFavorite}>+</button>
        </div>
      </div>
    )}
  </div>
)}
      </div>
    </div>
  );
};

export default UserInformation;