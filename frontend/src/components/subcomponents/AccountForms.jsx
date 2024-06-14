import Style from "../../styles/Account.module.css";

const AccountForms = (props) => {
  return (
    props.haveAnUser ? (
      <div className={Style.login_form}>
        <h2>Welcome</h2>
        <form onSubmit={props.register}>
          <input
            type="text"
            placeholder="Name"
            value={props.name}
            onChange={(e) => props.setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={props.username}
            onChange={(e) => props.setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={props.email}
            onChange={(e) => props.setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={props.password}
            onChange={(e) => props.setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Have an account? <b onClick={() => props.setHaveAnUser(!props.haveAnUser)}>LOGIN</b>
        </p>
      </div>
    ) : (
      <div className={Style.login_form}>
        <h2>Welcome</h2>
        <form onSubmit={props.login}>
          <input
            type="text"
            placeholder="Username"
            value={props.username}
            onChange={(e) => props.setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={props.password}
            onChange={(e) => props.setPassword(e.target.value)}
            required
          />
          <button type="submit">Log in</button>
        </form>
        <p>
          No account? <b onClick={() => props.setHaveAnUser(!props.haveAnUser)}>REGISTER</b>
        </p>
      </div>
    )
  );
};

export default AccountForms;