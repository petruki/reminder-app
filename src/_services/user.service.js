import { authHeader, handleResponse } from '../_helpers';
import { dev } from '../_environment';

export const userService = {
    getUser
};

function getUser() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${dev.API_URL}/api/user/me`, requestOptions).then(handleResponse);
}