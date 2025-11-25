import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/ProfileGroups.css"; // Reutilizamos estilos
import { Sidebar } from "../components/Sidebar";

export const Chat = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [newMessage, setNewMessage] = useState("");

    // 1. Obtener Clan Activo
    const activeClan = store.clans.find(c => c.id === store.activeClanId);

    // 2. Filtrar mensajes de ESTE clan
    const clanMessages = store.chatMessages.filter(msg => msg.clanId === store.activeClanId);

    // Auto-scroll al fondo al llegar mensajes nuevos
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [clanMessages]);

    // Enviar Mensaje
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        dispatch({ type: "SEND_MESSAGE", payload: { text: newMessage } });
        setNewMessage("");
    };

    return (
        <div className="dashboard-container">
            
            <div><Sidebar/></div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="dashboard-main-content">
                <div className="dashboard-content-area page-container" style={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Header del Chat */}
                    <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded shadow-sm">
                        {activeClan ? (
                            <div>
                                <h2 className="mb-0 text-dark">Chat de: <span className="text-custom-blue">{activeClan.name}</span></h2>
                                <small className="text-muted">{activeClan.members} miembros activos</small>
                            </div>
                        ) : (
                            <h2 className="text-muted">Selecciona un clan para chatear</h2>
                        )}
                        <div className="badge bg-success">Online</div>
                    </div>

                    {/* Área de Mensajes (Scrollable) */}
                    <div 
                        className="chat-box flex-grow-1 p-3 rounded mb-3" 
                        style={{ 
                            backgroundColor: "#f5f7fb", 
                            overflowY: "auto",
                            border: "1px solid #e0e0e0"
                        }}
                    >
                        {activeClan ? (
                            clanMessages.length > 0 ? (
                                clanMessages.map((msg) => (
                                    <div 
                                        key={msg.id} 
                                        className={`d-flex mb-3 ${msg.isMe ? 'justify-content-end' : 'justify-content-start'}`}
                                    >
                                        {!msg.isMe && (
                                            <div className="me-2 text-center" style={{ width: "40px" }}>
                                                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "35px", height: "35px" }}>
                                                    {msg.userName.charAt(0)}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div 
                                            className="p-3 rounded-3 shadow-sm"
                                            style={{ 
                                                maxWidth: "70%",
                                                backgroundColor: msg.isMe ? "#0D6EFD" : "white",
                                                color: msg.isMe ? "white" : "#333",
                                                borderTopLeftRadius: "15px",
                                                borderTopRightRadius: "15px",
                                                borderBottomLeftRadius: msg.isMe ? "15px" : "0",
                                                borderBottomRightRadius: msg.isMe ? "0" : "15px"
                                            }}
                                        >
                                            {!msg.isMe && <div className="small fw-bold mb-1 text-muted">{msg.userName}</div>}
                                            <div>{msg.text}</div>
                                            <div className={`small text-end mt-1 ${msg.isMe ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: "0.75rem" }}>
                                                {msg.time}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-muted mt-5">
                                    <i className="fas fa-comments fa-3x mb-3"></i>
                                    <p>¡El chat está vacío! Sé el primero en escribir.</p>
                                </div>
                            )
                        ) : (
                            <div className="d-flex h-100 align-items-center justify-content-center text-muted">
                                <div className="text-center">
                                    <h3>🚫 No has seleccionado ningún clan</h3>
                                    <Link to="/groups" className="btn btn-custom-purple mt-3">Ir a Mis Clanes</Link>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input de Texto */}
                    {activeClan && (
                        <form onSubmit={handleSendMessage} className="bg-white p-3 rounded shadow-sm d-flex">
                            <input
                                type="text"
                                className="form-control me-2"
                                placeholder="Escribe un mensaje..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={{ borderRadius: "20px" }}
                            />
                            <button 
                                type="submit" 
                                className="btn btn-custom-blue"
                                style={{ borderRadius: "50%", width: "45px", height: "45px", padding: "0" }}
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};