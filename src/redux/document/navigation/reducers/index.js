/* eslint-disable import/no-anonymous-default-export */
import nav from '../actions'
import initialState from '../initialState'

export default function (state = initialState, action) {

    switch (action.type) {
        case nav.show().type:
            return { ...state, display: true };

        case nav.hide().type:
            return { ...state, display: false };
        
        case nav.set.activeItem().type:
            return { ...state, title: action.payload };
        
        default:
            return state;
    }

}