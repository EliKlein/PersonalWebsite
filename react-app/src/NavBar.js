import React from 'react';
import NavTab from './NavTab';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="NavBar nav nav-tabs">
      <NavTab linkTo="/PersonalWebsite/">About Me</NavTab>
      <NavTab linkTo="portfolio">Projects</NavTab>
      <NavTab linkTo="contact">Contact</NavTab>
      <NavTab linkTo="/">test 1</NavTab>
      <NavTab linkTo=".">test 2</NavTab>
    </nav>
  )
}

export default NavBar;