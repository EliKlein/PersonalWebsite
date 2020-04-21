import React from 'react';
import {Route, Switch, Redirect} from 'react-router';
import './ContentContainer.css';

function ContentContainer({}) {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          <About/>
        </Route>
        <Route exact path="/portfolio">
          <Portfolio/>
        </Route>
        <Route exact path="/contact">
          <ContactInfo/>
        </Route>
        <Redirect/>
      </Switch>
    </div>
  )
}

export default ContentContainer;