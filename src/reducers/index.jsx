import { combineReducers } from 'redux';
import * as types          from '../constants/ActionTypes';

function appPhase(state = 'request tag', action) {
    switch (action.type) {
        case types.REQUEST_TAG_PHASE:
            return 'request tag'
        case types.FIND_ASSETS_PHASE:
            return 'find assets'
        case types.LOAD_ASSETS_PHASE:
            return 'load assets'
        case types.PLAY_ANIMATION_PHASE:
            return 'play animation'
        default:
            return state;
    }
}

function imageSrcs(state = [], action) {
    switch (action.type) {
        case types.LOAD_ASSETS:
            return action.payload.imageSrcs;
        default:
            return state;
    }
}

const mainReducer = combineReducers({ appPhase, imageSrcs });
export default mainReducer;
