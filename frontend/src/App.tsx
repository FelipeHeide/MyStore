import Home from "./components/Home"
import Store from "./components/Store"
import Product from "./components/Product"
import Cart from "./components/Cart"
import Account from "./components/Account"
import Succes from "./components/Succes"
import Fail from "./components/Fail"
import { useEffect, useState } from 'react';
import { getUser } from './apiService';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        const token = localStorage.getItem('token');
        if (userId && token) {
          const userData = await getUser(userId, token);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileWidth = windowWidth < 1300;

  if (isMobileWidth) {
    alert('This website is not accessible on small screens YET');
    window.open("about:blank", "_self");
    window.close();

  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="/success" element={<Succes />} />
        <Route path="/failed" element={<Fail />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App