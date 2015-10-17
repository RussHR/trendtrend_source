import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import * as ActionCreators             from '../../actions';
import ContentCenter                   from '../ContentCenter';

@connect(state => ({
    imageSrcs: state.imageSrcs,
    loadedImageCount: state.loadedImageCount,
    tracks: state.tracks,
    audioBuffers: state.audioBuffers,
    loadedAudioBufferCount: state.loadedAudioBufferCount
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
        this._getAudioBuffers();
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

    _getAudioBuffers() {
        const { dispatch, tracks } = this.props;
        const audioSrcs = tracks.map((track) => {
            return track.preview_url;
        });
        dispatch(ActionCreators.getAudioBuffers(audioSrcs));
    }

    // _runBufferThroughLowpass(buffer) {
    //     const OfflineAudioContextClass = (window.OfflineAudioContext || window.webkitOfflineAudioContext || window.mozOfflineAudioContext);
    //     const offlineAudioContext = new OfflineAudioContextClass(1, buffer.length, buffer.sampleRate);
    //     const source = offlineAudioContext.createBufferSource();
    //     source.buffer = buffer;
    // }

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

    // _processBuffer(renderedBuffer) {
    //     const float32Array = renderedBuffer.getChannelData(0);
    //     const maxValue = this._getFloat32ArrayMax(float32Array);
    //     const minValue = this._getFloat32ArrayMin(float32Array);
    //     const threshold = minValue + (maxValue - minValue) * 0.9;
    //     const peaks = this._getPeaksAtThreshold(float32Array, threshold);
    //     const intervals = this._getIntervalsFromPeaks(peaks);
    // }

    // this requires a custom function because Math.max/min is recursive and causes max stack err
    // _getFloat32ArrayMax(float32Array) {
    //     let maxValue = -Infinity;
    //     const arrLength = float32Array.length;

    //     for (let i = 0; i < arrLength; i++) {
    //         const currentValue = float32Array[i];
    //         if (maxValue < currentValue) maxValue = currentValue;
    //     }

    //     return maxValue;
    // }

    // _getFloat32ArrayMin(float32Array) {
    //     let minValue = Infinity;
    //     const arrLength = float32Array.length;

    //     for (let i = 0; i < arrLength; i++) {
    //         const currentValue = float32Array[i];
    //         if (minValue > currentValue) minValue = currentValue;
    //     }

    //     return minValue;
    // }

    // _getPeaksAtThreshold(float32Array, threshold) {
    //     const peaks = [];
    //     const arrLength = float32Array.length;

    //     for (let i=0; i < arrLength; i++) {
    //         if (float32Array[i] > threshold) {
    //             peaks.push(i);
    //             i += 10000;
    //         }
    //     }

    //     return peaks;
    // }

    // _getIntervalsFromPeaks(peaks) {
    //     const intervals = [];
    //     peaks.forEach((peak, peakIndex) => {
    //         for (let i = 0; i < 10; i++) {
    //             const interval = peaks[peakIndex + i] - peak;
    //         }
    //     });

    //     return intervals;
    // }

    incrementLoadedImages() {
        const { dispatch, loadedImageCount, history } = this.props;
        dispatch(ActionCreators.imageLoaded(loadedImageCount, history));
    }

    render() {
        console.log(this.props.loadedAudioBufferCount);
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

        return (
            <ContentCenter>
                <span>Loaded Image Count: { loadedImageCount }/20</span>
                {images}
            </ContentCenter>
        );
    }
}