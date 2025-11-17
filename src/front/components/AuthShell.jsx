import bgImg from "../assets/img/background-screens.png";


export default function AuthShell({ children, title, subtitle }) {
  return (
    <div
      className="auth-theme"
      style={{
        backgroundImage: `url(${bgImg})`,
        minHeight: "125vh",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >

      <div className="auth-shell">
        <div className="auth-card">
          {title && <div className="auth-title">{title}</div>}
          {subtitle && <div className="auth-sub">{subtitle}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}
