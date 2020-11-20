import React, { useState } from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history } from '../_helpers';
import { authService } from '../_services';
import { AuthGuard } from '../_guard';
import { DashboardComponent, LoginComponent } from '.';
import { SignUpComponent } from './signup.component';

const AppComponent = () => {
    const [currentUser, setCurrentUser] = useState(null);

    const logout = () => {
        authService.logout().then(() => history.push('/login'));
    }

    useState(() => {
        authService.currentUser.subscribe(user => setCurrentUser(user));
    });

    return (
        <Router history={history} >
            <div>
                { currentUser &&
                    <nav className="navbar navbar-expand navbar-dark bg-dark">
                        <div className="navbar-nav">
                            <Link to="/" className="nav-item nav-link"><i className="fa fa-th"></i> Home</Link>
                            <Link to="/login" className="nav-item nav-link" onClick={() => logout()}>
                                <i className="fa fa-window-close"></i> Logout</Link>
                        </div>
                    </nav>
                }
                <div className="container min-height-100vh">
                    <div className="row">
                        <div className="card-body">
                            <AuthGuard exact path="/" component={DashboardComponent} />
                            <Route path="/login" component={LoginComponent} />
                            <Route path="/signup" component={SignUpComponent} />
                        </div>
                    </div>
                </div>
                <footer className="footer">
                    <div className="container text-center">
                        <span className="text-muted">Created by Roger Floriano - 2020</span>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export { AppComponent }; 