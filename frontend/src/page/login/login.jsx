import { useEffect, useState } from "react";
import styles from "./login.module.css";
// import InputBox from "../../component/inputBox/inputBox";
// import Button from "../../component/button/button";
// import { handleSignin, handleSignup } from "../../utlis/handleApi";
import { useNavigate } from "react-router-dom";
import InputBox from "../../components/inputBox/inputBox";
import Button from "../../components/button/button";

function Login({ userId, setUserId }) {
  const [isRegistered, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if userId is already present (user is logged in)
    if (userId) {
      // Navigate to the home page
      navigate("/");
    }
  }, [userId, navigate]);

  const handleLoginDataChange = (e, text) => {
    const change = e.target.value;
    setLoginData((d) => {
      d[text] = change;
      return { ...d };
    });
  };

  const handleSubmitButton = (e) => {
    e.preventDefault();
    if (!isRegistered && !isLoading) {
      // handleSignup(
      //   loginData.name,
      //   loginData.email,
      //   loginData.password,
      //   setIsLoading,
      //   setUserId,
      //   navigate
      // );
    }
    if (isRegistered && !isLoading) {
      // handleSignin(
      //   loginData.email,
      //   loginData.password,
      //   setIsLoading,
      //   setUserId,
      //   navigate
      // );
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageContent}>
        <div className={styles.leftContainer}>
          <form className={styles.loginContainer} onSubmit={handleSubmitButton}>
            <header>
              {isRegistered ? (
                <h4>
                  Welcome Back <span>👋</span>
                </h4>
              ) : (
                <h4>
                  Register a new account <span>👋</span>
                </h4>
              )}
            </header>
            <main>
              {!isRegistered && (
                <InputBox
                  label="Name"
                  name="name"
                  type="text"
                  value={loginData.name}
                  handleChange={handleLoginDataChange}
                  placeholder="Rohit Kumar"
                  disabled={isLoading}
                />
              )}

              <InputBox
                label="Email"
                name="email"
                type="email"
                disabled={isLoading}
                value={loginData.email}
                handleChange={handleLoginDataChange}
                placeholder="example@email.com"
              />

              <InputBox
                label="Password"
                name="password"
                type="password"
                disabled={isLoading}
                value={loginData.password}
                handleChange={handleLoginDataChange}
                placeholder="At least 8 characters"
              />

              <p className={styles.forgotPasswordLink}>Forgot Password?</p>

              <Button
                text={isRegistered ? "Sign in" : "Sign up"}
                type="submit"
                handleClick={handleSubmitButton}
              />
            </main>
            <footer>
              {isRegistered
                ? `Don't have an account?`
                : `Already have an account`}{" "}
              {
                <span
                  onClick={() => {
                    setIsRegister((value) => !value);
                    setLoginData({
                      name: "",
                      email: "",
                      password: "",
                    });
                  }}
                >
                  {isRegistered ? "Sign up" : "Sign in"}
                </span>
              }
            </footer>
          </form>
        </div>
        <div className={styles.rightContainer}>{/* img */}</div>
      </div>
    </div>
  );
}

export default Login;
