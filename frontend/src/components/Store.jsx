import React, { useState, useEffect } from 'react';
import "../styles/Store.css"
import { useNavigate } from 'react-router-dom';
import Navbar from './subcomponents/NavBar';
import { fetchProducts, updateUser } from '../apiService';


const Store = () => {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [typeUser, settypeUser] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        const data = await fetchProducts();
        setProducts(data);
        if(localStorage.getItem("user") != "guest"){
        const user = JSON.parse(localStorage.getItem("user"));
        settypeUser("logged");
        setLikedProducts(user.favorites);
        setUserId(user._id);
        setToken(localStorage.getItem("token"))

        }else{
          settypeUser("guest")
          setLikedProducts(JSON.parse(localStorage.getItem("likedProducts")));
        }
    };
    fetchData();
  }, []);

  const toggleLikeSvg = async (productId) => {
    const productSection = document.getElementById(productId);
    const likeSection = productSection.querySelector('.like');

  
    if (likedProducts.includes(productId)) {
      const likedProductsNew = likedProducts.filter(id => id !== productId);
      if (likeSection) {
        likeSection.innerHTML = `<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
        </svg>`;
      }
      if (typeUser === "logged") {
        const user = JSON.parse(localStorage.getItem("user"));
        user.favorites = likedProductsNew;
        localStorage.setItem("user", JSON.stringify(user));

        await updateUser(userId, token, { favorites: likedProductsNew });
      } else {
        localStorage.setItem("likedProducts", JSON.stringify(likedProductsNew));
      }
      setLikedProducts(likedProductsNew);
               
    } else {
      const likedProductsNew = likedProducts.concat(productId);
  
      if (likeSection) {
        likeSection.innerHTML = `<svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" viewBox="0 0 24 24">
          <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
        </svg>`;
      }
      
      if (typeUser === "logged") {
        const user = JSON.parse(localStorage.getItem("user"));
        user.favorites = likedProductsNew;
        localStorage.setItem("user", JSON.stringify(user));
        await updateUser(userId, token, user);
      } else {
        localStorage.setItem("likedProducts", JSON.stringify(likedProductsNew));
      }
      setLikedProducts(likedProductsNew);
  
    }
  };


  const handleProductClick = (product) => {
    navigate('/product', { state: { productId: product._id, ...product } });
  };


  return (
    <div>
      <Navbar element="store" />
      <div className="product_display">
        <div className='products'>
          {products.map((product) => (
           
            <div className='product' key={product._id} id={product._id}>
             <div className="like" onClick={() => toggleLikeSvg(product._id)}>
              {likedProducts.includes(product._id) ? (
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" viewBox="0 0 24 24">
                  <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                </svg>
              )}
            </div>
              <img src={product.image} alt="remera" className="product-image"  onClick={() => handleProductClick(product)}/>
              <div className='info'><h2>{product.name}</h2><p>{product.price} $</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store