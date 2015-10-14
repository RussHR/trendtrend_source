import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import * as ActionCreators             from '../../actions';
import ContentCenter                   from '../ContentCenter';

@connect(state => ({
    imageSrcs: state.imageSrcs,
    loadedImageCount: state.loadedImageCount,
    tracks: state.tracks
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
        const ContextClass = (window.AudioContext || window.webkitAudioContext);
        const audioContext = new ContextClass();
        const request = new XMLHttpRequest();
        request.open('GET', this.props.tracks[0].preview_url, true)
        request.responseType = 'arraybuffer';
        request.send();
        request.onload = (e) => {
            audioContext.decodeAudioData(request.response, (buffer) => {
                this._runBufferThroughLowpass(buffer);
            });
        };
    }

    _runBufferThroughLowpass(buffer) {
        const offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
        const source = offlineContext.createBufferSource();
        source.buffer = buffer;
        const filter = offlineContext.createBiquadFilter();
        filter.type = "lowpass";
        source.connect(filter);
        filter.connect(offlineContext.destination);
        source.start(0);
        offlineContext.startRendering();
        offlineContext.oncomplete = (e) => {
            this._processBuffer(e.renderedBuffer);
        };
    }
    _processBuffer(renderedBuffer) {
        const float32Array = renderedBuffer.getChannelData(0);
        const maxValue = this._getFloat32ArrayMax(float32Array);
        const minValue = this._getFloat32ArrayMin(float32Array);
        const threshold = minValue + (maxValue - minValue) * 0.92;
        const peaks = this._getPeaksAtThreshold(float32Array, threshold);
        console.log(peaks);
    }
    // this requires a custom function because Math.max/min is recursive and causes max stack err
    _getFloat32ArrayMax(float32Array) {
        let maxValue = -Infinity;
        const arrLength = float32Array.length;

        for (let i = 0; i < arrLength; i++) {
            const currentValue = float32Array[i];
            if (maxValue < currentValue) maxValue = currentValue;
        }
        return maxValue;
    }
    _getFloat32ArrayMin(float32Array) {
        let minValue = Infinity;
        const arrLength = float32Array.length;

        for (let i = 0; i < arrLength; i++) {
            const currentValue = float32Array[i];
            if (minValue > currentValue) minValue = currentValue;
        }
        return minValue;
    }
    _getPeaksAtThreshold(float32Array, threshold) {
        const peaks = [];
        const arrLength = float32Array.length;

        for (let i=0; i < arrLength; i++) {
            if (float32Array[i] > threshold) {
                peaks.push(i);
                i += 10000;
            }
        }
        return peaks;
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

        return (
            <ContentCenter>
                <span>Loaded Image Count: { loadedImageCount }/20</span>
                {images}
            </ContentCenter>
        );
    }
}