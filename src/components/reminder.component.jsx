import React from 'react';
import DatePicker from "react-datepicker";
import { authService, reminderService } from '../_services';
import "react-datepicker/dist/react-datepicker.css";

class ReminderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authService.currentUserValue,
            editing: props.creating,
            deleting: false,
            reminder: props.reminder
        };

        this.state.reminder.date = new Date(props.reminder.date);
    }

    onChangeDate(date) {
        const reminder = this.state.reminder;
        reminder.date = date;
        this.setState({
            reminder
        });
    }

    onChange(e, field) {
        const reminder = this.state.reminder;
        reminder[field] = e.target.value;
        this.setState({
            reminder
        });
    }

    onToggleEdit(status) {
        this.setState({
            editing: status
        });

        if (!status) {
            if (this.state.reminder._id) {
                reminderService
                    .updateById(this.state.reminder)
                    .then(() => this.props.onFilter())
                    .catch((e) => this.props.onFilter());
            } else {
                reminderService
                    .create(this.state.reminder)
                    .then(() => this.props.onFilter())
                    .catch((e) => this.props.onFilter());
            }
        } else {
            this.props.onEditChild(status, this.state.reminder._id);
        }
    }

    onCancelDelete() {
        if (this.state.reminder._id) {
            if (this.state.editing) {
                this.onToggleEdit(false);
            } else {
                this.setState({ deleting: true });
            }
        } else {
            this.props.onFilter();
        }
    }

    onConfirmDelete(response) {
        if (response) {
            reminderService
                .deleteById(this.state.reminder._id)
                .then(() => this.props.onFilter());
        } else {
            this.setState({ deleting: false });
        }
    }

    render() {
        const { name, description, priority, date } = this.state.reminder;
        return (
            <div className={this.state.editing ? 'card margin-bottom-10 editing' : 'card margin-bottom-10'}>
                <div className="card-header">
                    <p className="margin-auto" hidden={this.state.editing}><i className="fa fa-star"></i> {name}</p>
                    <input hidden={!this.state.editing} type="text" 
                        className="form-control" placeholder="Reminder Name" value={name}
                        onChange={(e) => this.onChange(e, 'name')}>
                    </input>
                </div>
                <div className="card-body">
                    <div className="margin-bottom-10">
                        <p hidden={this.state.editing}>{description}</p>
                        <textarea hidden={!this.state.editing} placeholder="Reminder Description"
                            className="form-control margin-bottom-10" rows="3" value={description}
                            onChange={(e) => this.onChange(e, 'description')}>
                        </textarea>
                        <hr />
                        <div className="display-flex">
                            <select className="custom-select width-20" disabled={!this.state.editing}
                                onChange={(e) => this.onChange(e, 'priority')}>
                                <option value={priority}>{priority}</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <DatePicker className="form-control margin-left-10"
                                disabled={!this.state.editing}
                                selected={date ? date : this.state.startDate} 
                                onChange={date => this.onChangeDate(date)} />
                        </div>
                    </div>
                    <div className={this.state.deleting ? 'hide' : ''}>
                        <button className={this.state.editing ? 'btn btn-success margin-left-10' : 'btn btn-primary margin-left-10'}
                            onClick={() => this.onToggleEdit(!this.state.editing)}>
                                <i className="fa fa-pencil-square-o"></i> {this.state.editing ? 'Save' : 'Edit'}
                        </button>
                        <button className={this.state.editing ? 'btn btn-secondary margin-left-10' : 'btn btn-danger margin-left-10'}
                            onClick={() => this.onCancelDelete()}>
                                <i className={this.state.editing ? 'fa fa-times' : 'fa fa-trash-o'}></i> {this.state.editing ? 'Cancel' : 'Delete'}
                        </button>
                    </div>
                    <div className={this.state.deleting ? 'confirmation-panel' : 'hide'}>
                        <p><i className="fa fa-exclamation"></i> Are you sure you want to delete this reminder?</p>
                        <button className="btn btn-secondary margin-left-10" onClick={() => this.onConfirmDelete(true)}>
                            <i className="fa fa-check"></i> Yes
                        </button>
                        <button className="btn btn-secondary margin-left-10" onClick={() => this.onConfirmDelete(false)}>
                            <i className="fa fa-times"></i> No
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export { ReminderComponent };