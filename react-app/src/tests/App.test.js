import React from 'react';
import App from '../App';
import { renderWithRouter } from './testHelper';

test('renders with router without crashing', () => {
  renderWithRouter(<App />);
});
