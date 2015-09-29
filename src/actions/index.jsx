import * as types      from '../constants/ActionTypes';
import superagent      from 'superagent';
import jsonp           from 'jsonp';

// request tag
export function goToRequestTag(history) {
    return (dispatch) => {
        history.pushState(null, '/');
    };
}
export function clearAssets() {
    return (dispatch) => {
        dispatch(clearImageSrcs());
        dispatch(resetLoadedImageCount());
    }
}
function clearImageSrcs() {
    return {
        type: types.CLEAR_IMAGE_SRCS
    }
}
function resetLoadedImageCount() {
    return {
        type: types.RESET_LOADED_IMAGE_COUNT
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
        const trackPromise = new Promise((resolve, reject) => {
            superagent.get('https://api.soundcloud.com/tracks')
                .query({
                    q: tag,
                    client_id: '38dc81e57f5a4f5c7dc26fc5e5315b1e',
                    limit: 1,
                    filter: 'public'
                })
                .end((err, res) => {
                    if (res.body.length === 0 || err) {
                        reject('sorry, there was an error in getting the track');
                    } else {
                        resolve(res.body[0]);
                    }
                });
        });

        const imagesPromise = new Promise((resolve, reject) => {
            fetchImageSrcs(tag, resolve, reject);
        });

        Promise.all([trackPromise, imagesPromise])
            .then((values) => {
                dispatch(setTrack(values[0]));
                dispatch(setImageSrcs(values[1]));
                dispatch(goToLoadAssets(history)); // must come after setting
            })
            .catch((reason) => {
                console.log(reason);
            });
    }
}
function fetchImageSrcs(tag, resolve, reject, beforeTime = (Date.parse(new Date())/1000), prevImageSrcs = []) {
    const imageSrcs = prevImageSrcs;
    jsonp(`https://api.tumblr.com/v2/tagged?api_key=srSUAuHBEN6yZPG4p8N8LaYD8lp5vGIS9mBYOVnx8bA7xa6mpz&tag=${ tag }&before=${ beforeTime }`, 
        (err, data) => {
            const tumblrPosts = data.response;
            if (err || tumblrPosts.length < 20) {
                // there was an error such as a tag not being supplied
                reject('sorry, there was an error!');
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
                resolve(imageSrcs);
            } else if (tumblrPosts.length === 20) {
                const searchBeforeTime = tumblrPosts[19].timestamp;
                return fetchImageSrcs(tag, resolve, reject, searchBeforeTime, imageSrcs);
            } else {
                reject('sorry, there are not enough posts with that tag');
            }
        }
    );
}

// setting assets and navigating to load assets
function goToLoadAssets(history) {
    return (dispatch) => {
        history.pushState(null, '/load-assets');
    };
}
function setTrack(track) {
    return {
        type: types.SET_TRACK,
        payload: { track }
    }
}
function setImageSrcs(imageSrcs) {
    return {
        type: types.SET_IMAGE_SRCS,
        payload: { imageSrcs }
    }
}

// loading assets
export function imageLoaded(loadedImageCount, history) {
    return (dispatch) => {
        if (loadedImageCount === 19) {
            // history.pushState(null, '/play-animation');
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