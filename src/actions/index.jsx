import * as types from '../constants/ActionTypes';

export function requestTag() {  
  return {
    type: types.REQUEST_TAG
  };
}

export function findAssets(tag) {  
  return {
    type: types.FIND_ASSETS,
    payload: { tag }
  };
}

export function loadAssets() {  
  return {
    type: types.LOAD_ASSETS
  };
}

export function playAnimation(imageSrcs) {  
  return {
    type: types.PLAY_ANIMATION,
    payload: { imageSrcs }
  };
}