import React from 'react';
import { userService, reminderService, authService } from '../_services';
import { ReminderListComponent } from './reminder-list.component';

class DashboardComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authService.currentUserValue,
            userFromApi: null,
            total: 0
        };
    }

    componentDidMount() {
        userService.getUser().then(userFromApi => this.setState({ userFromApi }));
        reminderService.count().then(data => {
            this.setState({ total: data.total });
        });
    }

    render() {
        const { currentUser, total } = this.state;
        return (
            <div>
                <div className="card">
                    <h5 className="card-header bg-dark text-white"><i className="fa fa-th"></i> Dashboard</h5>
                    <div className="card-body">
                        <h5 className="card-title">Welcome {currentUser.user.username}</h5>
                        
                        <div className="row">
                            <div className="col-sm-6">
                                <p className="card-text">You have {total} items on your reminder list.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <ReminderListComponent />
            </div>
        );
    }

}

export { DashboardComponent };