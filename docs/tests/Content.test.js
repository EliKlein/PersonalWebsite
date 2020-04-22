import React from 'react';
import {render} from '@testing-library/react';
import Content from './Content'

it('renders without crashing', function(){
  render(<Content/>);
});

it('matches snapshot', function(){
  const {asFragment} = render(<Content/>);
  expect(asFragment()).toMatchSnapshot();
});