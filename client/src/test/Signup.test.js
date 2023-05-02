import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import SignUp from '../layout/signup';
import { MemoryRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import AuthContextProvider from '../context/authContext';
// import { shallow, configure } from "enzyme";
// import Adapter from 'enzyme-adapter-react-16';
import ContextProvider from '../context';
import SocketProvider from '../context/socket';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from 'react-dom/test-utils';


const mock = new MockAdapter(axios);

// Thiết lập response cho API call
mock.onPost(`http://localhost:4000/api/auth/register`).reply(200, {
    data: {
        successful: true,
    }
});
// mock.onPost('http://localhost:4000/api/auth/register').reply(200, {
//   data: {
//     message: 'User successfully registered',
//   },
// });
// configure({ adapter: new Adapter() });

describe("Signup", () => {
    it("missmatch password", () => {
        render(
            <MemoryRouter>
                <CookiesProvider>
                    <AuthContextProvider>
                        <ContextProvider>
                            <SocketProvider>
                                <SignUp />
                            </SocketProvider>
                        </ContextProvider>
                    </AuthContextProvider>
                </CookiesProvider>
            </MemoryRouter>
        );

        const usernameInput = screen.getByLabelText('USERNAME');
        const passwordInput = screen.getByLabelText('PASSWORD');
        const emailInput = screen.getByLabelText('EMAIL');
        const confirmInput = screen.getByLabelText('CONFIRM PASSWORD');
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'tetpass' } });
        fireEvent.change(confirmInput, { target: { value: 'tepass' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('password mismatch')).toBeInTheDocument();
    });


    it("password with less character", () => {
        render(
            <MemoryRouter>
                <CookiesProvider>
                    <AuthContextProvider>
                        <ContextProvider>
                            <SocketProvider>
                                <SignUp />
                            </SocketProvider>
                        </ContextProvider>
                    </AuthContextProvider>
                </CookiesProvider>
            </MemoryRouter>
        );

        const usernameInput = screen.getByLabelText('USERNAME');
        const passwordInput = screen.getByLabelText('PASSWORD');
        const emailInput = screen.getByLabelText('EMAIL');
        const confirmInput = screen.getByLabelText('CONFIRM PASSWORD');
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: '1' } });
        fireEvent.change(confirmInput, { target: { value: '1' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it("wrong email", () => {
        render(
            <MemoryRouter>
                <CookiesProvider>
                    <AuthContextProvider>
                        <ContextProvider>
                            <SocketProvider>
                                <SignUp />
                            </SocketProvider>
                        </ContextProvider>
                    </AuthContextProvider>
                </CookiesProvider>
            </MemoryRouter>
        );

        const usernameInput = screen.getByLabelText('USERNAME');
        const passwordInput = screen.getByLabelText('PASSWORD');
        const emailInput = screen.getByLabelText('EMAIL');
        const confirmInput = screen.getByLabelText('CONFIRM PASSWORD');
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(emailInput, { target: { value: 'testexample.com' } });
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: '1' } });
        fireEvent.change(confirmInput, { target: { value: '1' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('Email invalidate')).toBeInTheDocument();
    });


    it("successful", () => {
        render(
            <MemoryRouter>
                <CookiesProvider>
                    <AuthContextProvider>
                        <ContextProvider>
                            <SocketProvider>
                                <SignUp />
                            </SocketProvider>
                        </ContextProvider>
                    </AuthContextProvider>
                </CookiesProvider>
            </MemoryRouter>
        );
        const usernameInput = screen.getByLabelText('USERNAME');
        const passwordInput = screen.getByLabelText('PASSWORD');
        const emailInput = screen.getByLabelText('EMAIL');
        const confirmInput = screen.getByLabelText('CONFIRM PASSWORD');
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.change(emailInput, { target: { value: 'test12234ghj123123@gmail.com' } });
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: '1123123123123' } });
        fireEvent.change(confirmInput, { target: { value: '1123123123123' } });
        fireEvent.click(submitButton);

        // await waitFor(() => expect(mock.history.post.length).toBe(1));
        // Check if the API call was successful
        expect(mock.history.post[0].url).toBe('http://localhost:4000/api/auth/register');
        expect(mock.history.post[0].data).toEqual(JSON.stringify({
            email: 'test12234ghj123123@gmail.com',
            password: '1123123123123',
            username: 'testuser',
        }));
        // await waitFor(() => {
        //     expect(screen.getByText('Register successful, please verify your email address')).toBeInTheDocument();
        // }, { timeout: 3000 });
    });
});