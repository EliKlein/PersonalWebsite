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
        <Route exact path="/PersonalWebsite">
          <div className="Content container">
            <About />
          </div>
        </Route>
        <Route path="/PersonalWebsite/portfolio">
          <div className="Content container">
            <Portfolio />
          </div>
        </Route>
        <Route path="/PersonalWebsite/contact">
          <div className="Content container">
            <ContactInfo />
          </div>
        </Route>
        {/*
        These next routes are here to allow routing to work on my end.
        Otherwise it only works properly on github. Regardless I can't check
        that files are linked properly, but that's less of an issue because I
        won't need to check their CSS.
        */}
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
        <Redirect to="/PersonalWebsite" />
      </Switch>
    </div>
  )
}

export default ContentContainer;