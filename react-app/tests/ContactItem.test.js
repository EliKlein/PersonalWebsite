import React from 'react';
import { render } from '@testing-library/react';
import ContactItem from './ContactItem'

it('renders without crashing', function () {
  render(<ContactItem />);
});

it('matches snapshot', function () {
  const { asFragment } = render(<ContactItem />);
  expect(asFragment()).toMatchSnapshot();
});