import React, { Component, PropTypes }  from 'react';
import { connect }           from 'react-redux';
import * as ActionCreators   from './actions';
import ImageAnimationHandler from './components/ImageAnimationHandler';

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
    loadedImageCount = 0;
    searchByTag(e) {
        e.preventDefault();
        const tag = React.findDOMNode(this.refs.tag).value.trim();
        if (tag) {
            this.props.dispatch(ActionCreators.findAssets(tag));
        }
    }

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
        return (<div>{images}</div>);
    }

    incrementLoadedImageCount() {
        this.loadedImageCount += 1;
        console.log(this.loadedImageCount);
        if (this.loadedImageCount >= 20) {
            this.props.dispatch(ActionCreators.playAnimationPhase());
        }
    }

    render() {
        const { appPhase, imageSrcs } = this.props;
        switch (appPhase) {
            case 'request tag':
                return (
                    <form onSubmit={ ::this.searchByTag }>
                        <input type="text" placeholder="Tag to search" ref="tag" />
                        <input type="submit" value="Search Posts" />
                    </form>
                );
            case 'load assets':
                return this.loadImages();
            case 'play animation':
                return <ImageAnimationHandler imageSrcs={ imageSrcs } />;
            default:
                return (<div />);
        }
    }
}