import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import DeleteClipConfirmation from '../components/DeleteClipConfirmation';
import Home from "../components/Home"
import Layout from './Layout';
import * as api from './api1'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: api.getAllClips,
        action: api.postNewClip
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "clips/:clip_id/delete",
        element: <DeleteClipConfirmation />,
      },
    ],
  },
]);
