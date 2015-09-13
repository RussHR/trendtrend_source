import * as types from '../constants/ActionTypes';

// app phase
export function requestTagPhase() {  
    return {
        type: types.REQUEST_TAG
    };
}
function findAssetsPhase() {  
    return {
        type: types.FIND_ASSETS
    };
}
export function loadAssetsPhase() {  
    return {
        type: types.LOAD_ASSETS
    };
}
export function playAnimationPhase() {  
    return {
        type: types.PLAY_ANIMATION
    };
}

// finding assets
export function findAssets() {
    return (dispatch) => {
        dispatch(findAssetsPhase());
        setTimeout(() => {
            // Yay! Can invoke sync or async actions with `dispatch`
            console.log('yay');
        }, 1000);
    };
}