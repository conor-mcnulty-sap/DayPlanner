import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Carpool from "./pages/Carpool";
import Tasks from "./pages/Tasks";
import BookDesk from "./pages/BookDesk";
import BookMeeting from "./pages/BookMeeting";
import FindDesk from "./pages/FindDesk";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carpool" element={<Carpool />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/bookdesk" element={<BookDesk />} />
          <Route path="/bookmeeting" element={<BookMeeting />} />
          <Route path="/finddesk" element={<FindDesk />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
