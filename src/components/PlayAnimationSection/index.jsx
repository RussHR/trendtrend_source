import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import * as ActionCreators                           from '../../actions';

@connect(state => ({
    imageSrcs: state.imageSrcs,
    tracks: state.tracks
}))
export default class PlayAnimationSection extends Component {
    static propTypes ={
        imageSrcs: (props, propName, componentName) => {
            if (props[propName].length !== 20) {
                return new Error(
                    `imageSrcs requires 20 URLs. It only has ${ props[propName].length }.`
                );
            }
        },
        tracks: PropTypes.array.isRequired,
        dispatch: PropTypes.func.isRequired
    };
    
    componentDidMount() {
        // create the nodes/elements
        const requestAnimationFrameFunction = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozAnimationFrame);
        const AudioContextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
        const audioContext = new AudioContextClass();
        const sourceNode = audioContext.createBufferSource();
        const analyserNode = audioContext.createAnalyser();
        const sampleSize = 1024;
        const javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);
        const amplitudeArray = new Float32Array(analyserNode.frequencyBinCount);

        // connect things
        sourceNode.connect(audioContext.destination);
        sourceNode.connect(analyserNode);
        analyserNode.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        // setup the handler
        javascriptNode.onaudioprocess = () => {
            // XXX: do I need to redefine amplitude Array in here?
            analyserNode.getByteTimeDomainData(amplitudeArray);

            // if (this.audioPlaying === true) {
            // requestAnimationFrameFunction(_drawTimeDomain);
            // }
        };

        sourceNode.buffer = this.props.tracks[0].audioBuffer;
        sourceNode.start(0);
    }

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
    // }


    render() {
        let images = this.props.imageSrcs.map((imageSrc, i) => {
            return (
                <img 
                src={ imageSrc } 
                height="100"
                key={ i } />
            );
        });
        
        return (
            <div>
                {images}
            </div>
        );
    }
}