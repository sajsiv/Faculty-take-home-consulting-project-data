import { greet } from "./utils/greet";
import MainPage from "./components/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App(): JSX.Element {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
