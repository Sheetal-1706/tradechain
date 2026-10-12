import { useNavigate } from "react-router-dom";

const roles = [
  { name: "Exporter", icon: "📦", description: "Create shipments and manage dispatch records." },
  { name: "Importer", icon: "🚢", description: "Verify incoming shipments and received quantities." },
  { name: "Customer", icon: "👤", description: "Track orders and check delivery status." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <span className="brand-icon">◆</span> TradeChain
        </div>
        <span className="nav-label">Shipment Traceability</span>
      </nav>

      <main className="hero">
        <div className="eyebrow">TRUSTED • TRACEABLE • TRANSPARENT</div>
        <h1>
          Every shipment.
          <br />
          <span>One trusted journey.</span>
        </h1>
        <p className="intro">
          Track international shipments, verify recorded quantities,
          and follow every handover through one connected platform.
        </p>

        <h2>Choose your portal</h2>
        <p className="subheading">Select your role to continue.</p>

        <div className="role-grid">
          {roles.map((role) => (
            <button
              className="role-card"
              key={role.name}
              onClick={() => navigate("/login/" + role.name.toLowerCase())}
            >
              <span className="role-icon">{role.icon}</span>
              <h3>{role.name}</h3>
              <p>{role.description}</p>
              <span className="role-link">Continue →</span>
            </button>
          ))}
        </div>
      </main>

      <footer>Blockchain-assisted shipment records · Built for transparent trade</footer>
    </div>
  );
}
