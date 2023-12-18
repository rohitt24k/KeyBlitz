import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/home/home";
import Login from "./page/login/login";
import { useState } from "react";
import { TextProvider } from "./context/textContext";

function App() {
  const [userId, setUserId] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element=<TextProvider>
            <Home userId={userId} setUserId={setUserId} />
          </TextProvider>
        />
        <Route path="/login" element=<Login setUserId={setUserId} /> />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
