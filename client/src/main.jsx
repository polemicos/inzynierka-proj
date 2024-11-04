import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter, RouterProvider
} from 'react-router-dom';
import App from './App';
import CarList from './components/CarList';
import Info from './components/Info';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{
      path: "/:plate",
      element: <CarList />
    }]
  },
  {
    path: "/cars",
    element: <App />,
    children: [{
      path: "/cars",
      element: <CarList />
    }]
  },
  {
    path: "/info",
    element: <App />,
    children: [{
      path: "/info",
      element: <Info />
    }]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);