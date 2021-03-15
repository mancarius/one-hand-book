import React from 'react'
import {IfFirebaseAuthed} from '@react-firebase/auth'
import BookshelfCarousel from '../../components/BookshelfCrousel'

const HomePage = (props) => {
    const bookshelf = [{},{}]
    return <>
        <IfFirebaseAuthed>
            <BookshelfCarousel key="1" limit='4' {...bookshelf[1]} />
        </IfFirebaseAuthed>
    </>;
}

export default HomePage;