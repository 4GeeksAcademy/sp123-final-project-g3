import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileGroups.css";
import { Sidebar } from "../components/Sidebar";


export const Groups = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    // Estados para el modal de Crear
    const [newClanName, setNewClanName] = useState("");
    const [newClanCategory, setNewClanCategory] = useState("");
    const [newClanDate, setNewClanDate] = useState("");

    const [joinCode, setJoinCode] = useState("");
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [generatedCode, setGeneratedCode] = useState("");


    const handleCreateClan = (e) => {
        e.preventDefault();
        // NOTA: Idealmente esto vendría del back, pero por ahora simulamos el código
        const mockCode = (Math.random() + 1).toString(36).substring(7).toUpperCase();

        dispatch({
            type: "CREATE_CLAN",
            payload: {
                name: newClanName,
                category: newClanCategory,
                created: newClanDate
            }
        });

        setGeneratedCode(mockCode);
        setNewClanName("");
        setNewClanCategory("");
        setNewClanDate("");
        setShowCreateModal(false);
        setShowCodeModal(true);
    };

    const handleJoinClan = (e) => {
        e.preventDefault();
        dispatch({ type: "JOIN_CLAN", payload: { code: joinCode } });
        setJoinCode("");
        setShowJoinModal(false);
        alert(`Intentando unirse al clan con el código: ${joinCode}`);
    };

    const handleSelectClan = (clanId) => {
        dispatch({ type: "SET_ACTIVE_CLAN", payload: { clanId } });
    };

    const handleDeleteClan = () => {
        if (store.activeClanId && window.confirm("¿Estás seguro de que quieres eliminar este clan? Esta acción no se puede deshacer.")) {
            dispatch({ type: "DELETE_CLAN" });
        }
    };

    return (
        <div className="d-flex">
            <div><Sidebar/></div>
            <div className="container page-container">

                {/* --- MODAL CREAR CLAN --- */}
                {showCreateModal && (
                    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content modal-content-dark">
                                <form onSubmit={handleCreateClan}>
                                    <div className="modal-header"><h5 className="modal-title">Crear Nuevo Clan</h5></div>
                                    <div className="modal-body">
                                        <div className="mb-3"><label className="form-label">Nombre del Clan</label><input type="text" className="form-control" value={newClanName} onChange={(e) => setNewClanName(e.target.value)} required /></div>
                                        <div className="mb-3"><label className="form-label">Categoría</label><input type="text" className="form-control" value={newClanCategory} onChange={(e) => setNewClanCategory(e.target.value)} placeholder="Ej: Familia, Amigos, Trabajo..." required /></div>
                                        <div className="mb-3"><label className="form-label">Fecha de Creación</label><input type="date" className="form-control" value={newClanDate} onChange={(e) => setNewClanDate(e.target.value)} required /></div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-custom-blue">Crear</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MODAL CÓDIGO GENERADO --- */}
                {showCodeModal && (
                    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content modal-content-dark">
                                <div className="modal-header"><h5 className="modal-title">¡Clan Creado!</h5></div>
                                <div className="modal-body text-center">
                                    <p>Comparte este código para que otros se unan:</p>
                                    <h2 className="my-3 p-2 bg-dark rounded">{generatedCode}</h2>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-custom-blue" onClick={() => setShowCodeModal(false)}>¡Entendido!</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MODAL UNIRSE --- */}
                {showJoinModal && (
                    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content modal-content-dark">
                                <form onSubmit={handleJoinClan}>
                                    <div className="modal-header"><h5 className="modal-title">Unirse a un Clan</h5></div>
                                    <div className="modal-body">
                                        <div className="mb-3"><label className="form-label">Código de Invitación</label><input type="text" className="form-control" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} required /></div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowJoinModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-custom-purple">Unirse</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}


                <div className="main-box">
                    <div className="row">
                        <div className="col-lg-12 clans-column">
                            <h2 className="mb-4">Tus Clanes</h2>
                            <div className="clans-table-wrapper">
                                <div className="clans-table">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>Tu Clan</th>
                                                <th>Categoría</th>
                                                <th>Miembros</th>
                                                <th>Fecha de Creación</th>
                                                <th>Bote del Clan</th> {/* YA CONECTADO */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store.clans.map(clan => {
                                                // --- LÓGICA NUEVA: OBTENER BOTE REAL ---
                                                const currentBote = store.commonBote[clan.id] || 0;

                                                return (
                                                    <tr
                                                        key={clan.id}
                                                        onClick={() => handleSelectClan(clan.id)}
                                                        className={store.activeClanId === clan.id ? 'active-clan' : ''}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <td><strong>{clan.name}</strong></td>
                                                        <td>{clan.category}</td>
                                                        <td>{clan.members} integrantes</td>
                                                        <td>{clan.created}</td>
                                                        {/* MOSTRAMOS EL BOTE REAL */}
                                                        <td><strong className="text-info">{currentBote.toFixed(2)} €</strong></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="mt-4 d-flex justify-content-between responsive-button-group">
                        <button
                            className="btn btn-custom-blue btn-lg"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Crear Nuevo Clan
                        </button>
                        <button
                            className="btn btn-custom-purple btn-lg"
                            onClick={() => setShowJoinModal(true)}
                        >
                            Unirse a un Clan
                        </button>

                        {/* --- BOTÓN FINANZAS ELIMINADO DE AQUÍ SEGÚN INSTRUCCIÓN --- */}

                        <button
                            className="btn btn-outline-danger btn-lg"
                            onClick={handleDeleteClan}
                            disabled={!store.activeClanId}
                        >
                            Eliminar Clan
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};