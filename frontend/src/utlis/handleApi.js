import axios from "axios";

const baseURL = "http://localhost:3001/api";

const handleSignup = async (
  name,
  email,
  password,
  setIsLoading,
  setUserId,
  navigate
) => {
  try {
    setIsLoading(true);
    const data = { name, email, password };
    const response = await axios.post(baseURL + "/signup", data);
    setUserId(response.data._id);
    navigate("/");
  } catch (error) {
    console.log("There was an error during singup", error.response);
  } finally {
    setIsLoading(false);
  }
};

const handleSignin = async (
  email,
  password,
  setIsLoading,
  setUserId,
  navigate
) => {
  try {
    const data = { email, password };
    const response = await axios.post(baseURL + "/signin", data);
    setUserId(response.data._id);
    navigate("/");
  } catch (error) {
    console.log("There was an error during signin", error.response);
  } finally {
    setIsLoading(false);
  }
};

export { handleSignup, handleSignin };
