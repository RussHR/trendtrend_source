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
        const tracksPromise = new Promise((resolve, reject) => {
            superagent.get('https://api.spotify.com/v1/search')
                .query({
                    q: tag,
                    limit: 3,
                    type: 'track'
                })
                .end((err, res) => {
                    const tracks = res.body.tracks.items;
                    if (tracks.length < 3 || err) {
                        reject('sorry, there was an error in getting the track');
                    } else {
                        resolve(tracks);
                    }
                });
        });

        const imagesPromise = new Promise((resolve, reject) => {
            fetchImageSrcs(tag, resolve, reject);
        });

        Promise.all([tracksPromise, imagesPromise])
            .then((values) => {
                dispatch(setTracks(values[0]));
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
function setTracks(tracks) {
    return {
        type: types.SET_TRACKS,
        payload: { tracks }
    };
}
function setImageSrcs(imageSrcs) {
    return {
        type: types.SET_IMAGE_SRCS,
        payload: { imageSrcs }
    };
}

// loading assets
export function getAudioBuffers(audioSrcs) {
    return (dispatch) => {
        const AudioContextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
        const audioContext = new AudioContextClass();

        const audioBufferPromise = new Promise((resolve, reject) => {

            const loadedAudioBuffers = [];
            audioSrcs.forEach((audioSrc) => {
                const request = new XMLHttpRequest();
                request.open('GET', audioSrc, true)
                request.responseType = 'arraybuffer';
                request.send();
                request.onload = (e) => {
                    audioContext.decodeAudioData(request.response, (audioBuffer) => {
                        dispatch(incrementLoadedBuffer(loadedAudioBuffers.length));
                        loadedAudioBuffers.push(audioBuffer);
                        if (loadedAudioBuffers.length === 3) resolve(loadedAudioBuffers);
                    });
                };
            });
        });

        audioBufferPromise.then((loadedAudioBuffers) => {
            dispatch(setAudioBuffers(loadedAudioBuffers));
        });
    };
}
function setAudioBuffers(audioBuffers) {
    return {
        type: types.SET_AUDIO_BUFFERS,
        payload: { audioBuffers }
    };
}
export function incrementLoadedBuffer(loadedAudioBufferCount) {
    return {
        type: types.INCREMENT_LOADED_BUFFER_COUNT,
        payload: { loadedAudioBufferCount }
    };
}

export function imageLoaded(loadedImageCount, history) {
    return (dispatch) => {
        dispatch(incrementLoadedImages(loadedImageCount));
    };
}
function incrementLoadedImages(loadedImageCount) {
    return {
        type: types.INCREMENT_LOADED_IMAGES,
        payload: { loadedImageCount }
    };
}