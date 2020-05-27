import React from 'react';
import ContentContainer from '../ContentContainer'
import { renderWithRouter } from './testHelper';

it('renders each route without crashing', function () {
  renderWithRouter(<ContentContainer />);
  renderWithRouter(<ContentContainer />, "portfolio");
  renderWithRouter(<ContentContainer />, "contact");
});

it('matches snapshot (main page)', function () {
  const { asFragment } = renderWithRouter(<ContentContainer />);
  expect(asFragment()).toMatchSnapshot();
});
it('matches snapshot (portfolio page)', function () {
  const { asFragment } = renderWithRouter(<ContentContainer />, "portfolio");
  expect(asFragment()).toMatchSnapshot();
});
it('matches snapshot (contact page)', function () {
  const { asFragment } = renderWithRouter(<ContentContainer />, "contact");
  expect(asFragment()).toMatchSnapshot();
});