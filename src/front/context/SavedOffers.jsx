import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const SavedOffersContext = createContext(null);

export function SavedOffersProvider({ children }) {
    const [savedOffers, setSavedOffers] = useState(() => {
        try {
            const stored = localStorage.getItem("savedOffers");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("savedOffers", JSON.stringify(savedOffers));
    }, [savedOffers]);

    const isSaved = (jobId) =>
        savedOffers.some((job) => job.external_id === jobId);

    const toggleSave = (job) => {
        setSavedOffers((previous) => {
            const exists = previous.some((j) => j.external_id === job.external_id);
            if (exists) return previous.filter((j) => j.external_id !== job.external_id);
            return [job, ...previous];
        });
    };

    const removeSaved = (jobId) => {
        setSavedOffers((previous) => previous.filter((j) => j.external_id !== jobId));
    };

    const value = useMemo(
        () => ({ savedOffers, isSaved, toggleSave, removeSaved }),
        [savedOffers]
    );

    return (
        <SavedOffersContext.Provider value={value}>
            {children}
        </SavedOffersContext.Provider>
    );
}

export function useSavedOffers() {
    const context = useContext(SavedOffersContext);
    if (!context) {
        throw new Error("useSavedOffers must be used within SavedOffersProvider");
    }
    return context;
}
