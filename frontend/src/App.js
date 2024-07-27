import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/home/home";
import Login from "./page/login/login";
import { TextProvider } from "./context/textContext";
import Online from "./page/online/online";
import { UserProvider } from "./context/userCotext";
import { SocketProvider } from "./context/socketContext";
import ChallengeHome from "./page/challengeHome/challengeHome";
import Friends from "./page/friends/friends";
import { FriendProvider } from "./context/friendContext";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <UserProvider>
              <Login />
            </UserProvider>
          }
        />
        <Route
          path="/"
          element={
            <UserProvider>
              <TextProvider>
                <Home />
              </TextProvider>
            </UserProvider>
          }
        />{" "}
        {/* offline */}
        <Route
          path="/online"
          element={
            <UserProvider>
              <TextProvider>
                <FriendProvider>
                  <SocketProvider>
                    <Online />
                  </SocketProvider>
                </FriendProvider>
              </TextProvider>
            </UserProvider>
          }
        />
        <Route
          path="/challenge"
          element={
            <UserProvider>
              <TextProvider>
                <FriendProvider>
                  <SocketProvider>
                    <ChallengeHome />
                  </SocketProvider>
                </FriendProvider>
              </TextProvider>
            </UserProvider>
          }
        />
        <Route
          path="/friends"
          element={
            <UserProvider>
              <TextProvider>
                <FriendProvider>
                  <SocketProvider>
                    <Friends />
                  </SocketProvider>
                </FriendProvider>
              </TextProvider>
            </UserProvider>
          }
        />
        {/* <Route
          path="/aichat"
          element={
            <UserProvider>
              <TextProvider>
                <GeminiProvider>
                  <GeminiChat />
                </GeminiProvider>
              </TextProvider>
            </UserProvider>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
