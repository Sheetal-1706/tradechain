import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ShipmentTracking from "./pages/ShipmentTracking";
import ImporterVerify from "./pages/ImporterVerify";
import CreateShipment from "./pages/CreateShipment";
import CustomerTracking from "./pages/CustomerTracking";
import BlockchainHistory from "./pages/BlockchainHistory";

export default function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/" || location.pathname.startsWith("/login");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/dashboard/:role" element={<Dashboard />} />
        <Route path="/shipment/:id" element={<ShipmentTracking />} />
        <Route path="/verify/:id" element={<ImporterVerify />} />
        <Route path="/create" element={<CreateShipment />} />
        <Route path="/customer/:id" element={<CustomerTracking />} />
        <Route path="/history/:id" element={<BlockchainHistory />} />
      </Routes>
    </>
  );
}