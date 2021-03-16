/* eslint-disable import/no-anonymous-default-export */
import React, { createContext } from 'react';
import Loader from '../AppLoading'
export const BookContext = createContext();
// Provider
export default function ({children, ...props}) {

    return (
        <BookContext.Provider value={{ ...props }}>
            { !props.loading ? children : <Loader />}
        </BookContext.Provider>
    );
}