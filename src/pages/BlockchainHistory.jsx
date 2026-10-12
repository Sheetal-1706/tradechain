import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getShipment } from "../api";

export default function BlockchainHistory() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getShipment(id)
      .then((data) => {
        if (data) setS(data);
        else setError("Shipment not found.");
      })
      .catch(() => setError("Could not load the history."));
  }, [id]);

  if (error) return <div className="track-page">{error}</div>;
  if (!s) return <div className="track-page">Loading...</div>;

  return (
    <div className="track-page">
      <Link to={"/shipment/" + s.id} className="back-link left">
        ← Back to shipment
      </Link>

      <h2 className="track-title">Recorded history</h2>
      <p className="subheading">
        Shipment {s.id} · {s.events.length} recorded events
      </p>

      <div className="history-table">
        <div className="history-head">
          <span>Stage</span>
          <span>Event</span>
          <span>Units</span>
          <span>Date</span>
          <span>Reference</span>
        </div>

        {s.events.map((e) => (
          <div
            className={"history-row " + (e.status === "flag" ? "flag" : "")}
            key={e.txRef}
          >
            <span>{e.stage}</span>
            <span>{e.title}</span>
            <span>{e.qty}</span>
            <span>{e.date}</span>
            <span className="mono">{e.txRef}</span>
          </div>
        ))}
      </div>

      <p className="demo-note">
        Demo data, not actual blockchain records. The blockchain records events
        submitted by authorized participants. It does not independently prove
        the physical contents of a package.
      </p>
    </div>
  );
}