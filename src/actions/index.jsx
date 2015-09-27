import * as types      from '../constants/ActionTypes';
import superagent      from 'superagent';
import jsonp           from 'jsonp';

// request tag
export function goToRequestTag(history) {
    return (dispatch) => {
        history.pushState(null, '/');
    };
}
export function resetImages() {
    return {
        type: types.RESET_IMAGES
    }
}

// finding assets
export function goToFindAssets(tag, history) {
    return (dispatch) => {
        history.pushState(null, `/find-assets/${ tag }`);
    };
}
export function findAssets(tag, history) {
    return (dispatch) => {
        dispatch(retrievePosts(tag, history));
        dispatch(retrieveTrack(tag));
    }
}
function retrievePosts(tag, history, beforeTime = (Date.parse(new Date())/1000), prevImageSrcs = []) {
    return (dispatch) => {
        const imageSrcs = prevImageSrcs;
        jsonp(`https://api.tumblr.com/v2/tagged?api_key=srSUAuHBEN6yZPG4p8N8LaYD8lp5vGIS9mBYOVnx8bA7xa6mpz&tag=${ tag }&before=${ beforeTime }`, 
            (err, data) => {
                const tumblrPosts = data.response;
                if (err || tumblrPosts.length < 20) {
                    // there was an error such as a tag not being supplied
                    console.log('sorry, there was an error!');
                    return dispatch(goToRequestTag(history));
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
                    return dispatch(goToLoadAssets(history)); // must come after loadAssets
                } else if (tumblrPosts.length === 20) {
                    const searchBeforeTime = tumblrPosts[19].timestamp;
                    return dispatch(retrievePosts(tag, history, searchBeforeTime, imageSrcs));
                } else {
                    // there aren't enough posts to find
                    console.log('sorry, there are not enough posts with that tag');
                    return dispatch(goToRequestTag(history));
                }
            }
        );
    }
}
function retrieveTrack(searchString) {
    return (dispatch) => {
        superagent.get('https://api.soundcloud.com/tracks')
            .query({
                client_id: '38dc81e57f5a4f5c7dc26fc5e5315b1e',
                q: searchString
            })
            .end((err, res) => {
                console.log(res);
            });
    }
}

// loading assets
function goToLoadAssets(history) {
    return (dispatch) => {
        history.pushState(null, '/load-assets');
    };
}
function loadAssets(imageSrcs) {
    return {
        type: types.LOAD_ASSETS,
        payload: { imageSrcs }
    }
}
export function imageLoaded(loadedImageCount, history) {
    return (dispatch) => {
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