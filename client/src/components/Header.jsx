import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => (
    <header className="d-flex flex-wrap justify-content-center py-3 border-bottom m-4">
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            <span className="fs-4">Plates</span>
        </a>
        <ul className="nav nav-pills">
            <li className="nav-item"><NavLink to="/" className="nav-link" exact>Główna</NavLink></li>
            <li className="nav-item"><NavLink to="/detect" className="nav-link">Skanuj</NavLink></li>
            <li className="nav-item"><NavLink to="/cars" className="nav-link">Pojazdy</NavLink></li>
            <li className="nav-item"><NavLink to="/info" className="nav-link">O projekcie</NavLink></li>
        </ul>
    </header>
);

export default Header;
