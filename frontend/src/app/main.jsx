import { RouterProvider } from "react-router-dom";
import { router } from "./router"; 
import ReactDOM from "react-dom/client";
import { AuthProvider } from "../context/AuthContext";
import { HistoryProvider } from "../context/HistoryContext";
import { DocNameProvider } from "../context/openedDocContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <DocNameProvider>
      <HistoryProvider>
        <RouterProvider router={router} />
      </HistoryProvider>
    </DocNameProvider>
  </AuthProvider>
);