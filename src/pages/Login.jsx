import { useParams, useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const title = role.charAt(0).toUpperCase() + role.slice(1);

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/dashboard/" + role);
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="brand">
          <span className="brand-icon">◆</span> TradeChain
        </div>
        <h2>{title} login</h2>
        <p className="subheading">Demo login. Any details will work for now.</p>

        <label>Email</label>
        <input type="email" placeholder="you@example.com" required />

        <label>Password</label>
        <input type="password" placeholder="Enter password" required />
        <button type="submit" className="login-btn">Log in</button>
        <Link to="/" className="back-link">← Back to portals</Link>
      </form>
    </div>
  );
}