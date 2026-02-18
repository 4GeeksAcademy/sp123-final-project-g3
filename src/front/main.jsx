import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from './hooks/useGlobalReducer';
import { BackendURL } from './components/BackendURL';
import { SavedOffersProvider } from './context/SavedOffers.jsx';

import { GoogleOAuthProvider } from '@react-oauth/google';

const Main = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === "") {
        return (
            <React.StrictMode>
                <BackendURL />
            </React.StrictMode>
        );
    }

    return (
        <React.StrictMode>
            <GoogleOAuthProvider clientId={googleClientId}>
                <SavedOffersProvider>
                    <StoreProvider>
                        <RouterProvider router={router} future={{ v7_startTransition: true }} />
                    </StoreProvider>
                </SavedOffersProvider>
            </GoogleOAuthProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
