import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css'


import App from './App.jsx'

import DashboardPage from './pages/DashboardPage.jsx';
import PropertyPage from './pages/PropertyPage.jsx';
import DevToolsPage from './pages/DevToolsPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'property/:listingName', element: <PropertyPage /> },
      { path: 'dev-tools', element: <DevToolsPage /> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)