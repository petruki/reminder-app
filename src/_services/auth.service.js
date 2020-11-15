import { BehaviorSubject } from 'rxjs';
import { handleResponse, authHeader } from '../_helpers';
import { dev } from '../_environment';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authService = {
    login,
    logout,
    signup,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${dev.API_URL}/api/user/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        });
}

function logout() {
    const requestOptions = { method: 'POST', headers: authHeader() };
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
    return fetch(`${dev.API_URL}/api/user/logout`, requestOptions).then(handleResponse);
}

function signup(email, username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
    };

    return fetch(`${dev.API_URL}/api/user/signup`, requestOptions)
        .then(handleResponse)
        .then(user => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}
