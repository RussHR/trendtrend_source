import * as types      from '../constants/ActionTypes';
import superagent      from 'superagent';
import superagentJSONP from 'superagent-jsonp';
superagentJSONP(superagent);

// app phase
export function requestTagPhase() {  
    return { type: types.REQUEST_TAG_PHASE };
}
function findAssetsPhase() {  
    return { type: types.FIND_ASSETS_PHASE };
}
export function loadAssetsPhase() {  
    return { type: types.LOAD_ASSETS_PHASE };
}
export function playAnimationPhase() {  
    return { type: types.PLAY_ANIMATION_PHASE };
}

// finding assets
export function findAssets(tag) {
    return (dispatch) => {
        dispatch(findAssetsPhase());
        dispatch(retrievePosts(tag));
    };
}
function retrievePosts(tag, beforeTime = (Date.parse(new Date())/1000), prevImageSrcs = []) {
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
                    return dispatch(requestTagPhase());
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
                    return dispatch(loadAssetsPhase()); // must come after loadAssets
                } else if (tumblrPosts.length === 20) {
                    const searchBeforeTime = tumblrPosts[19].timestamp;
                    return dispatch(retrievePosts(tag, searchBeforeTime, imageSrcs));
                } else {
                    // there aren't enough posts to find
                    console.log('sorry, there are not enough posts with that tag');
                    return dispatch(requestTagPhase());
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