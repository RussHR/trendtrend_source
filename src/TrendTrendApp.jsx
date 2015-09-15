import React, { Component, PropTypes }  from 'react';
import { connect }                      from 'react-redux';
import * as ActionCreators              from './actions';
import ImageAnimationHandler            from './components/ImageAnimationHandler';
import RequestTagSection                from './components/RequestTagSection';

@connect(state => ({
  appPhase: state.appPhase,
  imageSrcs: state.imageSrcs
}))
export default class TrendtrendApp extends Component {
    static propTypes = {
        appPhase: PropTypes.oneOf([
            'request tag',
            'find assets',
            'load assets',
            'play animation'
        ]).isRequired,
        imageSrcs: PropTypes.array.isRequired
    };
    state = {
        loadedImageCount: 0
    };

    loadImages() {
        const { imageSrcs } = this.props;
        const images = imageSrcs.map((imageSrc, i) => {
            return (
                <img 
                src={ imageSrc } 
                key={ i } 
                onLoad={ ::this.incrementLoadedImageCount }
                style={{ display: 'none' }} />
            );
        });
        return (
            <div>
                <span>Loaded Image Count: { this.state.loadedImageCount }/20</span>
                {images}
            </div>
        );
    }

    incrementLoadedImageCount() {
        const { loadedImageCount } = this.state;
        this.setState({ loadedImageCount: (loadedImageCount + 1) }, () => {
            if (this.state.loadedImageCount >= 20) {
                this.props.dispatch(ActionCreators.playAnimationPhase());
            }            
        });
    }

    render() {
        const { appPhase, imageSrcs, dispatch } = this.props;
        switch (appPhase) {
            case 'request tag':
                return (<RequestTagSection dispatch={ dispatch } />);
            case 'find assets':
                return (<span>Finding images...</span>);
            case 'load assets':
                return this.loadImages();
            case 'play animation':
                return <ImageAnimationHandler imageSrcs={ imageSrcs } />;
            default:
                return (<div />);
        }
    }
}