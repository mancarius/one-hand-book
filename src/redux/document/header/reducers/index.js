/* eslint-disable import/no-anonymous-default-export */
import header from '../actions'
import initialState from '../initialState'

export default function (state = initialState, action) {

    switch (action.type) {
        case header.show().type:
            return {
                ...state,
                display: true
            };

        case header.hide().type:
            return {
                ...state,
                display: false
            };
        
        case header.set.title().type:
            return {
                ...state,
                title: action.payload
            };
        
        case header.set.documentTitle().type:
            return {
                ...state,
                documentTitle: action.payload
            };
        
        default:
            return state;
    }
}