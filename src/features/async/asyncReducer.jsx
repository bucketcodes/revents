import { createReducer } from '../../app/common/util/reducerUtil'
import { ASYNC_ACTION_ERROR, ASYNC_ACTION_START, ASYNC_ACTION_FINISH } from './asyncConstants'

const initialState = {
    loading: false
}

export const asyncActionStarted = (state) => {
    return {...state, loading: true}
}

export const asyncActionFinished = (state) => {
    return {...state, loading: false}
}

export const asyncActionERROR = (state) => {
    return {...state, loading: false}
}

export default createReducer(initialState, {
    [ASYNC_ACTION_START]: asyncActionStarted,
    [ASYNC_ACTION_ERROR]: asyncActionERROR,
    [ASYNC_ACTION_FINISH]: asyncActionFinished
})