import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/home/home";
import Login from "./page/login/login";
import { useContext, useState } from "react";
import textContext, { TextProvider } from "./context/textContext";
import Online from "./page/online/online";
import { UserProvider } from "./context/userCotext";
import { SocketProvider } from "./context/socketContext";
import ChallengeHome from "./page/challengeHome/challengeHome";
import Friends from "./page/friends/friends";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <TextProvider>
          <Routes>
            <Route path="/" element=<Home /> />
            <Route path="/login" element=<Login /> />
            <Route
              path="/online"
              element=<SocketProvider>
                <Online />
              </SocketProvider>
            />
            <Route
              path="/challenge"
              element=<SocketProvider>
                <ChallengeHome />
              </SocketProvider>
            />
            <Route
              path="/friends"
              element=<SocketProvider>
                <Friends />
              </SocketProvider>
            />
          </Routes>
        </TextProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
