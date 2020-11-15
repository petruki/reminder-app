import React from 'react';
import { userService, reminderService, authService } from '../_services';
import { ReminderComponent } from './reminder.component';

class DashboardComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onEditChild = this.onEditChild.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onCreate = this.onCreate.bind(this);

        this.state = {
            currentUser: authService.currentUserValue,
            userFromApi: null,
            creating: false,
            blurme: false,
            blurme_excluded: 0,
            filter: '',
            reminders: []
        };
    }

    componentDidMount() {
        userService.getUser().then(userFromApi => this.setState({ userFromApi }));
        reminderService.findAll().then(data => {
            this.setState({ reminders: this.sortReminders(data), blurme: false });
        });
    }

    onChange(e, field) {
        this.setState({
            [field]: e.target.value
        });
    }

    onCreate() {
        const reminders = this.state.reminders;
        const creating = reminders.filter(r => !r._id);

        if (creating.length === 0) {
            this.setState({ 
                reminders: this.sortReminders(reminders), 
                creating: true,
                blurme: true
            });
        }
    }

    onFilter(e, clear) {
        this.setState({ 
            reminders: [], 
            filter: clear ? '' : this.state.filter 
        }, () => {
            reminderService.findAll().then(response => {
                let reminders = response.filter(reminder => {
                    return reminder.name.toLowerCase().indexOf(this.state.filter) >= 0 ||
                        reminder.description.indexOf(this.state.filter) >= 0 ||
                        reminder.priority.toLowerCase() === this.state.filter;
                });
                
                this.setState({ 
                    reminders: this.sortReminders(reminders),
                    creating: false,
                    blurme: false
                });
            });
        });
    }

    onEditChild(status, blurme_excluded) {
        this.setState({
            blurme: status,
            blurme_excluded
        });
    }

    render() {
        const { currentUser, reminders, blurme, blurme_excluded } = this.state;
        return (
            <div>
                <div className={blurme ? 'card blured' : 'card'}>
                    <h5 className="card-header bg-dark text-white"><i className="fa fa-th"></i> Dashboard</h5>
                    <div className="card-body">
                        <h5 className="card-title">Welcome {currentUser.user.username}</h5>
                        
                        <div className="row">

                            <div className="col-sm-6">
                                <p className="card-text">You have {reminders.length} items on your reminder list.</p>
                                <button className="btn btn-primary" disabled={this.state.creating} onClick={() => this.onCreate()}>
                                    <i className="fa fa-star"></i> Create</button>
                            </div>

                            <div className="col-sm-6 findReminder">
                                <input className="form-control" type="text" placeholder="Search"
                                    onChange={(e) => this.onChange(e, 'filter')}></input>

                                <button className="btn btn-primary margin-left-10" onClick={this.onFilter}>
                                    <i className="fa fa-search"></i> Find</button>

                                <button className="btn btn-secondary margin-left-10" onClick={(e) => this.onFilter(e, true)}>
                                    <i className="fa fa-repeat"></i> Clear</button>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="display-flex margin-10">
                    <hr className="left-separator" />Reminder List<hr className="right-separtor" />
                </div>

                {this.state.creating ?
                    <ReminderComponent reminder={{ name: '', description: '', priority: 'Low', date: new Date() }} creating={true}
                        onFilter={this.onFilter} /> : ''}

                {reminders.map((reminder, i) => 
                    <div key={i} className={blurme && reminder._id !== blurme_excluded ? 'blured' : ''}>
                        <ReminderComponent key={i} reminder={reminder} creating={false} onEditChild={this.onEditChild}
                            onFilter={this.onFilter} />
                    </div>)}
            </div>
        );
    }

    sortReminders(reminders) {
        return reminders.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
}

export { DashboardComponent };