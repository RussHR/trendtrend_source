import React, { Component, PropTypes, findDOMNode }  from 'react';
import * as ActionCreators                           from '../../actions';

export default class RequestTagForm extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    searchByTag(e) {
        e.preventDefault();
        const tag = findDOMNode(this.refs.tag).value.trim();
        if (tag) {
            this.props.dispatch(ActionCreators.findAssets(tag));
        }
    }

    render() {
        return (
            <form className="request-tag-form" onSubmit={ ::this.searchByTag }>
                <input type="text" placeholder="Tag to search" ref="tag" />
                <input type="submit" value="Search Posts" />
            </form>
        );
    }
}
