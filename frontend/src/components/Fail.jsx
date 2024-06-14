import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Fail.module.css';

const Fail = () => {
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
        <h1 className={styles.title}>Failed!</h1>
        <p className={styles.message}>There was an error processing your order.</p>
        <p className={styles.message}>You will be redirected to your account in a few seconds...</p>
      </div>
    </div>
  );
};

export default Fail;