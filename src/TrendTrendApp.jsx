import React, { Component, PropTypes }  from 'react';
import { connect }                      from 'react-redux';
import * as ActionCreators              from './actions';
import FindAssetsSection                from './components/FindAssetsSection';
import ImageAnimationHandler            from './components/ImageAnimationHandler';
import LoadAssetsSection                from './components/LoadAssetsSection';
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

    onLoadImage() {
        const { loadedImageCount } = this.state;
        this.setState({ loadedImageCount: (loadedImageCount + 1) }, () => {
            if (this.state.loadedImageCount >= 20) {
                this.props.dispatch(ActionCreators.playAnimationPhase());
            }            
        });
    }

    render() {
        const { appPhase, imageSrcs, dispatch } = this.props;
        const { loadedImageCount } = this.state;

        switch (appPhase) {
            case 'request tag':
                return (<RequestTagSection dispatch={ dispatch } />);
            case 'find assets':
                return (<FindAssetsSection />);
            case 'load assets':
                return (<LoadAssetsSection imageSrcs={ imageSrcs } 
                                           loadedImageCount={ loadedImageCount } 
                                           onLoadImage={ ::this.onLoadImage } />);
            case 'play animation':
                return <ImageAnimationHandler imageSrcs={ imageSrcs } />;
            default:
                return (<div />);
        }
    }
}