import React from 'react';
import {render} from '@testing-library/react';
import Resume from './Resume'

it('renders without crashing', function(){
  render(<Resume/>);
});

it('matches snapshot', function(){
  const {asFragment} = render(<Resume/>);
  expect(asFragment()).toMatchSnapshot();
});