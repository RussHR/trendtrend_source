import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as ActionCreators from '../../actions';
import ContentCenter from '../ContentCenter';

@connect(state => ({
    imageSrcs: state.imageSrcs,
    loadedImageCount: state.loadedImageCount,
    tracks: state.tracks,
    loadedAudioBufferCount: state.loadedAudioBufferCount,
    analysedTrackCount: state.analysedTrackCount
}))
export default class LoadAssetsSection extends Component {
    static propTypes = {
        imageSrcs: (props, propName, componentName) => {
            if (props[propName].length !== 20) {
                return new Error(
                    `imageSrcs requires 20 URLs. It only has ${ props[propName].length }.`
                );
            }
        },
        loadedImageCount: PropTypes.number.isRequired,
        tracks: PropTypes.arrayOf(PropTypes.object.isRequired),
        loadedAudioBufferCount: PropTypes.number.isRequired,
        analysedTrackCount: PropTypes.number.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    componentDidMount() {
        const { dispatch, tracks, imageSrcs } = this.props;
        this.props.dispatch(ActionCreators.getAndAnalyzeAssets(tracks, imageSrcs));
    }

    render() {
        const { loadedImageCount, loadedAudioBufferCount, analysedTrackCount } = this.props;

        return (
            <ContentCenter>
                <span>Loaded Image Count: { loadedImageCount }/20</span>
                <br />
                <span>Loaded Audio Track Count: { loadedAudioBufferCount }/3</span>
                <br />
                <span>Tracks Analysed: { analysedTrackCount }/3</span>
            </ContentCenter>
        );
    }
}