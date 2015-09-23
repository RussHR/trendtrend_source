import React, { Component, PropTypes } from 'react';
import * as ActionCreators             from '../../actions';
import ContentCenter                   from '../ContentCenter';

export default class FindAssetsSection extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        routes: PropTypes.array.isRequired
    };

    render() {
        return (
            <ContentCenter>
                <span>Finding images...</span>
            </ContentCenter>
        );
    }
}