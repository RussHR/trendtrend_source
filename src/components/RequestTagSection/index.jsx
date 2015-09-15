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
            <div className="request-tag-section">
                <h1 className="app-title">trendtrend</h1>
                <form className="request-tag-form" onSubmit={ ::this.searchByTag }>
                    <input className="tag-field" type="text" placeholder="tag to search" ref="tag" />
                    <button className="submit-tag" type="submit">
                        search
                    </button>
                </form>
            </div>
        );
    }
}