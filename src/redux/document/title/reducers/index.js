/* eslint-disable import/no-anonymous-default-export */
import title from '../actions'
import initialState from '../initialState'

export default function titleReducer (state = initialState, action) {

    switch (action.type) {

        case title.set().type:
            return action.payload ?? state;

        default:
            return state;
    }
}