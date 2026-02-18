import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore, actionCreators } from "../store";

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());

    // Create actions, passing dispatch and a function to get current store state
    // Note: 'store' here is the current render's state. In async actions, it might be stale if not careful, 
    // but the `actionCreators` function is recreated on every render if we do it this way.
    // However, for simplicity and typical usage in this stack, this is fine.
    // A more robust way is `useCallback` but let's stick to the pattern.

    const actions = actionCreators(dispatch, () => store);

    return <StoreContext.Provider value={{ store, actions }}>
        {children}
    </StoreContext.Provider>;
}

export default function useGlobalReducer() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useGlobalReducer must be used within a StoreProvider");
    }
    return context; // returns { store, actions }
}
