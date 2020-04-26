import React from 'react';
import { render } from '@testing-library/react';
import PortfolioItem from './PortfolioItem'

it('renders without crashing', function () {
  render(<PortfolioItem />);
});

it('matches snapshot', function () {
  const { asFragment } = render(<PortfolioItem />);
  expect(asFragment()).toMatchSnapshot();
});