import React from 'react';
import { Switch, Redirect, Route } from 'react-router';
import About from './About';
import Portfolio from './Portfolio';
import ContactInfo from './ContactInfo';
import './Content.css';

function ContentContainer() {
  return (
    <div className="ContentContainer container">
      <Switch>
        <Route exact path="/">
          <div className="Content container">
            <About />
          </div>
        </Route>
        <Route path="/portfolio">
          <div className="Content container">
            <Portfolio />
          </div>
        </Route>
        <Route path="/contact">
          <div className="Content container">
            <ContactInfo />
          </div>
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  )
}

export default ContentContainer;