/* eslint-disable import/no-anonymous-default-export */
import React, { useState, createContext, useEffect } from 'react';
export const BookContext = createContext();
// Provider
export default function(props) {
    const [favorite, setFavorite] = useState(false);
    const [readLater, setReadLater] = useState(false);

    const toggleFavorite = () => {
        setFavorite(prev => !prev);
    }

    const toggleReadLater = () => {
        setReadLater(prev => !prev);
    }
    
    useEffect(() => {
        //qui dentro faccio partire chiamata per 
    }, [])

    return (
        <BookContext.Provider value={{ favorite, toggleFavorite, readLater, toggleReadLater }}>
            {props.children}
        </BookContext.Provider>
    );
}