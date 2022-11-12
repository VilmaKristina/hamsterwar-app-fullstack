import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Battle from "./pages/Battle";
import Gallery from "./pages/Gallery";
import AddHamster from "./pages/AddHamster";
import SingleHamster from "./pages/SingleHamster";
import { HamstersProvider } from "./components/ListContext";

function App() {
  return (
    <HamstersProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/battle" element={<Battle />}></Route>
            <Route path="/gallery" element={<Gallery />}></Route>
            <Route path="/addhamster" element={<AddHamster />}></Route>
            <Route path="/:id" element={<SingleHamster />}></Route>
          </Routes>
        </Router>
      </div>
    </HamstersProvider>
  );
}

export default App;
