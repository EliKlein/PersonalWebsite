import React from 'react';
import {PROJECTS} from './config';
import './Portfolio.css';
import PortfolioItem from './PortfolioItem';

function Portfolio() {
  return (
    <ul className="PortfolioList">
      {
        PROJECTS.map(
          (properties, index) => <PortfolioItem {...properties} key={index}/>
        )
      }
    </ul>
  )
}

export default Portfolio;