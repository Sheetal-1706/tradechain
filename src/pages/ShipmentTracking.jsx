import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Timeline from "../components/Timeline";
import { getShipment } from "../api";

export default function ShipmentTracking() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getShipment(id)
      .then((data) => {
        if (data) setS(data);
        else setError("Shipment not found.");
      })
      .catch(() => setError("Could not load the shipment."));
  }, [id]);

  if (error) return <div className="track-page">{error}</div>;
  if (!s) return <div className="track-page">Loading...</div>;

  const hasReceived = s.receivedQty !== null && s.receivedQty !== undefined;
  const diff = hasReceived ? s.expectedQty - s.receivedQty : null;

  let diffNote = "awaiting importer";
  if (diff === 0) diffNote = "all units match";
  if (diff > 0) diffNote = "units fewer · requires investigation";
  if (diff < 0) diffNote = "units more · requires investigation";

  return (
    <div className="track-page">
      <Link to="/dashboard/exporter" className="back-link left">
        ← Back to dashboard
      </Link>

      <h2 className="track-title">Shipment {s.id}</h2>
      <p className="subheading">
        {s.product} · {s.route}
      </p>

      <div className="qty-row">
        <div className="qty-card">
          <span>Expected quantity</span>
          <strong>{s.expectedQty}</strong>
          <small>units</small>
        </div>
        <div className="qty-card">
          <span>Received quantity</span>
          <strong>{hasReceived ? s.receivedQty : "-"}</strong>
          <small>{hasReceived ? "units" : "not yet recorded"}</small>
        </div>
        <div className={diff !== null && diff !== 0 ? "qty-card warn" : "qty-card"}>
          <span>Difference</span>
          <strong>{diff === null ? "-" : Math.abs(diff)}</strong>
          <small>{diffNote}</small>
        </div>
      </div>

      <Link to={"/history/" + s.id} className="verify-link">
        View recorded history →
      </Link>

      <h3 className="track-heading journey-gap">Shipment journey</h3>
      <Timeline events={s.events} />

      <p className="demo-note">
        Demo data saved in this browser, not actual blockchain records.
        A discrepancy should trigger investigation, not automatically
        accuse any participant.
      </p>
    </div>
  );
}