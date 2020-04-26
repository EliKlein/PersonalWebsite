import React from 'react';
import './PortfolioItem.css';

function PortfolioItem({location, before, link, after}) {
  return (
    <li className="PortfolioItem">
      {before}<a href={location}>{link}</a>{after}
    </li>
  )
}

export default PortfolioItem;