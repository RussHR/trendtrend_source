import * as types      from '../constants/ActionTypes';
import superagent      from 'superagent';
import superagentJSONP from 'superagent-jsonp';
superagentJSONP(superagent);

// finding assets
export function goToFindAssets(tag, history) {
    return (dispatch) => {
        history.pushState(null, `/find-assets/${ tag }`);
    };
}
export function retrievePosts(tag, history, beforeTime = (Date.parse(new Date())/1000), prevImageSrcs = []) {
    return (dispatch) => {
        let imageSrcs = prevImageSrcs;
        superagent.get('https://api.tumblr.com/v2/tagged')
            .query({
                tag: tag,
                before: beforeTime,
                api_key: 'srSUAuHBEN6yZPG4p8N8LaYD8lp5vGIS9mBYOVnx8bA7xa6mpz' 
            })
            .jsonp()
            .end((err, res) => {
                const tumblrPosts = res.body.response;
                if (tumblrPosts.errors || err) {
                    // there was an error such as a tag not being supplied
                    console.log('sorry, there was an error!');
                    return history.pushState(null, '/');
                }
                
                for (let postI = 0; postI < tumblrPosts.length; postI++) {
                    let postPhotos = tumblrPosts[postI].photos;
                    if (postPhotos !== undefined) {
                        for (let photoI = 0; photoI < postPhotos.length; photoI++) {
                            let imageSrc = postPhotos[photoI].original_size.url;
                            if (imageSrcs.indexOf(imageSrc) === -1) {
                                imageSrcs.push(imageSrc);
                            }
                            if (imageSrcs.length >= 20) break;
                        }
                        if (imageSrcs.length >= 20) break;
                    }
                }                    
                if (imageSrcs.length >= 20) {
                    dispatch(loadAssets(imageSrcs));
                    return history.pushState(null, '/load-assets'); // must come after loadAssets
                } else if (tumblrPosts.length === 20) {
                    const searchBeforeTime = tumblrPosts[19].timestamp;
                    return dispatch(retrievePosts(tag, history, searchBeforeTime, imageSrcs));
                } else {
                    // there aren't enough posts to find
                    console.log('sorry, there are not enough posts with that tag');
                    return history.pushState(null, '/');
                }
            });
    }
}

// loading assets
function loadAssets(imageSrcs) {
    return {
        type: types.LOAD_ASSETS,
        payload: { imageSrcs }
    }
}
export function imageLoaded(loadedImageCount, history) {
    return (dispatch) => {
        console.log(loadedImageCount);
        if (loadedImageCount === 19) {
            history.pushState(null, '/play-animation');
        } else {
            dispatch(incrementLoadedImages(loadedImageCount));
        }
    }
}
function incrementLoadedImages(loadedImageCount) {
    return {
        type: types.INCREMENT_LOADED_IMAGES,
        payload: { loadedImageCount }
    }
}