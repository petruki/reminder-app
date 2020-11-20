import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';

import { authService } from '../_services';

const LoginComponent = (props) => {
    return (
        <div className="card width-70 margin-auto">
            <h5 className="card-header bg-secondary text-white">Login</h5>
            <div className="card-body">
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}

                onSubmit={({ username, password }, { setStatus, setSubmitting }) => {
                    setStatus();
                    authService.login(username, password)
                        .then(user => {
                            const { from } = props.location.state || { from: { pathname: '/' } };
                            props.history.push(from);
                        }, error => {
                            setSubmitting(false);
                            setStatus('Invalid username/password');
                        });
                }}
                
                render={({ status, isSubmitting, errors }) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <Field name="username" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Field name="password" type="password" className="form-control" />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                <i className="fa fa-check"></i> Login</button>

                            <Link to="/signup">
                                <button className="btn btn-secondary margin-left-10" >
                                    <i className="fa fa-sign-out"></i> Sign Up</button>
                            </Link>
                        </div>

                        { status &&
                            <div className={'alert alert-danger'}>{ status }</div>
                        }
                    </Form>
                )}
            />
            </div>
        </div>
    );
}

export { LoginComponent }; 