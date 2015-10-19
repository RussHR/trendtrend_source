import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import throttle from 'lodash/function/throttle'
import * as ActionCreators from '../../actions';

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

    state = {
        sizeMultiplier: 0
    }
    
    componentDidMount() {
        // create the nodes/elements
        const requestAnimationFrameFunction = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozAnimationFrame);
        const AudioContextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
        const audioContext = new AudioContextClass();
        const sourceNode = audioContext.createBufferSource();
        const analyserNode = audioContext.createAnalyser();
        const sampleSize = 1024;
        const javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);
        this.amplitudeArray = new Float32Array(analyserNode.frequencyBinCount);

        // connect things
        sourceNode.connect(audioContext.destination);
        sourceNode.connect(analyserNode);
        analyserNode.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        // setup the handler
        javascriptNode.onaudioprocess = throttle(() => {
            this.amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
            analyserNode.getByteTimeDomainData(this.amplitudeArray);
            this.setImageHeight();
        }, 100);

        sourceNode.buffer = this.props.tracks[0].audioBuffer;
        sourceNode.start(0);
    }

    setImageHeight() {
        const { threshold } = this.props.tracks[0];
        let maxValue = -Infinity;

        for (let i = 0; i < this.amplitudeArray.length; i++) {
            const value = this.amplitudeArray[i];
            if (value > maxValue) maxValue = value;
        }

        if (maxValue > threshold) console.log (maxValue, threshold);
        
        const sizeMultiplier = Math.pow((maxValue/255), 4);
        this.setState({ sizeMultiplier });
    }


    render() {
        const { sizeMultiplier } = this.state;
        const cssScaleObj = {
            transform: `scale(${sizeMultiplier})`,
            MozTransform: `scale(${sizeMultiplier})`,
            WebkitTransform: `scale(${sizeMultiplier})`
        }
        const images = this.props.imageSrcs.map((imageSrc, i) => {
            return (
                <img 
                className="animation-image"
                src={ imageSrc } 
                style={cssScaleObj}
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