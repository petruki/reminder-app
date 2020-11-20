import React, { useState } from 'react';
import { userService, reminderService, authService } from '../_services';
import { ReminderListComponent } from './reminder-list.component';

const DashboardComponent = () => {
    const [user, setUser] = useState(authService.currentUserValue);
    const [numReminders, setNumReminders] = useState(0);

    const updateDashboard = () => {
        reminderService.count().then(data => setNumReminders(data.total));
    }

    useState(() => {
        userService.getUser().then(user => setUser(user));
        updateDashboard();
    });

    return (
        <div>
            <div className="card">
                <h5 className="card-header bg-dark text-white"><i className="fa fa-th"></i> Dashboard</h5>
                <div className="card-body">
                    <h5 className="card-title">Welcome {user.username}</h5>
                    
                    <div className="row">
                        <div className="col-sm-6">
                            <p className="card-text">You have {numReminders} items on your reminder list.</p>
                        </div>
                    </div>
                </div>
            </div>

            <ReminderListComponent updateDashboard={updateDashboard} />
        </div>
    );
}

export { DashboardComponent };