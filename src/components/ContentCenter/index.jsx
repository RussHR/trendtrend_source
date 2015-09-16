import React, { Component, PropTypes }  from 'react';

export default class ContentCenter extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    };
    render() {
        return (
            <div className="request-tag-section">
                { this.props.children }
            </div>
        );
    }
}