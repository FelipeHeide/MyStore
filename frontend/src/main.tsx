import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "./styles/General.css"

const user = localStorage.getItem('user');
if (!user) {
localStorage.setItem('user', "guest");
localStorage.setItem("likedProducts", "[]")
localStorage.setItem('cart', "[]");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
)