import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getShipments, resetDemoData } from "../api";

function getStatus(s) {
  if (s.receivedQty === null || s.receivedQty === undefined) {
    return { text: "Awaiting delivery", cls: "pending" };
  }
  if (s.receivedQty === s.expectedQty) {
    return { text: "Quantities match", cls: "ok" };
  }
  return { text: "Requires investigation", cls: "" };
}

export default function Dashboard() {
  const { role } = useParams();
  const title = role.charAt(0).toUpperCase() + role.slice(1);
  const [list, setList] = useState(null);
  const [error, setError] = useState("");

  function load() {
    getShipments()
      .then((data) => setList(data))
      .catch(() => setError("Could not load shipments."));
  }

  useEffect(() => {
    load();
  }, []);

  function handleReset() {
    resetDemoData();
    load();
  }

  let base = "/shipment/";
  if (role === "importer") base = "/verify/";
  if (role === "customer") base = "/customer/";

  return (
    <div className="track-page">
      <Link to="/" className="back-link left">← Log out</Link>

      <h2 className="track-title">{title} dashboard</h2>
      <p className="subheading">
        {role === "importer" ? "Click a shipment to verify the received quantity." : "Click a shipment to see its journey."}
      </p>

      {role === "exporter" && (
        <Link to="/create" className="verify-link">
          + Create new shipment
        </Link>
      )}

      {error && <div className="result-box warn">{error}</div>}
      {!list && !error && <p>Loading...</p>}

      <div className="ship-list">
        {list && list.length === 0 && <p>No shipments yet.</p>}
        {list &&
          list.map((s) => {
            const st = getStatus(s);
            const hasReceived = s.receivedQty !== null && s.receivedQty !== undefined;
            return (
              <Link to={base + s.id} className="ship-card" key={s.id}>
                <div>
                  <div className="ship-id">{s.id}</div>
                  <div className="ship-name">{s.product}</div>
                  <div className="ship-route">{s.route}</div>
                </div>
                <div className="ship-right">
                  <span className={"ship-badge " + st.cls}>{st.text}</span>
                  <span className="ship-qty">
                    {hasReceived
                      ? s.receivedQty + " of " + s.expectedQty + " units received"
                      : "Expected " + s.expectedQty + " units"}
                  </span>
                </div>
              </Link>
            );
          })}
      </div>

      <button className="reset-btn" onClick={handleReset}>
        Reset demo data
      </button>
    </div>
  );
}