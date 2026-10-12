export default function Timeline({ events }) {
  return (
    <div className="timeline">
      {events.map((e) => (
        <div
          className={"tl-item " + (e.status === "flag" ? "flag" : "")}
          key={e.txRef}
        >
          <div className="tl-dot"></div>
          <div className="tl-card">
            <div className="tl-stage">{e.stage}</div>
            <h4>{e.title}</h4>
            <p>{e.qty} units recorded</p>
            <span className="tl-meta">
              {e.date} · Ref {e.txRef}
            </span>
            {e.status === "flag" && (
              <div className="tl-note">Requires investigation</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}