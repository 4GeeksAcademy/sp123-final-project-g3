import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/ProfileGroups.css";
import { Sidebar } from "../components/Sidebar";

const FriendListItem = ({ friend }) => (
    <div className="friend-list-item">
        <img src={friend.photo} alt={friend.name} />
        <div className="friend-info">
            <strong>{friend.name}</strong>
            <span className={`status ${friend.status}`}>
                {friend.status === 'online' ? 'Activado' : 'Desactivado'}
            </span>
        </div>
        <button className="btn btn-sm btn-icon-only">
            <i className="fas fa-paper-plane"></i>
        </button>
    </div>
);

export const Profile = () => {
    const { store, dispatch } = useGlobalReducer();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        ...store.profile,
        name: store.profile.name || "",
        photo: store.profile.photo || "",
        bio: store.profile.bio || "",
        city: store.profile.city || "",
        age: store.profile.age || 0,
        phone: store.profile.phone || "",
        gender: store.profile.gender || "",
        instagram: store.profile.instagram || "",
        twitter: store.profile.twitter || "",
        facebook: store.profile.facebook || "",
    });
    const [showBoteModal, setShowBoteModal] = useState(false);
    const [boteAmount, setBoteAmount] = useState(store.personalBote);

    useEffect(() => {
        setFormData({
            ...store.profile,
            name: store.profile.name || "",
            photo: store.profile.photo || "",
            bio: store.profile.bio || "",
            city: store.profile.city || "",
            age: store.profile.age || 0,
            phone: store.profile.phone || "",
            gender: store.profile.gender || "",
            instagram: store.profile.instagram || "",
            twitter: store.profile.twitter || "",
            facebook: store.profile.facebook || "",
        });
    }, [store.profile]);
    useEffect(() => { setBoteAmount(store.personalBote); }, [store.personalBote]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = store.token;

        const payload = {
            photo: formData.photo,
            name: formData.name,
            bio: formData.bio,
            city: formData.city,
            age: formData.age,
            phone: formData.phone,
            gender: formData.gender,
            instagram: formData.instagram,
            twitter: formData.twitter,
            facebook: formData.facebook
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${store.user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: "UPDATE_PROFILE", payload: data.perfil });
                setShowModal(false);
            } else {
                alert(data.msg || "Error al actualizar el perfil");
            }
        } catch {
            alert("Error al conectar con el servidor");
        }
    };

    const handleBoteSubmit = (e) => {
        e.preventDefault();
        if (parseFloat(boteAmount) <= 0 || !boteAmount) return alert("Introduce un importe positivo.");
        dispatch({ type: "UPDATE_PERSONAL_BOTE", payload: { newBote: boteAmount } });
        setShowBoteModal(false);
    };

    const tasksCompleted = store.userTasks.filter(t => t.completed).length + store.clanTasks.filter(t => t.completed).length;
    const tasksPending = store.userTasks.filter(t => !t.completed).length + store.clanTasks.filter(t => !t.completed).length;
    const clanCount = store.clans.length;
    const totalPersonalExpenses = store.personalExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalClanExpenses = store.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = totalPersonalExpenses + totalClanExpenses;

    return (
        <div className="d-flex">
            <div><Sidebar/></div>
            <div className="container page-container">
                {showModal && (
                    <div className="modal" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content modal-content-dark">
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Editar Perfil</h5>
                                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3"><label className="form-label">Foto de Perfil (URL)</label><input type="text" name="photo" className="form-control" value={formData.photo || ""} onChange={handleChange} /></div>
                                                <div className="mb-3"><label className="form-label">Nombre</label><input type="text" name="name" className="form-control" value={formData.name || ""} onChange={handleChange} /></div>
                                                <div className="mb-3"><label className="form-label">Presentación</label><textarea name="bio" className="form-control" rows="3" value={formData.bio || ""} onChange={handleChange}></textarea></div>
                                                <div className="mb-3"><label className="form-label">Ciudad</label><input type="text" name="city" className="form-control" value={formData.city || ""} onChange={handleChange} /></div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3"><label className="form-label">Edad</label><input type="number" name="age" className="form-control" value={formData.age || 0} onChange={handleChange} /></div>
                                                <div className="mb-3"><label className="form-label">Teléfono</label><input type="text" name="phone" className="form-control" value={formData.phone || ""} onChange={handleChange} /></div>
                                                <div className="mb-3"><label className="form-label">Género</label><input type="text" name="gender" className="form-control" value={formData.gender || ""} onChange={handleChange} /></div>
                                                <hr />
                                                <h6 className="mb-3">Redes</h6>
                                                <div className="mb-3"><label className="form-label">Instagram</label><input type="text" name="instagram" className="form-control" value={formData.instagram || ""} onChange={handleChange} /></div>
                                                <div className="mb-3"><label className="form-label">Twitter</label><input type="text" name="twitter" className="form-control" value={formData.twitter || ""} onChange={handleChange} /></div>
                                                <div className="mb-3"><label className="form-label">Facebook</label><input type="text" name="facebook" className="form-control" value={formData.facebook || ""} onChange={handleChange} /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-custom-blue">Guardar Cambios</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {showBoteModal && (
                    <div className="modal" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content modal-content-dark">
                                <form onSubmit={handleBoteSubmit}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Editar Saldo del Bote Personal</h5>
                                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowBoteModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="boteAmount" className="form-label">Nuevo Saldo (€)</label>
                                            <input type="number" step="1" className="form-control" id="boteAmount" value={boteAmount || 0} onChange={(e) => setBoteAmount(e.target.value)} placeholder="0" />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowBoteModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-custom-blue">Guardar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <div className="main-box">
                    <div className="row">
                        <div className="col-lg-4 profile-column-left">
                            
                                <button className="btn btn-custom-blue btn-sm" onClick={() => setShowModal(true)}>Editar Perfil</button>
                        

                            <input type="text" className="form-control my-4" placeholder="Buscar amigos..." style={{ backgroundColor: "rgba(0,0,0,0.05)", color: "#333", borderColor: "rgba(0,0,0,0.1)" }} />

                            <div className="friend-list">
                                <h5 className="mb-3">Amigos activos</h5>
                                {store.friends.map(friend => (<FriendListItem key={friend.id} friend={friend} />))}
                            </div>
                        </div>

                        <div className="col-lg-8">
                            <div className="d-flex justify-content-around text-center mb-4 p-2 rounded" style={{ backgroundColor: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)" }}>
                                <div><strong>{tasksCompleted}</strong><br />Tareas completadas</div>
                                <div><strong>{tasksPending}</strong><br />Tareas sin hacer</div>
                                <div><strong>{clanCount}</strong><br />Clan</div>
                            </div>

                            <div className="row g-3 profile-grid">
                                <div className="col-md-6 profile-grid-item">
                                    <div className="detail-box">
                                        <h4>Detalles</h4>
                                        <p>{store.profile.bio}</p>
                                        <hr style={{ borderColor: "rgba(0,0,0,0.1)" }} />
                                        <p><i className="fas fa-map-marker-alt me-2 text-info"></i> {store.profile.city}</p>
                                        <p><i className="fas fa-birthday-cake me-2 text-info"></i> {store.profile.age} años</p>
                                        <p><i className="fas fa-phone me-2 text-info"></i> {store.profile.phone}</p>
                                        <p><i className="fas fa-venus-mars me-2 text-info"></i> {store.profile.gender}</p>
                                    </div>
                                </div>

                                <div className="col-md-6 profile-grid-item">
                                    <div className="detail-box">
                                        <h4>Mensajes</h4>
                                        <p className="text-center text-muted fst-italic mt-4">No hay mensajes nuevos.</p>
                                    </div>
                                </div>

                                <div className="col-md-6 profile-grid-item">
                                    <div className="detail-box">
                                        <h4>Otras redes</h4>
                                        <p><i className="fab fa-instagram me-2 text-info"></i> {store.profile.instagram || ""}</p>
                                        <p><i className="fab fa-twitter me-2 text-info"></i> {store.profile.twitter || ""}</p>
                                        <p><i className="fab fa-facebook me-2 text-info"></i> {store.profile.facebook || ""}</p>
                                    </div>
                                </div>

                                <div className="col-md-6 profile-grid-item">
                                    <div className="detail-box text-center d-flex flex-column justify-content-center align-items-center" style={{ height: '100%' }}>
                                        <h4 className="text-muted mb-3">Gastos del Mes</h4>
                                        <i className="fas fa-chart-line fa-3x mb-2 text-danger"></i>
                                        <h2 className="display-5 fw-bold text-danger">{totalExpenses.toFixed(2)}€</h2>
                                        <Link to="/finances" className="btn btn-sm btn-outline-danger mt-2">Ver Detalles</Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-4">
                                <div className="detail-box text-center">
                                    <div className="d-flex justify-content-center align-items-center mb-3">
                                        <h4 className="mb-0 me-3">Saldo del Bote Personal</h4>
                                        <button className="btn btn-sm btn-icon-only" onClick={() => setShowBoteModal(true)} title="Editar saldo">
                                            <i className="fas fa-pencil-alt text-info"></i>
                                        </button>
                                    </div>
                                    <h2 className="display-4 text-info" style={{ fontWeight: "bold" }}>{store.personalBote.toFixed(2)} €</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};