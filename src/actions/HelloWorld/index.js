import {
  INITIALACTION,
  SELECTED,
  MATRIXUPDATE,
  MATRIXINITIALACTION,
  MATRIXSELECTED,
  SELECTEDDIAMENTIONALUPDATE
} from "../../actionTypes/HelloWorld";
import { getObjects } from '../../shared/sharedHelper'
// type and payload actions
export const createActionWithTypeAndPayload = (type, payload, meta, error) => ({ type, payload, meta, error });

export function initialAction(action) {
  const selected = getObjects(action, "selected", true)[0]
  return function (dispatch, getState) {
    dispatch( createActionWithTypeAndPayload(SELECTED, selected));
    dispatch( createActionWithTypeAndPayload(INITIALACTION, action));

  };
}

export function matrixAction(action) {
  // debugger
  // const selected = getObjects(action, "selected", true)[0]
  return function (dispatch, getState) {
    dispatch(createActionWithTypeAndPayload(MATRIXSELECTED, Object.keys(action)[3] ));
    dispatch(createActionWithTypeAndPayload(MATRIXINITIALACTION, action));

  };
}

export function matrixUpdate(oldBox , selectedBox) {
  const selected = {
    id: selectedBox,
    selected : true
  } 
  return function (dispatch, getState) {
    dispatch(createActionWithTypeAndPayload(MATRIXUPDATE ,selectedBox, oldBox));
    dispatch(createActionWithTypeAndPayload(SELECTED, selected));
    
  };
}


export function selectedDiamentionalUpdate(selectedBox) {
  return function (dispatch, getState) {
    dispatch(createActionWithTypeAndPayload(SELECTEDDIAMENTIONALUPDATE, selectedBox));

  };
}