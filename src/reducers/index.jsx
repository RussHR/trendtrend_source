import { combineReducers } from 'redux';
import * as types          from '../constants/ActionTypes';

export default function appPhase(state = 'request tag', action) {
    switch (action.type) {
        case types.REQUEST_TAG:
            return 'request tag'
        case types.FIND_ASSETS:
            return 'find assets'
        case types.LOAD_ASSETS:
            return 'load assets'
        case types.PLAY_ANIMATION:
            return 'play animation'
        default:
            return state;
    }
}

const mainReducer = combineReducers({ appPhase });
export default mainReducer;
