import React from 'react';

class BlockUIComponent extends React.Component {
    render() {
        return (
            <div className={this.props.blocked ? 'block' : 'hide'}></div>
        );
    }
}

export { BlockUIComponent };