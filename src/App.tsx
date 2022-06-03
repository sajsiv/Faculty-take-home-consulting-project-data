import MainPage from "./components/MainPage";
import EmployeePage from "./components/EmployeePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClientPage } from "./components/ClientPage";
import "./style.css"

function App(): JSX.Element {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/employees/:employeeId" element={<EmployeePage />} />
          <Route path="/clients/:clientId" element={<ClientPage />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
