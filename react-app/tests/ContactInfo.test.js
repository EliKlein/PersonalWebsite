import React from 'react';
import { render } from '@testing-library/react';
import ContactInfo from './ContactInfo'

it('renders without crashing', function () {
  render(<ContactInfo />);
});

it('matches snapshot', function () {
  const { asFragment } = render(<ContactInfo />);
  expect(asFragment()).toMatchSnapshot();
});