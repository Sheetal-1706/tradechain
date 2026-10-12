import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getShipment } from "../api";

export default function CustomerTracking() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getShipment(id)
      .then((data) => {
        if (data) setS(data);
        else setError("Order not found.");
      })
      .catch(() => setError("Could not load your order."));
  }, [id]);

  if (error) return <div className="track-page">{error}</div>;
  if (!s) return <div className="track-page">Loading...</div>;

  const hasReceived = s.receivedQty !== null && s.receivedQty !== undefined;
  const diff = hasReceived ? s.expectedQty - s.receivedQty : null;

  return (
    <div className="track-page">
      <Link to="/dashboard/customer" className="back-link left">
        ← Back to dashboard
      </Link>

      <h2 className="track-title">Your order {s.id}</h2>
      <p className="subheading">
        {s.product} · {s.route}
      </p>

      <h3 className="track-heading">Delivery progress</h3>
      <div className="progress-row">
        {s.events.map((e) => (
          <div className="progress-step done" key={e.txRef}>
            <div className="progress-dot"></div>
            <strong>{e.stage}</strong>
            <span>{e.date}</span>
          </div>
        ))}
      </div>

      <div className="qty-row two">
        <div className="qty-card">
          <span>Ordered quantity</span>
          <strong>{s.expectedQty}</strong>
          <small>units</small>
        </div>
        <div className="qty-card">
          <span>Received quantity</span>
          <strong>{hasReceived ? s.receivedQty : "-"}</strong>
          <small>{hasReceived ? "units" : "not yet recorded"}</small>
        </div>
      </div>

      {!hasReceived && (
        <div className="result-box ok">
          Your order is on its way. The received quantity will appear after the importer records it.
        </div>
      )}

      {diff === 0 && (
        <div className="result-box ok">
          All ordered units are accounted for.
        </div>
      )}

      {diff !== null && diff !== 0 && (
        <div className="result-box warn">
          <strong>Discrepancy status: Under review</strong>
          <p>
            {Math.abs(diff)} units {diff > 0 ? "fewer" : "more"} than ordered
            were recorded. This requires investigation. It does not show who is responsible.
          </p>
        </div>
      )}

      <p className="demo-note">
        Demo data saved in this browser, not actual blockchain records.
      </p>
    </div>
  );
}