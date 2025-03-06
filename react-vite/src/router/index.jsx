import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import Layout from "./Layout";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import * as api from "./api1/index"

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: api.getAllClips,
        action: api.postNewClip,
      },
      {
        path: "/clips/:clip_id",
        action: api.updateClip,
      },
      {
        path: "/clip/:clip_id",
        action: api.deleteClip,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);
