import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import LoginScreen from '../Login';
import { act } from 'react-test-renderer';
import {
  minPassword,
  testEmail,
  testHash,
  testPass,
  validationMessage,
} from '../../../constants/loginValidationMessages';
import * as service from '../../../services/api/Authentication/LoginService';
import StatusModal from '../../../components/Login/StatusModal';
import {
  failButtonText,
  failDescription,
  failMessage,
} from '../../../constants/loginFailMessages';

beforeEach(async () => {
  render(<LoginScreen />);
});

afterEach(async () => {});

describe('user login', () => {
  describe('when user enters incorrect email', () => {
    it('renders invalid email address message', async () => {
      const emailInput = screen.getByTestId('email-input');
      fireEvent.changeText(emailInput, 'test');

      const emailErrorOutput = await screen.findByTestId('email-error');
      expect(emailErrorOutput.props.children).toMatch(
        validationMessage.emailInvalid
      );
    });
  });

  describe('when user empties the email input', () => {
    it('renders email address required message', async () => {
      const emailInput = screen.getByTestId('email-input');
      fireEvent.changeText(emailInput, '');

      const emailErrorOutput = await screen.findByTestId('email-error');
      expect(emailErrorOutput.props.children).toBe(
        validationMessage.emailRequired
      );
    });
  });

  describe('when user empties the password input', () => {
    it('renders password required message', async () => {
      const passwordInput = screen.getByTestId('password-input');
      fireEvent.changeText(passwordInput, '');

      const passwordErrorOutput = await screen.findByTestId('password-error');
      expect(passwordErrorOutput.props.children).toBe(
        validationMessage.passwordRequired
      );
    });
  });

  describe(`when user enters password character less than ${minPassword}`, () => {
    it('renders minimum character password message', async () => {
      const passwordInput = screen.getByTestId('password-input');
      fireEvent.changeText(passwordInput, '12');

      const passwordErrorOutput = await screen.findByTestId('password-error');
      expect(passwordErrorOutput.props.children).toBe(
        validationMessage.passwordMinRequired
      );
    });
  });

  describe('when user enters correct email and password', () => {
    it('renders login success', async () => {
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');

      await act(() => {
        fireEvent.changeText(emailInput, testEmail);
        fireEvent.changeText(passwordInput, testPass);
      });
      const loginButton = screen.getByTestId('login-button');

      expect(loginButton.props.accessibilityState.disabled).not.toBeTruthy();
    });

    describe('when user clicks the login button', () => {
      it('renders login success', async () => {
        const mockData = { email: testEmail, password: testPass };

        jest.spyOn(service, 'default').mockResolvedValueOnce(testHash);
        const response = await service.default(mockData);

        expect(response).toEqual(testHash);
      });
    });
  });

  describe('when user enters incorrect email and password', () => {
    it('renders login fail', async () => {
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      await act(() => {
        fireEvent.changeText(emailInput, testEmail);
        fireEvent.changeText(passwordInput, testPass);
      });
      const loginButton = screen.getByTestId('login-button');

      expect(loginButton.props.accessibilityState.disabled).not.toBeTruthy();
    });

    describe('when user clicks the login button', () => {
      it('shows the status modal with a message', async () => {
        const { getByTestId } = render(
          <StatusModal
            showing={true}
            setShowing={() => {}}
            message={failMessage}
            description={failDescription}
            buttonText={failButtonText}
          />
        );

        expect(getByTestId('status-modal').props.visible).toBeTruthy();
      });
    });

    describe('when user clicks the close button on the modal', () => {
      it('closes the modal', () => {
        const handleShowFail = jest.fn();
        const { getByTestId } = render(
          <StatusModal
            showing={true}
            setShowing={handleShowFail}
            message={failMessage}
            description={failDescription}
            buttonText={failButtonText}
          />
        );

        fireEvent.press(getByTestId('status-modal-button'));

        expect(handleShowFail).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when all test have been completed', () => {
    it('compares current file to snapshot', async () => {
      expect(screen.toJSON()).toMatchSnapshot();
    });
  });
});
