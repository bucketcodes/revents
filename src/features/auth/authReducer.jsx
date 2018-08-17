import { LOGIN_USER, SIGNOUT_USER } from './authConstants'
import { createReducer } from '../../app/common/util/reducerUtil'

const inititalState = {
    currentUser: {}
}

export const loginUser = (state, payload) => {
    return {
        ...state, 
        authenticated: true,
        currentUser: payload.creds.email
    }
}

export const signOutUser = (state, payload) => {
    return {
        ...state,
        authenticated: false,
        currentUser: {}
    }
}

export default createReducer(inititalState, {
    [LOGIN_USER]: loginUser,
    [SIGNOUT_USER]: signOutUser
})