import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getShipment, submitReceivedQty } from "../api";

export default function ImporterVerify() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [qty, setQty] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const entered = Number(qty);
  const diff = s.expectedQty - entered;
  const hasReceived = s.receivedQty !== null && s.receivedQty !== undefined;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      await submitReceivedQty(s.id, entered);
      const fresh = await getShipment(s.id);
      if (fresh) setS(fresh);
      setSubmitted(true);
    } catch (err) {
      setSaveError("Could not save the received quantity. Please try again.");
    }
    setSaving(false);
  }

  function handleChange(e) {
    setQty(e.target.value);
    setSubmitted(false);
  }

  return (
    <div className="track-page">
      <Link to="/dashboard/importer" className="back-link left">
        ← Back to dashboard
      </Link>

      <h2 className="track-title">Verify shipment {s.id}</h2>
      <p className="subheading">
        {s.product} · {s.route}
      </p>

      <div className="qty-row two">
        <div className="qty-card">
          <span>Expected quantity</span>
          <strong>{s.expectedQty}</strong>
          <small>units recorded by exporter</small>
        </div>
        <div className="qty-card">
          <span>Your received quantity</span>
          <strong>{qty === "" ? "-" : entered}</strong>
          <small>units</small>
        </div>
      </div>

      {hasReceived && !submitted && (
        <div className="demo-note">
          Last recorded received quantity: {s.receivedQty}. Submitting again
          adds a new record. Earlier records stay in the history.
        </div>
      )}

      <form className="verify-box" onSubmit={handleSubmit}>
        <label>Enter the quantity you received</label>
        <input
          type="number"
          min="0"
          required
          value={qty}
          onChange={handleChange}
          placeholder="Type the number of units"
        />
        <button type="submit" className="login-btn" disabled={saving}>
          {saving ? "Saving..." : "Record received quantity"}
        </button>
      </form>

      {saveError && <div className="result-box warn">{saveError}</div>}

      {submitted && diff === 0 && (
        <div className="result-box ok">
          Quantities match. The received quantity equals the recorded quantity.
        </div>
      )}

      {submitted && diff !== 0 && (
        <div className="result-box warn">
          <strong>Quantity difference found: {Math.abs(diff)} units</strong>
          <p>
            Expected {s.expectedQty}, entered {entered}. This requires
            investigation. It does not show who is responsible.
          </p>
        </div>
      )}

      {submitted && (
        <Link to={"/history/" + s.id} className="verify-link">
          View recorded history →
        </Link>
      )}

      <p className="demo-note">
        Demo data saved in this browser, not recorded on a blockchain yet.
      </p>
    </div>
  );
}