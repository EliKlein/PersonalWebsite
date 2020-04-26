import React from 'react';
import { render } from '@testing-library/react';
import ContentContainer from '../src/ContentContainer'

it('renders without crashing', function () {
  render(<ContentContainer />);
});

it('matches snapshot', function () {
  const { asFragment } = render(<ContentContainer />);
  expect(asFragment()).toMatchSnapshot();
});