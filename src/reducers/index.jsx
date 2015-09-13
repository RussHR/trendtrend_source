import { combineReducers } from 'redux';
import * as types          from '../constants/ActionTypes';

const initialState = {
    appPhase: 'request tag'
}
export default function appPhase(state = initialState, action) {
    switch (action.type) {
        case types.REQUEST_TAG: 
            return {
                appPhase: 'request tag'
            }
        case types.FIND_ASSETS: 
            return {
                appPhase: 'find assets'
            }
        case types.LOAD_ASSETS: 
            return {
                appPhase: 'load assets'
            }
        case types.PLAY_ANIMATION: 
            return {
                appPhase: 'play animation'
            }
        default:
            return state;
    }
}