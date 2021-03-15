/* eslint-disable import/no-anonymous-default-export */
import user from '../actions'
import initialState from '../initialState'

export default function (state = initialState, action) {
    switch (action.type) {
        case user.login().type:
            const { displayName, uid, photoURL, token } = action.payload;
            localStorage.setItem("user", JSON.stringify({ displayName, uid, photoURL, token }));
            return { ...state.user, displayName, uid, photoURL, token };
        case user.logout().type:
            localStorage.removeItem('user');
            return { };
        default:
            return state;
    }
}