import React           from 'react';
import superagent      from 'superagent';
import superagentJSONP from 'superagent-jsonp';
superagentJSONP(superagent);

class TrendtrendApp extends React.Component {

    state ={
        currentPhase: 'askingForTag',
    };
    imageSrcs = [];
    loadedImageCount = 0;

    searchByTag(e) {
        e.preventDefault();
        let tag = React.findDOMNode(this.refs.tag).value.trim();
        if (tag) this.retrievePosts(tag);
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
                    self.setState({ currentPhase: 'askingForTag' });
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
                    self.setState({ currentPhase: 'fetchingImages' });                    
                } else if (tumblrPosts.length === 20) {
                    let searchBeforeTime = tumblrPosts[19].timestamp
                    self.retrievePosts.call(self, tag, searchBeforeTime);
                } else {
                    // there aren't enough posts to find
                    console.log('sorry, there are not enough posts with that tag');
                    self.setState({ currentPhase: 'askingForTag' });  
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
        return images;
    }

    showImages() {
        let images = this.imageSrcs.map((imageSrc, i) => {
            return (
                <img 
                src={ imageSrc } 
                key={ i } />
            );
        });
        return images;
    }

    incrementLoadedImageCount() {
        this.loadedImageCount += 1;
        console.log(this.loadedImageCount);
        if (this.loadedImageCount >= 20) {
            this.setState({ currentPhase: 'showingImages' });
        }
    }

    phaseToHtml() {
        switch (this.state.currentPhase) {
            case 'askingForTag':
                return (
                    <form onSubmit={ ::this.searchByTag }>
                        <input type="text" placeholder="Tag to search" ref="tag" />
                        <input type="submit" value="Search Posts" />
                    </form>
                );
            case 'fetchingImages':
                return this.loadImages();
            case 'showingImages':
                return this.showImages();
            default:
                return (<div />);

        }
    }

    render() {
        let htmlContent = this.phaseToHtml();
        return (
            <div>
                { htmlContent }
            </div>
        );
    }
}
 
React.render(<TrendtrendApp />, document.getElementById('content'));