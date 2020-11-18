import React from 'react';
import { ReminderComponent } from './reminder.component';
import { reminderService } from '../_services';

class ReminderListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onEditChild = this.onEditChild.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onPressedEnter = this.onPressedEnter.bind(this);

        this.state = {
            creating: false,
            blurme: false,
            blurme_excluded: 0, //identifies which reminder-component should be displaying
            filter: '',
            reminders: []
        };
    }

    componentDidMount() {
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
                blurme: true,
                blurme_excluded: 0
            });
        }
    }

    onPressedEnter(e) {
        if (e.key === 'Enter') {
            this.onFilter();
        }
    }

    onEditChild(status, blurme_excluded) {
        this.setState({
            blurme: status,
            blurme_excluded
        });
    }

    onFilter(e, clear) {
        this.setState({ 
            reminders: [], 
            filter: clear ? '' : this.state.filter 
        }, () => {
            reminderService.findAll().then(response => {
                let reminders = response.filter(reminder => {
                    const query = this.state.filter.toLocaleLowerCase();
                    return reminder.name.toLowerCase().indexOf(query) >= 0 ||
                        reminder.description.toLowerCase().indexOf(query) >= 0 ||
                        reminder.priority.toLowerCase() === query;
                });
                
                this.setState({ 
                    reminders: this.sortReminders(reminders),
                    creating: false,
                    blurme: false
                });
            });
        });
    }

    sortReminders(reminders) {
        return reminders.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    isBlocked(reminderId) {
        const { blurme, blurme_excluded } = this.state;
        return blurme && reminderId !== blurme_excluded;
    }

    render() {
        const { reminders } = this.state;
        return (
            <div className="margin-top-10">
                <div className="card component-sticky">
                    <div className="card-body">
                        <div className="row margin-left-2 margin-right-2">
                            <div className="">
                                <button className="btn btn-primary" disabled={this.state.creating} onClick={() => this.onCreate()}>
                                    <i className="fa fa-star"></i> Create</button>
                            </div>
                            <div className="findReminder">
                                <input className="form-control" type="text" placeholder="Search"
                                    onChange={(e) => this.onChange(e, 'filter')} onKeyDown={this.onPressedEnter}></input>
                                <button className="btn btn-primary margin-left-10" onClick={this.onFilter}>
                                    <i className="fa fa-search"></i> Find</button>
                                <button className="btn btn-secondary margin-left-10" onClick={(e) => this.onFilter(e, true)}>
                                    <i className="fa fa-repeat"></i> Clear</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="margin-10 top-100 component-sticky">
                    {this.state.creating ?
                        <ReminderComponent reminder={{ name: '', description: '', priority: 'Low', date: new Date() }} creating={true}
                            onFilter={this.onFilter} /> : ''}
                </div>

                <div className="row display-flex margin-10">
                    <hr className="left-separator" />Your Reminders<hr className="right-separtor" />
                </div>

                <div className="row reminders-container">
                    {reminders.map((reminder, i) => 
                        <div key={i} className={this.isBlocked(reminder._id) ? 'reminder-item blured' : 'reminder-item'}>
                            <ReminderComponent key={i} reminder={reminder} creating={false} onEditChild={this.onEditChild}
                                onFilter={this.onFilter} blockui={this.isBlocked(reminder._id)} />
                        </div>)}
                </div>
            </div>
        );
    }

}

export { ReminderListComponent };