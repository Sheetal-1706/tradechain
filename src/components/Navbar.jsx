import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand brand-link">
        <span className="brand-icon">◆</span> TradeChain
      </Link>
      <div className="nav-links">
        <Link to="/">Log out</Link>
      </div>
    </nav>
  );
}