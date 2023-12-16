import axios from "axios";

// const baseURL = "http://localhost:3001/api";
const baseURL = "https://keyblitzapi.onrender.com/api";

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
    const response = await axios.post(baseURL + "/signup", data, {
      withCredentials: true,
    });

    document.cookie = `token=Bearer ${response.data}`;
    // setUserId(response.data);
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
    const response = await axios.post(baseURL + "/signin", data, {
      withCredentials: true,
    });

    document.cookie = `token=Bearer ${response.data}`;
    // setUserId(response.data);
    // let weekFromNow = new Date(Date.now() + 86400 * 1000 * 7);
    // weekFromNow = weekFromNow.toGMTString();
    // document.cookie = `userID=${response.data}; expires= ${weekFromNow}`;
    navigate("/");
  } catch (error) {
    console.log("There was an error during signin", error.response);
  } finally {
    setIsLoading(false);
  }
};

const sendData = async (copyData) => {
  try {
    const response = await axios.post(baseURL + "/userDataIn", copyData, {
      withCredentials: true,
    });
  } catch (error) {
    console.log("There was an error sending Data", error.response);
  }
};

export { handleSignup, handleSignin, sendData };
