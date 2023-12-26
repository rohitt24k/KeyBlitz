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
                <SocketProvider>
                  <FriendProvider>
                    <Online />
                  </FriendProvider>
                </SocketProvider>
              </TextProvider>
            </UserProvider>
          }
        />
        <Route
          path="/challenge"
          element={
            <UserProvider>
              <TextProvider>
                <SocketProvider>
                  <FriendProvider>
                    <ChallengeHome />
                  </FriendProvider>
                </SocketProvider>
              </TextProvider>
            </UserProvider>
          }
        />
        <Route
          path="/friends"
          element={
            <UserProvider>
              <TextProvider>
                <SocketProvider>
                  <FriendProvider>
                    <Friends />
                  </FriendProvider>
                </SocketProvider>
              </TextProvider>
            </UserProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
