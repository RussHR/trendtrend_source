import * as types from '../constants/ActionTypes';

export function requestTag() {  
  return {
    type: types.REQUEST_TAG
  };
}

export function findAssets() {  
  return {
    type: types.FIND_ASSETS
  };
}

export function loadAssets() {  
  return {
    type: types.LOAD_ASSETS
  };
}

export function playAnimation() {  
  return {
    type: types.PLAY_ANIMATION
  };
}