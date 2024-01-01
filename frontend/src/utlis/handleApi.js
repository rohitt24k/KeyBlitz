import axios from "axios";

// const baseURL = "http://192.168.1.70:3001/api";
const baseURL = "https://keyblitzapi.onrender.com/api";

// const cookie = document.cookie.split("; ");
// let token;
// if (cookie[0].split("=") === "token") {
//   token = cookie[0].split("=")[1];
// } else {
//   token = cookie[1].split("=")[1];
// }

const handleSignup = async (
  name,
  email,
  password,
  setIsLoading,
  handleSetUserToken,
  setUserId
) => {
  try {
    setIsLoading(true);
    const data = { name, email, password };
    const response = await axios.post(baseURL + "/signup", data, {
      withCredentials: true,
    });
    const { token, id } = response.data;
    setUserId(id);
    document.cookie = `token=Bearer ${token}`;
    document.cookie = `userId=${id}`;
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
  setUserId,
  handleSetUserToken
) => {
  try {
    const data = { email, password };
    const response = await axios.post(baseURL + "/signin", data, {
      withCredentials: true,
    });
    const { token, id } = response.data;
    setUserId(id);
    document.cookie = `userId=${id}`;
    document.cookie = `token=Bearer ${token}`;
    handleSetUserToken(response.data);
  } catch (error) {
    console.log("There was an error during signin", error.response);
  } finally {
    setIsLoading(false);
  }
};

const sendData = async (copyData, token) => {
  try {
    const response = await axios.post(
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
  const response = await axios.post(baseURL + "/addMessage", {
    data,
    conversationId,
  });
};

const startMatch = async (conversationId, setConversationsList, token) => {
  const response = await axios.post(baseURL + "/startMatch", {
    conversationId,
    token,
  });
  await getConversation(conversationId, setConversationsList);
  console.log(response.data.data);
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
};
