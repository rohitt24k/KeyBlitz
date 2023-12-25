import { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const userContext = createContext();

export function UserProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const oneTime = useRef(0);

  if (oneTime.current === 0) {
    oneTime.current = 1;
    const cookie = document.cookie.split("; ");
    if (cookie.length === 2) {
      if (cookie[0].split("=")[0] === "userId") {
        setUserId(cookie[0].split("=")[1]);
        setToken(cookie[1].split("=")[1]);
      } else {
        setUserId(cookie[1].split("=")[1]);
        setToken(cookie[0].split("=")[1]);
      }
    }
  }
  useEffect(() => {
    const cookie = document.cookie.split("; ");
    if (cookie.length !== 2) {
      navigate("/login");
    }
  }, []);

  function handleSetUserToken(token) {
    setToken(token);
    navigate("/");
  }

  return (
    <userContext.Provider
      value={{ token, handleSetUserToken, userId, setUserId }}
    >
      {children}
    </userContext.Provider>
  );
}

export default userContext;
