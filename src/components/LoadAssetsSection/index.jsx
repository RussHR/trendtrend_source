import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import * as ActionCreators             from '../../actions';
import ContentCenter                   from '../ContentCenter';

@connect(state => ({
    imageSrcs: state.imageSrcs,
    loadedImageCount: state.loadedImageCount,
    track: state.track
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
        track: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        routes: PropTypes.array.isRequired
    };

    componentWillMount() {
        const { imageSrcs, dispatch, history } = this.props;
        if (imageSrcs.length < 20) dispatch(ActionCreators.goToRequestTag(history));
    }

    componentDidMount() {
        const audioContext = new AudioContext();
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = `${this.props.track.stream_url}?client_id=38dc81e57f5a4f5c7dc26fc5e5315b1e`;
        const audioSrc = audioContext.createMediaElementSource(audio);
        const analyser = audioContext.createAnalyser();
        audioSrc.connect(analyser);
        audioSrc.connect(audioContext.destination);
        const bufferLength = analyser.frequencyBinCount; // 1024
        const dataArray = new Uint8Array(bufferLength);

        function renderFrame() {
             requestAnimationFrame(renderFrame);

             analyser.getByteFrequencyData(dataArray);
             console.log(dataArray);
        }
        
        audio.play();
        renderFrame();
    }

    incrementLoadedImages() {
        const { dispatch, loadedImageCount, history } = this.props;
        dispatch(ActionCreators.imageLoaded(loadedImageCount, history));
    }

    render() {
        const { imageSrcs, loadedImageCount, track } = this.props;
        const images = imageSrcs.map((imageSrc, i) => {
            return (
                <img 
                src={ imageSrc } 
                key={ i } 
                onLoad={ ::this.incrementLoadedImages }
                className="loading-image" />
            );
        });
        // const trackAudio = <audio src={`${track.stream_url}?client_id=38dc81e57f5a4f5c7dc26fc5e5315b1e`} controls />;

        return (
            <ContentCenter>
                <span>Loaded Image Count: { loadedImageCount }/20</span>
                {images}
            </ContentCenter>
        );
    }
}