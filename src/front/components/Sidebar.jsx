import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Sidebar = () => {
    const {store} = useGlobalReducer();
    return (
     <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <Link to="/dashboard" className="logo">TASKFLOW</Link>
                </div>
                <div className="user-profile-summary" onClick={() => navigate("/profile")} style={{ cursor: 'pointer' }}>
                    <div className="user-avatar">
                                {store.profile.photo ? (
                                    <img src={store.profile.photo} alt="User Avatar" className="img-fluid rounded-circle" />

                                ) : (
                                    <span>{store.profile.name[0]}</span>
                                )}
                            </div>
                    <span className="username">{store.profile.name}</span>
                    <span className="user-email">{store.profile.email}</span>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="/dashboard" className="active"><i className="fas fa-desktop me-2"></i>Escritorio</Link></li>               
                        <li><Link to="/groups"><i className="fas fa-users me-2"></i>Tus Clanes</Link></li>
                        <li><Link to="/finances"><i className="fas fa-wallet me-2"></i>Finanzas</Link></li>
                        <li><Link to="/profile"><i className="fas fa-user-circle me-2"></i>Tu Perfil</Link></li>
                        <li><Link to="/config"><i className="fas fa-cog me-2"></i>Configuración</Link></li>
                        <li><Link to="/chat"><i className="fas fa-comments me-2"></i>Chat</Link></li>
                    </ul>
                </nav>
            </div>
    )

}