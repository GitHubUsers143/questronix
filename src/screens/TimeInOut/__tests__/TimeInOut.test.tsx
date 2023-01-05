import { render } from '@testing-library/react-native';
import * as React from 'react';
import TimeInOut from '../TimeInOut';

beforeEach(() => {
  render(<TimeInOut />);
});

describe('user time in / time out', () => {
  it('renders time', () => {});
  it('renders address', () => {});
  describe('user not yet timed in', () => {
    it('render time in button', () => {});
    describe('user press time in', () => {
      it('renders camera preview', () => {});
      describe('user press take photo', () => {
        it('saves photo, time, address as time in details and returns to time in / out page', () => {});
      });
    });
  });

  describe('user already timed in', () => {
    it('renders time out button', () => {});
    describe('user press time out button', () => {
      it('renders camera preview', () => {});
      describe('user takes photo', () => {
        it('saves photo, time, address as time out details and returns to time in / out page', () => {});
      });
    });
  });

  describe('user clicks profile icon', () => {
    it('navigates and renders profile page', () => {});
  });
});
