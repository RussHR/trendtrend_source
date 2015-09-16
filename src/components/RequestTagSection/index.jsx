import React, { Component, PropTypes, findDOMNode }  from 'react';
import * as ActionCreators                           from '../../actions';
import ContentCenter                                 from '../ContentCenter';

export default class RequestTagForm extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    componentDidMount() {
        findDOMNode(this.refs.tag).focus();
    }

    onSubmit(e) {
        e.preventDefault();
        const tag = findDOMNode(this.refs.tag).value.trim();
        if (tag) {
            this.props.dispatch(ActionCreators.findAssets(tag));
        }
    }

    render() {
        return (
            <ContentCenter>
                <h1 className="app-title">trendtrend</h1>
                <form className="request-tag-form" onSubmit={ ::this.onSubmit }>
                    <input className="tag-field" type="text" placeholder="tag to search" ref="tag" />
                    <button className="submit-tag" type="submit">
                        search
                    </button>
                </form>
                <p className="disclaimer">
                    WARNING: Random gifs from tumblr may be loaded. Those with a 
                    sensitivity to flashing images should proceed with caution.
                </p>
            </ContentCenter>
        );
    }
}