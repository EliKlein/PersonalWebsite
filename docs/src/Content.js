import React from 'react';
import './Content.css';
import { Route } from 'react-router';

function Content({children, pathOf}) {
  return (
    <Route exact path={pathOf}>
      <div className="Content">{children}</div>
    </Route>
  )
}

export default Content;