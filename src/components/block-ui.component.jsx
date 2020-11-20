import React from 'react';

const BlockUIComponent = (props) => {
    return (
        <div className={props.blocked ? 'block' : 'hide'}></div>
    ); 
}

export { BlockUIComponent };