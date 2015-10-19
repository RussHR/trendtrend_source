import React, { Component, PropTypes, findDOMNode }  from 'react';
import { connect }                                   from 'react-redux';
import * as ActionCreators                           from '../../actions';
import ContentCenter                                 from '../ContentCenter';

@connect(state => ({}))
export default class RequestTagSection extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    onSubmit(e) {
        e.preventDefault();
        const tag = findDOMNode(this.refs.tag).value.trim();
        if (tag) {
            const { dispatch, history } = this.props;
            dispatch(ActionCreators.goToFindAssets(tag, history));
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
                    <br /><br />
                    Make sure your speakers are on and adjusted.
                </p>
            </ContentCenter>
        );
    }
}