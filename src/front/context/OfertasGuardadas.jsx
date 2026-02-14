import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const OfertasGuardadasContext = createContext(null);

export function OfertasGuardadasProvider({ children }) {
    const [ofertasGuardadas, setOfertasGuardadas] = useState(() => {
        try {
            const stored = localStorage.getItem("ofertasGuardadas");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("ofertasGuardadas", JSON.stringify(ofertasGuardadas));
    }, [ofertasGuardadas]);

    const estaGuardada = (jobId) =>
        ofertasGuardadas.some((j) => j.external_id === jobId);

    const toggleGuardar = (job) => {
        setOfertasGuardadas((prev) => {
            const existe = prev.some((j) => j.external_id === job.external_id);
            if (existe) return prev.filter((j) => j.external_id !== job.external_id);
            return [job, ...prev];
        });
    };

    const eliminarGuardada = (jobId) => {
        setOfertasGuardadas((prev) => prev.filter((j) => j.external_id !== jobId));
    };

    const value = useMemo(
        () => ({ ofertasGuardadas, estaGuardada, toggleGuardar, eliminarGuardada }),
        [ofertasGuardadas]
    );

    return (
        <OfertasGuardadasContext.Provider value={value}>
            {children}
        </OfertasGuardadasContext.Provider>
    );
}

export function useOfertasGuardadas() {
    const ctx = useContext(OfertasGuardadasContext);
    if (!ctx) {
        throw new Error("useOfertasGuardadas debe usarse dentro de OfertasGuardadasProvider");
    }
    return ctx;
}
