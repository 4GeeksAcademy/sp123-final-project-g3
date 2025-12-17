import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: "#f3e6ff" }}>
            <div className="flex-grow-1">
                <RouterProvider router={router} />
            </div>
        </div>
    );
}
export default App;
