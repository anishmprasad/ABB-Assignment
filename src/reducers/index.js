import { combineReducers } from 'redux';
import Temp from './Temp'
import Helloworld from "./HelloWorld";

const rootReducer = combineReducers({
    Temp,
    Helloworld
});

export default rootReducer;
