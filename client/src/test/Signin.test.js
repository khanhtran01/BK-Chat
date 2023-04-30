import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import SignIn from './../layout/signin';
import { MemoryRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import AuthContextProvider from '../context/authContext';
import ContextProvider from '../context';
import SocketProvider from '../context/socket';

test('successful login redirects to dashboard', async () => {
    render(
        <MemoryRouter>
            <CookiesProvider>
                <AuthContextProvider>
                    <ContextProvider>
                        <SocketProvider>
                            <SignIn />
                        </SocketProvider>
                    </ContextProvider>
                </AuthContextProvider>
            </CookiesProvider>
        </MemoryRouter>

    );

    const usernameInput = screen.getByLabelText('USERNAME');
    const passwordInput = screen.getByLabelText('PASSWORD');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: '342192859hhh@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '1' } });
    // console.log(submitButton.innerHTML)
    fireEvent.click(submitButton);
    const myFunc = jest.spyOn(console, 'log');

    expect(myFunc).toHaveBeenCalledWith('login successful');

    await waitFor(() => expect(window.location.pathname).toEqual('/'), { timeout: 5000 });
});
