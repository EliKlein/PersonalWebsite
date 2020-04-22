import React from 'react';
import {Switch, Redirect} from 'react-router';
import './ContentContainer.css';

function ContentContainer({}) {
  return (
    <div class="ContentContainer">
      <Switch>
        <Content pathOf="/">
          <About/>
        </Content>
        <Content pathOf="/resume">
          <Resume/>
        </Content>
        <Content pathOf="/portfolio">
          <Portfolio/>
        </Content>
        <Content pathOf="/contact">
          <ContactInfo/>
        </Content>
        <Redirect/>
      </Switch>
    </div>
  )
}

export default ContentContainer;