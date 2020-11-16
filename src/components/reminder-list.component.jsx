import React from 'react';
import { ReminderComponent } from './reminder.component';

class ReminderListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onEditChild = this.onEditChild.bind(this);
        this.state = props.state;
    }

    onEditChild(status, blurme_excluded) {
        this.setState({
            blurme: status,
            blurme_excluded
        });
    }

    render() {
        const { reminders, blurme, blurme_excluded } = this.state;
        return (
            <div>
                <div className="display-flex margin-10">
                    <hr className="left-separator" />Your Reminders<hr className="right-separtor" />
                </div>

                <div className="reminders-container">
                    {reminders.map((reminder, i) => 
                        <div key={i} className={blurme && reminder._id !== blurme_excluded ? 'reminder-item blured' : 'reminder-item'}>
                            <ReminderComponent key={i} reminder={reminder} creating={false} onEditChild={this.onEditChild}
                                onFilter={this.props.onFilter} />
                        </div>)}
                </div>
            </div>
        );
    }

}

export { ReminderListComponent };