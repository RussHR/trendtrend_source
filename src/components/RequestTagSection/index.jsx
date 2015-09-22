import React, { Component, PropTypes, findDOMNode }  from 'react';
import ContentCenter                                 from '../ContentCenter';

export default class RequestTagSection extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        routes: PropTypes.array.isRequired
    };

    onSubmit(e) {
        e.preventDefault();
        const tag = findDOMNode(this.refs.tag).value.trim();
        if (tag) {
            this.props.history.pushState(null, '/find-assets', { tag });
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
                    Make sure your speakers are adjusted.
                </p>
            </ContentCenter>
        );
    }
}