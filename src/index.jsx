import React           from 'react';
import superagent      from 'superagent';
import superagentJSONP from 'superagent-jsonp';
superagentJSONP(superagent);

class TrendtrendApp extends React.Component {

    state ={
        imageSrcs: []
    };

    searchByTag(e) {
        e.preventDefault();
        let tag = React.findDOMNode(this.refs.tag).value.trim();
        if (tag) this.retrievePosts(tag);
    }

    retrievePosts(tag) {
        let self = this;
        superagent.get('https://api.tumblr.com/v2/tagged')
            .query({
                tag: tag,
                api_key: 'srSUAuHBEN6yZPG4p8N8LaYD8lp5vGIS9mBYOVnx8bA7xa6mpz' 
            })
            .jsonp()
            .end((err, res) => {
                let imageSrcs = [];
                let tumblrPosts = res.body.response;
                for (let postI = 0; postI < tumblrPosts.length; postI++) {
                    let postPhotos = tumblrPosts[postI].photos;
                    if (postPhotos !== undefined) {
                        for (let photoI = 0; photoI < postPhotos.length; photoI++) {
                            imageSrcs.push(postPhotos[photoI].original_size.url);
                            if (imageSrcs.length >= 20) break;
                        }
                        if (imageSrcs.length >= 20) break;
                    }
                }
                self.setState({ imageSrcs: imageSrcs });
            });
    }

    loadImages() {
        let images = this.state.imageSrcs.map((imageSrc) => {
            return (
                <img src={imageSrc} onLoad={ () => {console.log('loaded')} } />
            );
        });
        return images;
    }

    render() {
        let images = this.state.imageSrcs.length > 0 ? this.loadImages() : null;
        return (
            <div>
                <form className="commentForm" onSubmit={ ::this.searchByTag }>
                    <input type="text" placeholder="Tag to search" ref="tag" />
                    <input type="submit" value="Search Posts" />
                </form>
                { images }
            </div>
        );
    }
}
 
React.render(<TrendtrendApp />, document.getElementById('content'));