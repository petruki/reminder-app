import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authService } from '../_services';

export const AuthGuard = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = authService.currentUserValue;

        if (!currentUser) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        return <Component {...props} />
    }} />
)