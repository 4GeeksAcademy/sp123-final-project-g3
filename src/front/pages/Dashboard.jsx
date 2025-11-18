import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/ProfileGroups.css";

const TaskListItem = ({ task, onToggle, onDelete }) => (
    <li className="list-group-item d-flex justify-content-between align-items-center task-list-item"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
        <span
            className={`task-text ${task.completed ? 'completed' : ''}`}
            onClick={() => onToggle(task.id)}
            style={{ cursor: "pointer", color: task.completed ? '#888' : '#333' }}
        >
            {task.title}
        </span>
        <div>
            <i
                className={`fas ${task.completed ? 'fa-check-square text-success' : 'fa-square'}`}
                onClick={() => onToggle(task.id)}
                style={{ cursor: "pointer" }}
            ></i>
            <i
                className="fas fa-trash text-danger ms-2"
                onClick={() => onDelete(task.id)}
                style={{ cursor: "pointer" }}
            ></i>
        </div>
    </li>
);

export const Dashboard = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskType, setTaskType] = useState("user");
    const [newTaskTitle, setNewTaskTitle] = useState("");

    // Tareas personales = tasks sin clanId
    const pendingUserTasks = store.userTasks

    // Clan activo
    const activeClan = store.clans.find(c => c.id === store.activeClanId);

    // Tareas de clan activas
    const activeClanTasks = store.clanTasks

    // Total completadas
    const completedTaskCount = store.userTasks.filter(t => t.completed).length + store.clanTasks.filter(t => t.completed).length;

    // Finanzas placeholder
    const totalExpenses = 0;

    const openTaskModal = (type) => {
        setTaskType(type);
        setShowTaskModal(true);
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        console.log(taskType, newTaskTitle)

        if (taskType === "user") {
            dispatch({ type: 'ADD_USER_TASK', payload: { title: newTaskTitle } });
        } else {
            dispatch({ type: 'ADD_TASK_TO_CLAN', payload: { title: newTaskTitle } });
        }

        setNewTaskTitle("");
        setShowTaskModal(false);
    };

    const toggleUserTask = (taskId) =>
        dispatch({ type: 'TOGGLE_USER_TASK', payload: { taskId } });

    const deleteUserTask = (taskId) =>
        dispatch({ type: 'DELETE_USER_TASK', payload: { taskId } });

    const toggleClanTask = (taskId) =>
        dispatch({ type: 'TOGGLE_CLAN_TASK', payload: { taskId } });

    const deleteClanTask = (taskId) =>
        dispatch({ type: 'DELETE_CLAN_TASK', payload: { taskId } });

    const [inviteEmail, setInviteEmail] = useState("");
    const [projectLink] = useState("https://taskflowapp.com/project/12345");

    return (
        <div className="dashboard-container">
            {/* --- MODAL DE INVITACIÓN --- */}
            {showInviteModal && (
                <div className="modal" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content invite-modal-content">
                            <div className="modal-header invite-modal-header">
                                <h5 className="modal-title">Send an invite to a new member</h5>
                                <button type="button" className="btn-go-back" onClick={() => setShowInviteModal(false)}>Go Back</button>
                            </div>
                            <div className="modal-body invite-modal-body">
                                <form onSubmit={handleSendInvite} className="mb-4">
                                    <label htmlFor="inviteEmail" className="form-label invite-label">Email</label>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            className="form-control invite-input"
                                            id="inviteEmail"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="Enter email address"
                                            required
                                        />
                                        <button type="submit" className="btn btn-send-invite">Send Invite</button>
                                    </div>
                                </form>
                                <div className="mb-4">
                                    <label className="form-label invite-label">Members</label>
                                    <div className="member-list">
                                        {mockMembers.map(member => (
                                            <div key={member.id} className="member-item">
                                                <img src={member.avatar} alt={member.name} className="member-avatar" />
                                                <div className="member-info">
                                                    <strong>{member.name}</strong>
                                                    <span>{member.email}</span>
                                                </div>
                                                <div className="dropdown">
                                                    <button className="btn btn-sm btn-member-role dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        {member.role}
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-dark">
                                                        <li><a className="dropdown-item" href="#">Can edit</a></li>
                                                        <li><a className="dropdown-item" href="#">View only</a></li>
                                                        <li><a className="dropdown-item" href="#">Owner</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="projectLink" className="form-label invite-label">Project Link</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control invite-input" id="projectLink" value={projectLink} readOnly />
                                        <button type="button" className="btn btn-copy-link" onClick={handleCopyProjectLink}>Copy Link</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- NUEVO MODAL PARA AÑADIR TAREAS --- */}
            {showTaskModal && (
                <div className="modal" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content modal-content-dark">
                            <form onSubmit={handleAddTask}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {taskType === 'user' ? 'Añadir Tarea Personal' : 'Añadir Tarea de Clan'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowTaskModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="taskTitle" className="form-label">Título de la Tarea</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="taskTitle"
                                            value={newTaskTitle}
                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-custom-blue">Añadir Tarea</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {(showInviteModal || showTaskModal) && <div className="modal-backdrop fade show"></div>}

            {/* --- BARRA LATERAL (NAV: Lateral) --- */}
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <Link to="/dashboard" className="logo">TASKFLOW</Link>
                </div>
                <div className="user-profile-summary" onClick={() => navigate("/profile")} style={{ cursor: 'pointer' }}>
                    <img src={store.profile.avatar} alt="User Avatar" className="user-avatar" />
                    <span className="username">{store.profile.name}</span>
                    <span className="user-email">{store.profile.email}</span>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="/dashboard" className="active"><i className="fas fa-desktop me-2"></i>Escritorio</Link></li>
                        <li><Link to="/tasks"><i className="fas fa-tasks me-2"></i>Tus Tareas</Link></li>
                        <li><Link to="/groups"><i className="fas fa-users me-2"></i>Tus Clanes</Link></li>
                        <li><Link to="/shared-tasks"><i className="fas fa-share-alt me-2"></i>Tareas de Clanes</Link></li>
                        <li><Link to="/finances"><i className="fas fa-wallet me-2"></i>Finanzas</Link></li>
                        <li><Link to="/profile"><i className="fas fa-user-circle me-2"></i>Tu Perfil</Link></li>
                        <li><Link to="/config"><i className="fas fa-cog me-2"></i>Configuración</Link></li>
                    </ul>
                </nav>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="dashboard-main-content">


                <div className="dashboard-content-area page-container">
                    <div className="welcome-section">
                        <h2>Bienvenido de nuevo '{store.profile.name}'</h2>
                        <button className="btn btn-invite-user" onClick={() => setShowInviteModal(true)}>
                            <i className="fas fa-user-plus me-2"></i>Invitar
                        </button>
                    </div>

                    <div className="row g-4 dashboard-cards">
                        {/* Tus Tareas Pendientes */}
                        <div className="col-lg-6">
                            <div className="dashboard-card">
                                <div className="card-header-actions">
                                    <h3>Tus Tareas Pendientes</h3>
                                    <button className="btn btn-sm btn-icon-only" onClick={() => openTaskModal('user')}>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                                <ul className="list-group list-group-flush task-list">
                                    {pendingUserTasks.length > 0 ? (
                                        pendingUserTasks.map(task => (
                                            <TaskListItem
                                                key={task.id}
                                                task={task}
                                                onToggle={toggleUserTask}
                                                onDelete={deleteUserTask}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-muted text-center mt-3">No hay tareas pendientes.</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* --- TARJETA DE FINANZAS UNIFICADA --- */}
                        <div className="col-lg-6">
                            <div className="dashboard-card">
                                <h3 className="mb-0">Resumen Financiero</h3>
                                <div className="row">
                                    {/* Saldo Bote Personal */}
                                    <div className="col-md-6 text-center border-end">
                                        <h4 className="text-muted">Saldo del Bote</h4>
                                        <div className="my-3">
                                            <i className="fas fa-coins fa-3x mb-2" style={{ color: '#FFD700' }}></i>
                                            <h2 className="display-4 fw-bold text-info">{store.personalBote.toFixed(2)}€</h2>
                                        </div>
                                    </div>
                                    {/* Gastos del Mes (Total) */}
                                    <div className="col-md-6 text-center">
                                        <h4 className="text-muted">Gastos del Mes</h4>
                                        <div className="my-3">
                                            <i className="fas fa-chart-line fa-3x mb-2 text-danger"></i>
                                            <h2 className="display-4 fw-bold text-danger">{totalExpenses.toFixed(2)}€</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* --- FIN DE TARJETA UNIFICADA --- */}

                        {/* Tareas de Clanes */}
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card">
                                <div className="card-header-actions">
                                    <h3>Tareas de Clanes</h3>
                                    <button className="btn btn-sm btn-icon-only" onClick={() => openTaskModal('clan')}>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                                {/* --- SUBTÍTULO AÑADIDO --- */}
                                {activeClan && <p className="text-muted" style={{ marginTop: '-10px' }}>Para: <strong>{activeClan.name}</strong></p>}

                                <ul className="list-group list-group-flush task-list">
                                    {activeClanTasks.length > 0 ? (
                                        activeClanTasks.map(task => (
                                            <TaskListItem
                                                key={task.id}
                                                task={task}
                                                onToggle={toggleClanTask}
                                                onDelete={deleteClanTask}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-muted text-center mt-3">No hay tareas de clan.</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Tareas Completadas */}
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card">
                                <h3>Tareas Completadas (Total)</h3>
                                <div className="text-center my-4">
                                    <h1 className="display-3" style={{ color: '#28a745', fontWeight: 'bold' }}>
                                        {completedTaskCount}
                                    </h1>
                                    <p className="text-muted">¡Sigue así!</p>
                                </div>
                            </div>
                        </div>

                        {/* Próximos Eventos */}
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card">
                                <h3>Próximos Eventos</h3>
                                <p className="text-muted text-center mt-4">No hay eventos próximos.</p>
                            </div>
                        </div>

                        {/* Mensajes (Placeholder) */}
                        <div className="col-12">
                            <div className="dashboard-card text-center">
                                <h3>Mensajes</h3>
                                <h1 className="display-1 my-4 text-info"><i className="fas fa-comment-dots"></i></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
