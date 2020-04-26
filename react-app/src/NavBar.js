import React from 'react';
import NavTab from './NavTab';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="NavBar nav nav-tabs">
      <NavTab linkTo="/">About Me</NavTab>
      <NavTab linkTo="/portfolio">Projects</NavTab>
      <NavTab linkTo="/contact">Contact</NavTab>
    </nav>
  )
}

export default NavBar;