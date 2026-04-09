import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home"; 
import Dashboard from "./Dashboard";
import ViewReport from "./ViewReport"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
          
          {/* View Report page */}
        <Route path="/view-report/:id" element={<ViewReport />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
