import React from 'react';
import "./Navbar.css";
import logo from "../../assets/Graviti_Logo.png";

const Navbar = () => {
  return (
    <div>
        <div className="navbar">
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
        </div>
    </div>
  )
}

export default Navbar