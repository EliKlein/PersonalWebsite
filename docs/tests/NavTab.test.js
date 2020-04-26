import React from 'react';
import { render } from '@testing-library/react';
import NavTab from './NavTab'

it('renders without crashing', function () {
  render(<NavTab />);
});

it('matches snapshot', function () {
  const { asFragment } = render(<NavTab />);
  expect(asFragment()).toMatchSnapshot();
});