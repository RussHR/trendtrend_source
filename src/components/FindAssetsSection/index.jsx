import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import * as ActionCreators             from '../../actions';
import ContentCenter                   from '../ContentCenter';

@connect(state => ({}))
export default class FindAssetsSection extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.dispatch(ActionCreators.clearAssets());
    }

    componentDidMount() {
        const { dispatch, params, history } = this.props;
        dispatch(ActionCreators.findAssets(params.tag, history));
    }

    render() {
        return (
            <ContentCenter>
                <span>Finding images...</span>
            </ContentCenter>
        );
    }
}