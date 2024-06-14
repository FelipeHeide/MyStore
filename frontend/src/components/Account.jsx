import { useState, useEffect } from 'react';
import Style from "../styles/Account.module.css";
import Navbar from './subcomponents/NavBar';
import AccountForms from './subcomponents/AccountForms';
import UserInformation from './subcomponents/UserInformation';
import { Login, Register } from '../apiService';

const Account = () => {
  const [loggedIn, setloggedIn] = useState(false);
  const [haveAnUser, setHaveAnUser] = useState(true);
  const [user, setuser] = useState({});
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser != 'guest') {
      setuser(JSON.parse(storedUser));
      setloggedIn(true);
    }
  }, []);

  const login = async (event) => {
    event.preventDefault();
    const data = await Login(username, password);
    setuser(data.user);
    setloggedIn(true);
    console.log(data.token)
    localStorage.clear()
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);


  };

  const register = async (event) => {
    event.preventDefault();
    const data = await Register(name, username, email, password);
    setuser(data.user);
    setloggedIn(true);
    console.log(data.token)
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);

  };

  return (
    <div>
      <Navbar element="account" />
      <div className={Style.holder_section}>
        <div className={Style.centraliser}>
          {loggedIn ? (
            <UserInformation user_information={user}/>
          ) : (
            <AccountForms
              haveAnUser={haveAnUser}
              setHaveAnUser={setHaveAnUser}
              name={name}
              setName={setName}
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              login={login}
              register={register}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;