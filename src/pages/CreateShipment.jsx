import { useState } from "react";
import { Link } from "react-router-dom";
import { createShipment } from "../api";

export default function CreateShipment() {
  const [form, setForm] = useState({
    product: "",
    importer: "",
    route: "",
    qty: "",
  });
  const [created, setCreated] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setCreated(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await createShipment({
        product: form.product,
        importer: form.importer,
        route: form.route,
        expectedQty: Number(form.qty),
      });
      setCreated(result);
    } catch (err) {
      setError("Could not create the shipment. Please try again.");
    }
    setSaving(false);
  }

  return (
    <div className="track-page">
      <Link to="/dashboard/exporter" className="back-link left">
        ← Back to dashboard
      </Link>

      <h2 className="track-title">Create shipment</h2>
      <p className="subheading">
        Enter the product details and the quantity you are sending.
      </p>

      <form className="verify-box create-box" onSubmit={handleSubmit}>
        <label>Product name</label>
        <input name="product" required value={form.product} onChange={handleChange} placeholder="e.g. Cotton T-Shirts" />

        <label>Importer / customer name</label>
        <input name="importer" required value={form.importer} onChange={handleChange} placeholder="e.g. Global Retail Ltd" />

        <label>Route</label>
        <input name="route" required value={form.route} onChange={handleChange} placeholder="e.g. Hyderabad, India to Rotterdam, Netherlands" />

        <label>Expected quantity (units)</label>
        <input name="qty" type="number" min="1" required value={form.qty} onChange={handleChange} placeholder="Type the number of units" />

        <button type="submit" className="login-btn" disabled={saving}>
          {saving ? "Creating..." : "Create shipment"}
        </button>
      </form>

      {error && <div className="result-box warn">{error}</div>}

      {created && (
        <div className="result-box ok">
          <strong>Shipment {created.id} created</strong>
          <p>
            {created.expectedQty} units of {created.product} for {created.importer}.
            It is recorded as the first event in the shipment journey.
          </p>
          <Link to={"/shipment/" + created.id} className="verify-link">
            Open shipment →
          </Link>
        </div>
      )}

      <p className="demo-note">
        Demo data saved in this browser, not recorded on a blockchain yet.
      </p>
    </div>
  );
}