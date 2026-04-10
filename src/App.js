import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home"; 
import Dashboard from "./Dashboard";
import ViewReport from "./ViewReport"; 
import CreateReport from "./CreateReport";
import ViewPhoto from "./ViewPhoto";
import AddPhoto from "./AddPhoto";
import EditReport from "./EditReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
          
        {/* View, create, edit Report */}
        <Route path="/view-report/:id" element={<ViewReport />} /> 
        <Route path="/create-report" element={<CreateReport />} />
        <Route path="/edit-report/:id" element={<EditReport />} /> 

        {/* View and add photo */}
        <Route path="/view-photo/:id" element={<ViewPhoto />} />
        <Route path="/add-photo/:id" element={<AddPhoto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
