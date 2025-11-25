import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/ProfileGroups.css";
import ModalCreateTask from "../components/ModalCreateTask";
import TaskDetailModal from "../components/TaskDetailModal";
import { Sidebar } from "../components/Sidebar";

// --- ACTUALIZADO: TaskListItem ahora recibe onEdit ---
const TaskListItem = ({ task, onToggle, onDelete, onEdit, onClick }) => (
    <li className="list-group-item d-flex justify-content-between align-items-center task-list-item"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        onClick={typeof onClick === 'function' ? onClick : undefined}
    >
        <span
            className={`task-text ${task.completed ? 'completed' : ''}`}
            style={{ cursor: "pointer", color: task.completed ? '#888' : '#333' }}
        >
            {task.title}
        </span>
        <div>
            <i
                className="fas fa-pencil-alt text-primary ms-2"
                onClick={e => { e.stopPropagation(); onEdit(task); }}
                style={{ cursor: "pointer", marginRight: "10px" }}
                title="Editar"
            ></i>
            <i
                className="fas fa-trash text-danger ms-2"
                onClick={e => { e.stopPropagation(); onDelete(task.id); }}
                style={{ cursor: "pointer" }}
                title="Eliminar"
            ></i>
        </div>
    </li>
);

export const Dashboard = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskType, setTaskType] = useState("user");

    // --- NUEVO ESTADO: Tarea a editar ---
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const pendingUserTasks = store.userTasks;
    const activeClan = store.clans.find(c => c.id === store.activeClanId);
    const activeClanTasks = store.clanTasks;

    const totalPersonalExpenses = store.personalExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalClanExpenses = store.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = totalPersonalExpenses + totalClanExpenses;

    // --- FUNCIÓN ABRIR MODAL DE CREAR ---
    const openCreateModal = (type) => {
        setTaskType(type);
        setTaskToEdit(null); // Limpiamos para que sea creación
        setShowTaskModal(true);
    };

    // --- FUNCIÓN ABRIR MODAL DE EDITAR ---
    const openEditModal = (task, type) => {
        setTaskType(type);
        setTaskToEdit(task); // Cargamos la tarea a editar
        setShowTaskModal(true);
    };

    const toggleUserTask = (taskId) => dispatch({ type: 'TOGGLE_USER_TASK', payload: { taskId } });
    const deleteUserTask = (taskId) => dispatch({ type: 'DELETE_USER_TASK', payload: { taskId } });
    const toggleClanTask = (taskId) => dispatch({ type: 'TOGGLE_CLAN_TASK', payload: { taskId } });
    const deleteClanTask = (taskId) => dispatch({ type: 'DELETE_CLAN_TASK', payload: { taskId } });

    const handleShowDetailModal = () => {
        setShowDetailModal(true);
    };

    return (
        <div className="dashboard-container">
            <TaskDetailModal show={showDetailModal} onClose={() => setShowDetailModal(false)} taskList={pendingUserTasks} />

            {showTaskModal && (
                <ModalCreateTask
                    setShowTaskModal={setShowTaskModal}
                    taskType={taskType}
                    taskToEdit={taskToEdit} // Pasamos la tarea (o null)
                />
            )}
            {(showTaskModal) && <div className="modal-backdrop fade show"></div>}

            {showDetailModal && (
                <TaskDetailModal
                    showDetailModal={showDetailModal}
                    setShowDetailModal={setShowDetailModal}
                />
            )}
            {(showDetailModal) && <div className="modal-backdrop fade show"></div>}

           <Sidebar></Sidebar>

            <div className="dashboard-main-content">
                <div className="dashboard-content-area page-container">
                    <div className="welcome-section">
                        <h2>Bienvenido de nuevo, {store.profile.name}</h2>
                    </div>

                    <div className="row g-4 dashboard-cards">

                        {/* Tareas Pendientes */}
                        <div className="col-lg-6">
                            <div className="dashboard-card">
                                <div className="card-header-actions">
                                    <h3>Tus Tareas Pendientes</h3>
                                    <button className="btn btn-sm btn-icon-only" onClick={() => openCreateModal('user')}>
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
                                                onEdit={(t) => openEditModal(t, 'user')}
                                                onClick={handleShowDetailModal}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-muted text-center mt-3">No hay tareas pendientes.</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Tareas de Clanes */}
                        <div className="col-lg-6">
                            <div className="dashboard-card">
                                <div className="card-header-actions">
                                    <h3>Tareas de Clanes</h3>
                                    <button className="btn btn-sm btn-icon-only" onClick={() => openCreateModal('clan')}>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                                {activeClan && <p className="text-muted" style={{ marginTop: '-10px' }}>Para: <strong>{activeClan.name}</strong></p>}
                                <ul className="list-group list-group-flush task-list">
                                    {activeClanTasks.length > 0 ? (
                                        activeClanTasks.map(task => (
                                            <TaskListItem
                                                key={task.id}
                                                task={task}
                                                onToggle={toggleClanTask}
                                                onDelete={deleteClanTask}
                                                onEdit={(t) => openEditModal(t, 'clan')} // <-- Pasamos el handler
                                            />
                                        ))
                                    ) : (
                                        <p className="text-muted text-center mt-3">No hay tareas de clan.</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Resumen Financiero */}
                        <div className="col-lg-12">
                            <div className="dashboard-card">
                                <h3 className="mb-0">Resumen Financiero</h3>
                                <div className="row">
                                    <div className="col-md-6 text-center border-end">
                                        <h4 className="text-muted">Saldo del Bote</h4>
                                        <div className="my-3">
                                            <i className="fas fa-coins fa-3x mb-2" style={{ color: '#FFD700' }}></i>
                                            <h2 className="display-4 fw-bold text-info">{store.personalBote.toFixed(2)}€</h2>
                                        </div>
                                    </div>
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

                        <div className="col-12">
                            <div className="dashboard-card text-center">
                                <h3>Mensajes Recientes</h3>
                                <h1 className="display-1 my-4 text-info"><i className="fas fa-comment-dots"></i></h1>
                                <p className="text-muted">Próximamente verás tus chats aquí.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};