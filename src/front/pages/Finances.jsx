import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/ProfileGroups.css";

export const Finances = () => {
    const { store, dispatch } = useGlobalReducer();
    const activeClanId = store.activeClanId;

    const [clanConcept, setClanConcept] = useState("");
    const [clanAmount, setClanAmount] = useState("");
    

    const [personalConcept, setPersonalConcept] = useState("");
    const [personalAmount, setPersonalAmount] = useState("");

    
    const [showBoteModal, setShowBoteModal] = useState(false);
    const [boteAmount, setBoteAmount] = useState(""); 

  
    const currentBote = store.commonBote[activeClanId] || 0.00;
    const activeExpenses = store.expenses.filter(exp => exp.clanId === activeClanId);
    const activeBalances = store.balances.filter(bal => bal.clanId === activeClanId);
   
    const personalBote = store.personalBote;
    const personalExpenses = store.personalExpenses;

    const handleAddClanExpense = (e) => {
        e.preventDefault();
        if (!clanConcept || !clanAmount || parseFloat(clanAmount) <= 0) return alert("Introduce un concepto y un importe válido.");
        dispatch({ type: "ADD_EXPENSE", payload: { concept: clanConcept, amount: clanAmount } });
        setClanConcept("");
        setClanAmount("");
    };
    
    
    const handleAddPersonalExpense = (e) => {
        e.preventDefault();
        if (!personalConcept || !personalAmount || parseFloat(personalAmount) <= 0) return alert("Introduce un concepto y un importe válido.");
        dispatch({ type: "ADD_PERSONAL_EXPENSE", payload: { concept: personalConcept, amount: personalAmount } });
        setPersonalConcept("");
        setPersonalAmount("");
    };

    const handleAddToBote = (e) => {
        e.preventDefault();
        if (parseFloat(boteAmount) <= 0 || !boteAmount) return alert("Introduce un importe positivo.");
        dispatch({ type: "ADD_TO_BOTE", payload: { amount: boteAmount } });
        setShowBoteModal(false);
        setBoteAmount("");
    };

    return (
        <div className="container page-container">
            
            {showBoteModal && (
                <div className="modal" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content modal-content-dark">
                            <form onSubmit={handleAddToBote}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Añadir fondos al Bote Común</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowBoteModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="boteAmount" className="form-label">Importe (€)</label>
                                        <input
                                            type="number"
                                            step="1" 
                                            className="form-control"
                                            id="boteAmount"
                                            value={boteAmount}
                                            onChange={(e) => setBoteAmount(e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowBoteModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-custom-blue">Añadir</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showBoteModal && <div className="modal-backdrop fade show"></div>}

            <div className="main-box mb-4">
                <h2 className="mb-4">Tus Finanzas Personales</h2>
                <div className="row g-4">
                    {/* Bote Personal */}
                    <div className="col-lg-5">
                        <div className="detail-box text-center" style={{ height: '100%' }}>
                            <h4>Bote Personal</h4>
                            <h1 className="display-3 fw-bold my-3 text-info">{personalBote.toFixed(2)} €</h1>
                        </div>
                    </div>
                    
                    <div className="col-lg-7">
                        <div className="detail-box" style={{ height: '100%' }}>
                            <h4><i className="fas fa-receipt me-2"></i> Añadir Gasto Personal</h4>
                            <form onSubmit={handleAddPersonalExpense} className="mt-3">
                                <div className="mb-3">
                                    <label htmlFor="p_concept" className="form-label">Concepto</label>
                                    <input type="text" className="form-control" id="p_concept" value={personalConcept} onChange={(e) => setPersonalConcept(e.target.value)} placeholder="Ej: Café"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="p_amount" className="form-label">Importe (€)</label>
                                    <input 
                                        type="number" 
                                        step="1" 
                                        className="form-control" 
                                        id="p_amount" 
                                        value={personalAmount} 
                                        onChange={(e) => setPersonalAmount(e.target.value)} 
                                        placeholder="0"
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-custom-purple">Añadir Gasto (se restará)</button>
                                </div>
                            </form>
                        </div>
                    </div>
                  
                    <div className="col-12">
                        <div className="detail-box">
                            <h4>Historial de Gastos Personales</h4>
                            <ul className="list-group list-group-flush mt-3">
                                {personalExpenses.length > 0 ? personalExpenses.map(expense => (
                                    <li key={expense.id} className="list-group-item expense-item">
                                        <div className="expense-details">
                                            <span className="expense-concept">{expense.concept}</span>
                                            <span className="expense-paidby">Fecha: {expense.date}</span>
                                        </div>
                                        <span className="expense-amount">-{expense.amount.toFixed(2)} €</span>
                                    </li>
                                )) : (
                                    <p className="text-muted text-center mt-3">No hay gastos personales.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
           
            {!activeClanId ? (
                <div className="main-box text-center">
                    <p className="lead text-muted mt-4">Selecciona un clan en la página de "Grupos" para ver sus finanzas.</p>
                </div>
            ) : (
                <div className="main-box">
                    <h2 className="mb-4">Finanzas: {store.clans.find(c => c.id === activeClanId)?.name}</h2>
                    <div className="row g-4">
                        
                        <div className="col-lg-5">
                            <div className="detail-box text-center" style={{ height: '100%' }}>
                                <h4>Bote Común</h4>
                                <h1 className="display-3 fw-bold my-3 text-info">{currentBote.toFixed(2)} €</h1>
                                <button className="btn btn-custom-blue" onClick={() => setShowBoteModal(true)}>
                                    <i className="fas fa-plus me-2"></i> Añadir fondos
                                </button>
                            </div>
                        </div>
                        
                        <div className="col-lg-7">
                            <div className="detail-box" style={{ height: '100%' }}>
                                <h4><i className="fas fa-shopping-cart me-2"></i> Añadir Gasto de Clan</h4>
                                <form onSubmit={handleAddClanExpense} className="mt-3">
                                    <div className="mb-3">
                                        <label htmlFor="g_concept" className="form-label">Concepto</label>
                                        <input type="text" className="form-control" id="g_concept" value={clanConcept} onChange={(e) => setClanConcept(e.target.value)} placeholder="Ej: Pizzas para la reunión"/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="g_amount" className="form-label">Importe (€)</label>
                                        <input 
                                            type="number" 
                                            step="1" // <-- CAMBIO A NÚMEROS ENTEROS
                                            className="form-control" 
                                            id="g_amount" 
                                            value={clanAmount} 
                                            onChange={(e) => setClanAmount(e.target.value)} 
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-custom-purple">Añadir al Bote (se restará)</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                      
                        <div className="col-lg-7">
                            <div className="detail-box">
                                <h4>Historial de Gastos del Clan</h4>
                                <ul className="list-group list-group-flush mt-3">
                                    {activeExpenses.length > 0 ? activeExpenses.map(expense => (
                                        <li key={expense.id} className="list-group-item expense-item">
                                            <div className="expense-details">
                                                <span className="expense-concept">{expense.concept}</span>
                                                <span className="expense-paidby">Pagado por: {expense.paidBy}</span>
                                            </div>
                                            <span className="expense-amount">-{expense.amount.toFixed(2)} €</span>
                                        </li>
                                    )) : (
                                        <p className="text-muted text-center mt-3">No hay gastos registrados para este clan.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                        
                        <div className="col-lg-5">
                            <div className="detail-box">
                                <h4>Balances del Grupo</h4>
                                <ul className="list-group list-group-flush mt-3">
                                    {activeBalances.length > 0 ? activeBalances.map(balance => (
                                        <li key={balance.id} className="list-group-item balance-item">
                                            <span>{balance.name}</span>
                                            <span className={balance.amount >= 0 ? 'balance-positive' : 'balance-negative'}>
                                                {balance.amount.toFixed(2)} €
                                            </span>
                                        </li>
                                    )) : (
                                        <p className="text-muted text-center mt-3">No hay balances calculados.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};