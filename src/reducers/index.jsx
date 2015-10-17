import { combineReducers } from 'redux';
import * as types          from '../constants/ActionTypes';

function imageSrcs(state = [], action) {
    switch (action.type) {
        case types.SET_IMAGE_SRCS:
            return action.payload.imageSrcs;
        case types.CLEAR_IMAGE_SRCS:
            return [];
        default:
            return state;
    }
}

function tracks(state = [], action) {
    switch (action.type) {
        case types.SET_TRACKS:
            return action.payload.tracks;
        default:
            return state;
    }
}

function loadedImageCount(state = 0, action) {
    switch (action.type) {
        case types.RESET_LOADED_IMAGE_COUNT:
            return 0;
        case types.INCREMENT_LOADED_IMAGES:
            return action.payload.loadedImageCount + 1;
        default:
            return state;
    }
}

function audioBuffers(state = [], action) {
    switch (action.type) {
        case types.SET_AUDIO_BUFFERS:
            return action.payload.audioBuffers;
        default:
            return state;
    }
}
function loadedAudioBufferCount(state = 0, action) {
    switch(action.type) {
        case types.INCREMENT_LOADED_BUFFER_COUNT:
            return action.payload.loadedAudioBufferCount + 1;
        default:
            return state;
    }
}

const mainReducer = combineReducers({
    imageSrcs,
    tracks,
    loadedImageCount,
    audioBuffers,
    loadedAudioBufferCount
});
export default mainReducer;
