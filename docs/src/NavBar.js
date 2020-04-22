import React from 'react';
import NavLink from 'react-router';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="NavBar">
      <NavLink className="NavBar-Link" to="/">Main</NavLink>
      <NavLink className="NavBar-Link" to="/resume">Resumé</NavLink>
      <NavLink className="NavBar-Link" to="/portfolio">Projects</NavLink>
      <NavLink className="NavBar-Link" to="/contact">Contact</NavLink>
    </nav>
  )
}

export default NavBar;