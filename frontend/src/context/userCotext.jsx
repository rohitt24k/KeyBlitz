import { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkBackendOnline } from "../utlis/handleApi";

const userContext = createContext();

export function UserProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [ownName, setOwnName] = useState("");
  const [userId, setUserId] = useState("");
  const [isServerOnline, setIsServerOnline] = useState(true);
  const oneTime = useRef(0);

  if (oneTime.current === 0) {
    oneTime.current = 1;
    const cookie = document.cookie.split("; ");
    if (cookie.length === 3) {
      cookie.forEach((coo) => {
        const name = coo.split("=")[0];
        const value = coo.split("=")[1];
        if (name === "userId") {
          setUserId(value);
        } else if (name === "token") {
          setToken(value);
        } else if (name === "name") {
          setOwnName(value);
        }
      });
    }
  }
  useEffect(() => {
    const cookie = document.cookie.split("; ");
    if (cookie.length !== 3) {
      navigate("/login");
    }
    checkBackendOnline(setIsServerOnline);
  }, [navigate]);

  function handleSetUserToken(token) {
    setToken(token);
    navigate("/");
  }

  return (
    <userContext.Provider
      value={{
        token,
        handleSetUserToken,
        userId,
        setUserId,
        ownName,
        setOwnName,
        isServerOnline,
        setIsServerOnline,
      }}
    >
      {children}
    </userContext.Provider>
  );
}

export default userContext;
