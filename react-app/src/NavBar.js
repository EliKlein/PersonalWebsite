import React from 'react';
import NavTab from './NavTab';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="NavBar nav nav-tabs">
      <NavTab linkTo="PersonalWebsite/">About Me</NavTab>
      <NavTab linkTo="PersonalWebsite/portfolio">Projects</NavTab>
      <NavTab linkTo="PersonalWebsite/contact">Contact</NavTab>
    </nav>
  )
}

export default NavBar;