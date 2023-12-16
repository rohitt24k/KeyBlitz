import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/home/home";
import Login from "./page/login/login";
import { useState } from "react";

function App() {
  const [userId, setUserId] = useState("");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element=<Home userId={userId} /> />
        <Route path="/login" element=<Login setUserId={setUserId} /> />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
