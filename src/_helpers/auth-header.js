import { authService } from '../_services';

export function authHeader() {
    const currentUser = authService.currentUserValue;

    if (currentUser && currentUser.jwt) {
        return { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.jwt.token}` 
        };
    }

    return undefined;
}