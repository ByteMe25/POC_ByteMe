import { EditorPage } from "../features/editor/editorPage";
import { HistoryPage } from "../features/history/historyPage";
import { createBrowserRouter } from "react-router-dom";
import { Login } from "../features/auth/login";
import { Register } from "../features/auth/register";

export const router = createBrowserRouter([
  { path: "/", element: <EditorPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/editor", element: <EditorPage /> },
  { path: "/history", element: <HistoryPage /> },
]);