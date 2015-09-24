import { combineReducers } from 'redux';
import * as types          from '../constants/ActionTypes';

function imageSrcs(state = [], action) {
    switch (action.type) {
        case types.LOAD_ASSETS:
            return action.payload.imageSrcs;
        default:
            return state;
    }
}

function loadedImageCount(state = 0, action) {
    switch (action.type) {
        case types.RESET_IMAGES:
            return 0;
        case types.INCREMENT_LOADED_IMAGES:
            return action.payload.loadedImageCount + 1;
        default:
            return state;
    }
}

const mainReducer = combineReducers({ imageSrcs, loadedImageCount });
export default mainReducer;
