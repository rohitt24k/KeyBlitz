import axios from "axios";

// const baseURL = "http://192.168.25.201:3001/api";
const baseURL = "https://keyblitzapi.onrender.com/api";

// const cookie = document.cookie.split("; ");
// let token;
// if (cookie[0].split("=") === "token") {
//   token = cookie[0].split("=")[1];
// } else {
//   token = cookie[1].split("=")[1];
// }

const checkBackendOnline = async (setIsServerOnline) => {
  try {
    const timerFunction = () => {
      setIsServerOnline(false);
    };

    const timerId = setTimeout(timerFunction, 5000);
    const response = await axios.get(baseURL + "/status");
    if (response.data) {
      setIsServerOnline(true);
      clearTimeout(timerId);
    }
  } catch (error) {
    // console.log(error);
  }
};

const handleSignup = async (
  name,
  email,
  password,
  handleSetUserToken,
  setIsLoading,
  setUserId,
  setError,
  setOwnName
) => {
  try {
    setIsLoading(true);
    const data = { name, email, password };
    const response = await axios.post(baseURL + "/signup", data, {
      withCredentials: true,
    });
    const { token, id, ownName } = response.data;
    setUserId(id);
    setOwnName(ownName);

    let expires = new Date();
    expires.setDate(expires.getDate() + 7);

    document.cookie = `userId=${id}; expires=${expires}`;
    document.cookie = `token=Bearer ${token}; expires=${expires}`;
    document.cookie = `name=${ownName}; expires=${expires}`;
    handleSetUserToken(`Bearer ${token}`);
  } catch (error) {
    if (error.response.data.message === "the user already exists") {
      setError((prev) => {
        return { ...prev, email: "The user is already registered" };
      });
    }
  } finally {
    setIsLoading(false);
  }
};

const handleSignin = async (
  email,
  password,
  setIsLoading,
  setUserId,
  handleSetUserToken,
  setError,
  setOwnName
) => {
  try {
    const data = { email, password };
    const response = await axios.post(baseURL + "/signin", data, {
      withCredentials: true,
    });
    const { token, id, name } = response.data;
    setUserId(id);
    setOwnName(name);
    let expires = new Date();
    expires.setDate(expires.getDate() + 7);

    document.cookie = `userId=${id}; expires=${expires}`;
    document.cookie = `token=Bearer ${token}; expires=${expires}`;
    document.cookie = `name=${name}; expires=${expires}`;
    handleSetUserToken(`Bearer ${token}`);
  } catch (error) {
    // console.log("There was an error during signin", error.response);
    if (error.response.data.message === "Password incorrect") {
      setError((prev) => {
        return { ...prev, password: "The Password is incorrect" };
      });
    } else if (error.response.data.message === "the user is not registered") {
      setError((prev) => {
        return { ...prev, email: "The email is not registered" };
      });
    }
  } finally {
    setIsLoading(false);
  }
};

const sendData = async (copyData, token) => {
  try {
    await axios.post(
      baseURL + "/userDataIn",
      { data: copyData, token },
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.log("There was an error sending Data", error.response);
  }
};

const searchUser = async (searchKeyword, setFriendsList) => {
  try {
    const response = await axios.post(baseURL + "/searchuser", {
      data: searchKeyword,
    });

    setFriendsList(response.data);

    // console.log(response);
    return response.data;
  } catch (error) {
    console.log("There was an error sending Data", error.response);
  }
};

const createConversation = async (
  receiverDetails,
  conversationsList,
  setConversationsList,
  setConersationSelectedIndex,
  setNonFriend,
  token
) => {
  const index = conversationsList.findIndex((c) =>
    c.users.find((d) => d.userId === receiverDetails.userId)
  );
  if (index === -1) {
    //not present so create a conversation
    const response = await axios.post(baseURL + "/createConversation", {
      receiverDetails,
      token,
    });
    // console.log(response.data.data);
    setConversationsList((prev) => [...prev, response.data.data]);
    setConersationSelectedIndex(conversationsList.length);
    setNonFriend(false);
  }

  // const response = await axios.post(baseURL + "/createConversation", {
  //   receiverDetails,
  //   token,
  // });
  // setConversationId(response.data.data._id);
};

const loadConversations = async (setConversations, token) => {
  const response = await axios.post(baseURL + "/loadConversations", { token });

  setConversations(response.data.data);
};

const getConversation = async (conversationId, setConversationsList) => {
  // console.log("get conversation is being called");

  const response = await axios.get(
    baseURL + "/getConversation/" + conversationId
  );
  // setConersation(response.data.data);
  setConversationsList((prev) => {
    const newPrev = prev.map((p) => {
      if (p._id === conversationId) {
        p.messages = response.data.data.messages;
        return p;
      }
      return p;
    });
    // console.log(newPrev);
    return newPrev;
  });
};

const addMessage = async (data, conversationId) => {
  await axios.post(baseURL + "/addMessage", {
    data,
    conversationId,
  });
};

const startMatch = async (conversationId, setConversationsList, token) => {
  const response = await axios.post(baseURL + "/startMatch", {
    conversationId,
    token,
  });

  setConversationsList((prev) => {
    const newPrev = prev.map((p) => {
      if (p._id === conversationId) {
        p.messages = response.data.data.messages;
        return p;
      }
      return p;
    });
    return newPrev;
  });
};

const chatStart = async () => {
  const response = await axios.get(baseURL + "/startChat");
  // const response = await fetch(baseURL + "/startChat", {
  //   method: "GET",
  // });

  console.log(response.data);

  // // Create a readable stream from the response body
  // const reader = response.body.getReader();

  // // Initialize an empty string to accumulate chunks
  // let accumulatedText = "";

  // // Read chunks of text from the stream as they arrive
  // while (true) {
  //   const { done, value } = await reader.read();

  //   if (done) {
  //     break;
  //   }

  //   // Append the chunk of text to the existing text
  //   const text = new TextDecoder().decode(value);
  //   accumulatedText += text;
  //   console.log(text);
  // }

  // Process the accumulated text as needed
};

export {
  handleSignup,
  handleSignin,
  sendData,
  searchUser,
  createConversation,
  loadConversations,
  getConversation,
  addMessage,
  startMatch,
  checkBackendOnline,
  chatStart,
};
