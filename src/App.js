import { Route, Routes } from "react-router-dom";
import './App.css';
import LoginButton from "./LoginButton";
import Main from "./Main";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginButton />} />
      <Route path="/main" element={<Main />} />
    </Routes>
  );
}

export default App;
