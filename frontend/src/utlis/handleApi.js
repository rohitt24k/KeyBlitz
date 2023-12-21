import axios from "axios";

// const baseURL = "http://192.168.1.70:3001/api";
const baseURL = "https://keyblitzapi.onrender.com/api";

const handleSignup = async (
  name,
  email,
  password,
  setIsLoading,
  handleSetUserToken
) => {
  try {
    setIsLoading(true);
    const data = { name, email, password };
    const response = await axios.post(baseURL + "/signup", data, {
      withCredentials: true,
    });

    document.cookie = `token=Bearer ${response.data}`;
    handleSetUserToken(response.data);
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

  handleSetUserToken
) => {
  try {
    const data = { email, password };
    const response = await axios.post(baseURL + "/signin", data, {
      withCredentials: true,
    });

    document.cookie = `token=Bearer ${response.data}`;
    handleSetUserToken(response.data);
  } catch (error) {
    console.log("There was an error during signin", error.response);
  } finally {
    setIsLoading(false);
  }
};

const sendData = async (copyData) => {
  try {
    const response = await axios.post(
      baseURL + "/userDataIn",
      { data: copyData, token: document.cookie.split("=")[1] },
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.log("There was an error sending Data", error.response);
  }
};

export { handleSignup, handleSignin, sendData };
