import '../styles/Home.css';
import { Link } from 'react-router-dom';
import Navbar from './subcomponents/NavBar';
import circle from '../imgs/circulo.png'; 
import rectangle from '../imgs/rectangulo.png'; 
import hexagone from '../imgs/hexagono.png'; 
import triangle from '../imgs/triangulo.png'; 



const Home = () => {
  return (
    <>
      <Navbar element="home" />
      <div className='centraliser'>
        <h1 className='title'>MyStore, where textiles are exquisitely crafted.</h1>
        <Link to="/store" className='store'>
          STORE
        </Link>
        <img className="rectangle" src={triangle} alt="" />
        <img className="circle" src={hexagone} alt="" />
        <img className="triangle" src={rectangle} alt="" />
        <img className="hexagone" src={circle} alt="" />
      </div>
    </>
  );
};

export default Home;