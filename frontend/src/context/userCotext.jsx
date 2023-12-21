import { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const userContext = createContext();

export function UserProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const oneTime = useRef(0);

  if (oneTime.current === 0) {
    oneTime.current = 1;
    const cookie = document.cookie.split("=");
    if (cookie[0] === "token") {
      setToken(cookie[1].split(" ")[1]);
    }
  }
  useEffect(() => {
    const cookie = document.cookie.split("=");
    if (cookie[0] !== "token") {
      navigate("/login");
    }
  }, []);

  function handleSetUserToken(token) {
    setToken(token);
    navigate("/");
  }

  return (
    <userContext.Provider value={{ token, handleSetUserToken }}>
      {children}
    </userContext.Provider>
  );
}

export default userContext;
