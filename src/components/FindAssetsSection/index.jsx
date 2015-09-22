import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import * as ActionCreators             from '../../actions';
import ContentCenter                   from '../ContentCenter';

@connect(state => ({}))
export default class FindAssetsSection extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        routes: PropTypes.array.isRequired
    };

    componentDidMount() {
        const { dispatch, location, history } = this.props;
        dispatch(ActionCreators.findAssets(location.query.tag, history));
    }

    render() {
        return (
            <ContentCenter>
                <span>Finding images...</span>
            </ContentCenter>
        );
    }
}