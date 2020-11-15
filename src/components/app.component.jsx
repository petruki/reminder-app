import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history } from '../_helpers';
import { authService } from '../_services';
import { AuthGuard } from '../_guard';
import { DashboardComponent, LoginComponent } from '.';
import { SignUpComponent } from './signup.component';

class AppComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        authService.currentUser.subscribe(user => this.setState({
            currentUser: user
        }));
    }

    logout() {
        authService.logout().then(() => history.push('/login'));
    }

    render() {
        const { currentUser } = this.state;
        return (
            <Router history={history} >
                <div>
                    { currentUser &&
                        <nav className="navbar navbar-expand navbar-dark bg-dark">
                            <div className="navbar-nav">
                                <Link to="/" className="nav-item nav-link"><i className="fa fa-th"></i> Home</Link>
                                <Link to="/login" className="nav-item nav-link" onClick={() => this.logout()}>
                                    <i className="fa fa-window-close"></i> Logout</Link>
                            </div>
                        </nav>
                    }
                    <div className="container">
                        <div className="row">
                            <div className="card-body">
                                <AuthGuard exact path="/" component={DashboardComponent} />
                                <Route path="/login" component={LoginComponent} />
                                <Route path="/signup" component={SignUpComponent} />
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export { AppComponent }; 