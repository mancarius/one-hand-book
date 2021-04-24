/* eslint-disable import/no-anonymous-default-export */
import loading from '../actions'
import initialState from '../initialState'

export default function (state = initialState, action) {
    switch (action.type) {
        case loading.start().type:
            return true;
        case loading.stop().type:
            return false;
        default:
            return state;
    }
}