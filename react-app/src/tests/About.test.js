import React from 'react';
import { render } from '@testing-library/react';
import About from '../About'

it('renders without crashing', function () {
  render(<About />);
});

it('matches snapshot', function () {
  const { asFragment } = render(<About />);
  expect(asFragment()).toMatchSnapshot();
});