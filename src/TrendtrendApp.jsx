import React, { Component, PropTypes }  from 'react';
import * as ActionCreators              from './actions';
import FindAssetsSection                from './components/FindAssetsSection';
import ImageAnimationHandler            from './components/ImageAnimationHandler';
import LoadAssetsSection                from './components/LoadAssetsSection';
import RequestTagSection                from './components/RequestTagSection';

export default class TrendtrendApp extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        routes: PropTypes.array.isRequired
    };

    render() {
        return (
            <div>
                { this.props.children }
            </div>
        );
    }
}