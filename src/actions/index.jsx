import * as types from '../constants/ActionTypes';
import { getPeaksFromBuffer } from '../helperFunctions';
import superagent from 'superagent';
import jsonp from 'jsonp';

// set phase
function setPhase(phase) {
    return {
        type: types.SET_PHASE,
        payload: { phase }
    }
}

// request tag
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
export function findAssets(tag) {
    return (dispatch) => {
        dispatch(setPhase('findAssets'));

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
                dispatch(setPhase('loadAssets')); // must come after setting
            })
            .catch((reason) => {
                console.log(reason);
                dispatch(setPhase('requestTag'));
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
export function getAndAnalyzeAssets(tracks, imageSrcs) {
    return (dispatch) => {
        const tracksAnalysedPromise = new Promise((resolve, reject) => {
            dispatch(getAudioBuffersAndThresholds(tracks, resolve));
        });

        const imagesFetchedPromise = new Promise((resolve, reject) => {
            dispatch(fetchImages(imageSrcs, resolve));
        });
        
        Promise.all([tracksAnalysedPromise, imagesFetchedPromise])
            .then((values) => {
                dispatch(setTracks(values[0]));
                dispatch(setPhase('playAnimation'));
            })
            .catch((reason) => {
                console.log(reason);
                dispatch(setPhase('requestTag'));
            });
    };
}
function fetchImages(imageSrcs, resolve) {
    return (dispatch) => {
        let fetchedImageCount = 0;
        imageSrcs.forEach((imageSrc) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                dispatch(incrementLoadedImageCount(fetchedImageCount));
                fetchedImageCount++;
                console.log(fetchedImageCount);
                if (fetchedImageCount === 20) resolve();
            };
        });
    };
}
function getAudioBuffersAndThresholds(tracks, tracksAnalysedResolve) {
    return (dispatch) => {
        const AudioContextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
        const audioContext = new AudioContextClass();

        const analysedTracks = [];
        let numOfBuffersFetched = 0;
        tracks.forEach((track) => {
            const request = new XMLHttpRequest();
            request.open('GET', track.preview_url, true)
            request.responseType = 'arraybuffer';
            request.send();
            request.onload = (e) => {
                audioContext.decodeAudioData(request.response, (audioBuffer) => {
                    dispatch(incrementLoadedBuffer(numOfBuffersFetched));
                    numOfBuffersFetched++;

                    const thresholdPromise = new Promise((thresholdResolve, thresholdReject) => {
                        getPeaksFromBuffer(audioBuffer, thresholdResolve);
                    });

                    thresholdPromise.then((audioBufferAndThreshold) => {
                        dispatch(incrementAnalysedTrackCount(analysedTracks.length));
                        // audioBufferAndThreshold is { audioBuffer, threshold }
                        analysedTracks.push({ ...audioBufferAndThreshold, ...track });
                        if (analysedTracks.length === 3) tracksAnalysedResolve(analysedTracks);
                    });
                });
            };
        });
    };
}
export function incrementLoadedBuffer(loadedAudioBufferCount) {
    return {
        type: types.INCREMENT_LOADED_BUFFER_COUNT,
        payload: { loadedAudioBufferCount }
    };
}
function incrementAnalysedTrackCount(analysedTrackCount) {
    return {
        type: types.INCREMENT_ANALYSED_TRACK_COUNT,
        payload: { analysedTrackCount }
    };
}
function incrementLoadedImageCount(loadedImageCount) {
    return {
        type: types.INCREMENT_LOADED_IMAGE_COUNT,
        payload: { loadedImageCount }
    };
}