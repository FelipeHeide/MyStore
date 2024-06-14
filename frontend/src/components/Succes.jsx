import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Succes.module.css';

const Succes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/account');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.messageBox}>
        <h1 className={styles.title}>Success!</h1>
        <p className={styles.message}>Your order has been successfully submitted.</p>
        <p className={styles.message}>You will be redirected to your account in a few seconds...</p>
      </div>
    </div>
  );
};

export default Succes;