import React from 'react';
import { render } from '@testing-library/react';
import Portfolio from './Portfolio'

it('renders without crashing', function () {
  render(<Portfolio />);
});

it('matches snapshot', function () {
  const { asFragment } = render(<Portfolio />);
  expect(asFragment()).toMatchSnapshot();
});