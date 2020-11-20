import React, { useState } from 'react';
import { ReminderComponent } from './reminder.component';
import { reminderService } from '../_services';

const ReminderListComponent = (props) => {
    const [creating, setCreating] = useState(false);
    const [blurme, setBlurme] = useState(false);
    const [blurme_excluded, setBlurExcluded] = useState(0);
    const [filter, setFilter] = useState('');
    const [reminders, setReminders] = useState([]);

    const sortReminders = (reminders) => {
        return reminders.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    const onCreate = () => {
        setCreating(reminders.filter(r => !r._id).length === 0)

        if (reminders.filter(r => !r._id).length === 0) {
            setReminders(reminders);
            setCreating(true);
            setBlurme(true);
            setBlurExcluded(0);
        }
    }

    const onPressedEnter = (e) => {
        if (e.key === 'Enter') {
            onFilter();
        }
    }

    const onFilter = (e, clear) => {
        setReminders([]);
        setFilter(clear ? '' : filter);

        reminderService.findAll().then(response => {
            let remindersFiltered = response.filter(reminder => {
                const query = !clear ? filter.toLowerCase() : '';
                return reminder.name.toLowerCase().indexOf(query) >= 0 ||
                    reminder.description.toLowerCase().indexOf(query) >= 0 ||
                    reminder.priority.toLowerCase() === query;
            });

            setReminders(sortReminders(remindersFiltered));
            setCreating(false);
            setBlurme(false);
        });
    }

    const onEditChild = (status, blurme_excluded) => {
        setBlurme(status);
        setBlurExcluded(blurme_excluded);
    }

    const isBlocked = (reminderId) => {
        return blurme && reminderId !== blurme_excluded;
    }

    useState(() => {
        reminderService.findAll().then(data => {
            setReminders(sortReminders(data));
            setBlurme(false);
        });
    });

    return (
        <div className="margin-top-10">
            <div className="card component-sticky">
                <div className="card-body">
                    <div className="row margin-left-2 margin-right-2">
                        <div className="">
                            <button className="btn btn-primary" disabled={creating} onClick={() => onCreate()}>
                                <i className="fa fa-star"></i> Create</button>
                        </div>
                        <div className="findReminder">
                            <input className="form-control" type="text" placeholder="Search" value={filter}
                                onChange={(e) => setFilter(e.target.value)} onKeyDown={onPressedEnter}></input>
                            <button className="btn btn-primary margin-left-10" onClick={onFilter}>
                                <i className="fa fa-search"></i> Find</button>
                            <button className="btn btn-secondary margin-left-10" onClick={(e) => onFilter(e, true)}>
                                <i className="fa fa-repeat"></i> Clear</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="margin-10 top-100 component-sticky">
                {creating ?
                    <ReminderComponent reminder={{ name: '', description: '', priority: 'Low', date: new Date() }} creating={true}
                        onFilter={onFilter} updateDashboard={props.updateDashboard} /> : ''}
            </div>

            {reminders.length ?
                <div className="row display-flex margin-10">
                    <hr className="left-separator" />Your Reminders<hr className="right-separtor" />
                </div> :
                <div className="display-flex margin-10">
                    <hr className="left-separator" />Create your first reminder<hr className="right-separtor" />
                </div>
            }

            <div className="row reminders-container">
                {reminders.map((reminder, i) => 
                    <div key={i} className={isBlocked(reminder._id) ? 'reminder-item blured' : 'reminder-item'}>
                        <ReminderComponent key={i} reminder={reminder} creating={false} onEditChild={onEditChild}
                            onFilter={onFilter} blockui={isBlocked(reminder._id)} updateDashboard={props.updateDashboard} />
                    </div>)}
            </div>
        </div>
    );
}

export { ReminderListComponent };