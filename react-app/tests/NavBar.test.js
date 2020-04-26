import React from 'react';
import { render } from '@testing-library/react';
import NavBar from './NavBar'

it('renders without crashing', function () {
  render(<NavBar />);
});

it('matches snapshot', function () {
  const { asFragment } = render(<NavBar />);
  expect(asFragment()).toMatchSnapshot();
});