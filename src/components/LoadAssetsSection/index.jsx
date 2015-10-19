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
        const { dispatch, tracks, imageSrcs } = this.props;
        this.props.dispatch(ActionCreators.getAndAnalyzeAssets(tracks, imageSrcs, history));
        // create the nodes/elements
        // const requestAnimationFrameFunction = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozAnimationFrame);
        // this.audioContext = new AudioContextClass();
        // let audioBuffer;
        // this.sourceNode = this.audioContext.createBufferSource();
        // const analyserNode = this.audioContext.createAnalyser();
        // const sampleSize = 1024;
        // const javascriptNode = this.audioContext.createScriptProcessor(sampleSize, 1, 1);
        // this.audioPlaying = false;
        // window.amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
        // window._drawTimeDomain = this._drawTimeDomain;
        // const audioUrl = this.props.tracks[0].preview_url;

        // // connect things
        // this.sourceNode.connect(this.audioContext.destination);
        // this.sourceNode.connect(analyserNode);
        // analyserNode.connect(javascriptNode);
        // javascriptNode.connect(this.audioContext.destination);

        // // setup the handler
        // javascriptNode.onaudioprocess = () => {
        //     // XXX: do I need to redefine amplitude Array in here?
        //     analyserNode.getByteTimeDomainData(window.amplitudeArray);

        //     if (this.audioPlaying === true) {
        //         requestAnimationFrameFunction(window._drawTimeDomain);
        //     }
        // };

        // if (!this.audioData) {
        //     this._loadSound(audioUrl);
        // } else {
        //     this._playSound(audioData);
        // }
    }

    // _loadSound(url) {
    //     const request = new XMLHttpRequest();
    //     request.open('GET', url, true)
    //     request.responseType = 'arraybuffer';
    //     request.onload = (e) => {
    //         this.audioContext.decodeAudioData(request.response, (buffer) => {
    //             this.audioData = buffer;
    //             this._playSound(this.audioData);
    //         });
    //     };
    //     request.send();
    // }

    // _playSound(buffer) {
    //     this.sourceNode.buffer = buffer;
    //     this.sourceNode.start(0);
    //     this.sourceNode.loop = true;
    //     this.audioPlaying = true;
    // }
    // _drawTimeDomain() {
    //     window.requestAnimationFrame(window._drawTimeDomain);
    //     window.frameCount = (window.frameCount || 0);
    //     let minValue = Infinity;
    //     let maxValue = -Infinity;
    //     for (let i = 0; i < window.amplitudeArray.length; i++) {
    //         const value = window.amplitudeArray[i] / 255;
    //         if (value > maxValue) {
    //             maxValue = value;
    //         } else if (value < minValue) {
    //             minValue = value;
    //         }
    //     }
    //     window.frameCount += 1;
    //     if (window.frameCount > 200) {
    //         console.log(maxValue);
    //         window.frameCount = 0;
    //     }
    // }
    //     const filter = offlineContext.createBiquadFilter();
    //     filter.type = "lowpass";
    //     const analyser = offlineContext.createAnalyser();
    //     const dataArray = new Uint8Array(analyser.fftSize);
    //     debugger
    //     source.connect(filter);
    //     filter.connect(offlineContext.destination);
    //     source.start(0);
    //     offlineContext.startRendering();
    //     offlineContext.oncomplete = (e) => {
    //         this._processBuffer(e.renderedBuffer);
    //     };
    // }

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