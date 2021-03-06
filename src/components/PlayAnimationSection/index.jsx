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
        sizeMultiplier: 0,
        currentBgImgIndex: 0,
        currentTrackIndex: 0
    }
    
    componentDidMount() {
        // create the nodes/elements
        const requestAnimationFrameFunction = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozAnimationFrame);
        const AudioContextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
        const audioContext = new AudioContextClass();
        const [sourceNode1, sourceNode2, sourceNode3] = [audioContext.createBufferSource(), audioContext.createBufferSource(), audioContext.createBufferSource()];
        const analyserNode = audioContext.createAnalyser();
        const sampleSize = 1024;
        const javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);
        this.amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);

        [sourceNode1, sourceNode2, sourceNode3].forEach((sourceNode, index) => {
            // connect nodes
            sourceNode.connect(audioContext.destination);
            sourceNode.connect(analyserNode);

            // set source buffers
            sourceNode.buffer = this.props.tracks[index].audioBuffer;
        });

        analyserNode.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        // setup the handler
        javascriptNode.onaudioprocess = throttle(() => {
            analyserNode.getByteTimeDomainData(this.amplitudeArray);
            this.setImageHeight();
        }, 100);

        sourceNode1.onended = () => {
            this.setState({ currentTrackIndex: 1 }, () => {
                sourceNode2.start(0);
            });
        };
        sourceNode2.onended = () => {
            this.setState({ currentTrackIndex: 2 }, () => {
                sourceNode3.start(0);
            });
        };
        console.log(sourceNode1.onended);
        console.log(sourceNode2.onended);
        sourceNode1.start(0);
    }

    setImageHeight() {
        const { currentBgImgIndex, currentTrackIndex } = this.state;
        const { tracks } = this.props;
        const { threshold } = tracks[currentTrackIndex];
        let maxValue = -Infinity;

        for (let i = 0; i < this.amplitudeArray.length; i++) {
            const value = this.amplitudeArray[i];
            if (value > maxValue) maxValue = value;
        }

        if (maxValue > threshold) {
            const newBgImgIndex = currentBgImgIndex < 19 ? currentBgImgIndex + 1 : 0;
            this.setState({ currentBgImgIndex: newBgImgIndex });
        }
        
        const sizeMultiplier = Math.pow((maxValue/255), 4);
        this.setState({ sizeMultiplier });
    }


    render() {
        const { sizeMultiplier, currentBgImgIndex } = this.state;
        const { imageSrcs } = this.props;
        const cssBgImg = {
            backgroundImage: `url(${imageSrcs[currentBgImgIndex]})`
        };
        const cssScaleObj = {
            transform: `scale(${sizeMultiplier})`,
            MozTransform: `scale(${sizeMultiplier})`,
            WebkitTransform: `scale(${sizeMultiplier})`
        }
        const images = imageSrcs.map((imageSrc, i) => {
            return (
                <img 
                className="animation-image"
                src={ imageSrc } 
                style={cssScaleObj}
                key={ i } />
            );
        });
        
        return (
            <div className="anim-container" style={cssBgImg}>
                {images}
            </div>
        );
    }
}