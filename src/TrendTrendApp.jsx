import React, { Component, PropTypes }  from 'react';
import { connect }           from 'react-redux';
import * as ActionCreators   from './actions';
import superagent            from 'superagent';
import superagentJSONP       from 'superagent-jsonp';
superagentJSONP(superagent);
import ImageAnimationHandler from './components/ImageAnimationHandler';

@connect(state => ({
  appPhase: state.appPhase
}))
export default class TrendtrendApp extends Component {
    static propTypes = {
        appPhase: PropTypes.oneOf([
            'request tag',
            'find assets',
            'load assets',
            'play animation'
        ]).isRequired
    };
    imageSrcs = [];
    loadedImageCount = 0;

    searchByTag(e) {
        e.preventDefault();
        const tag = React.findDOMNode(this.refs.tag).value.trim();
        if (tag) {
            this.props.dispatch(ActionCreators.findAssets());
            this.retrievePosts(tag);
        }
    }

    retrievePosts(tag, beforeTime = (Date.parse(new Date())/1000)) {
        let self = this;
        superagent.get('https://api.tumblr.com/v2/tagged')
            .query({
                tag: tag,
                before: beforeTime,
                api_key: 'srSUAuHBEN6yZPG4p8N8LaYD8lp5vGIS9mBYOVnx8bA7xa6mpz' 
            })
            .jsonp()
            .end((err, res) => {
                let tumblrPosts = res.body.response;
                if (tumblrPosts.errors || err) {
                    // there was an error such as a tag not being supplied
                    console.log('sorry, there was an error!');
                    this.props.dispatch(ActionCreators.requestTagPhase());
                } else {
                    for (let postI = 0; postI < tumblrPosts.length; postI++) {
                        let postPhotos = tumblrPosts[postI].photos;
                        if (postPhotos !== undefined) {
                            for (let photoI = 0; photoI < postPhotos.length; photoI++) {
                                let imageSrc = postPhotos[photoI].original_size.url;
                                if (self.imageSrcs.indexOf(imageSrc) === -1) {
                                    self.imageSrcs.push(imageSrc);
                                }
                                if (self.imageSrcs.length >= 20) break;
                            }
                            if (self.imageSrcs.length >= 20) break;
                        }
                    }                    
                }
                if (this.imageSrcs.length >= 20) {
                    this.props.dispatch(ActionCreators.loadAssetsPhase());
                } else if (tumblrPosts.length === 20) {
                    let searchBeforeTime = tumblrPosts[19].timestamp
                    self.retrievePosts.call(self, tag, searchBeforeTime);
                } else {
                    // there aren't enough posts to find
                    console.log('sorry, there are not enough posts with that tag');
                    this.props.dispatch(ActionCreators.requestTagPhase());
                }
            });
    }

    loadImages() {
        let images = this.imageSrcs.map((imageSrc, i) => {
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
        const { appPhase } = this.props;
        
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
                return <ImageAnimationHandler imageSrcs={ this.imageSrcs } />;
            default:
                return (<div />);
        }
    }
}