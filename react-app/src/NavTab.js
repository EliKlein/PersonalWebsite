import React from 'react';
import { NavLink } from 'react-router-dom';

function NavTab({linkTo, children}) {
  return (
    <div className="NavTab nav-item">
      <NavLink className="NavLink nav-link" exact to={linkTo}>{children}</NavLink>
    </div>
  )
}

export default NavTab;