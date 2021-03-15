/* eslint-disable no-unused-vars */
import React from 'react'
import { useParams } from 'react-router-dom' 
import PreviewsContainer from '../../components/BookPreviewsContainer'
import BookPreview from '../../components/BookPreview'

function Bookshelf(props) {
    const bookshelf = [];
    const { bookshelfID } = useParams();

    return <>
        <PreviewsContainer>
            {bookshelf.map(book => <BookPreview {...book} />)}
        </PreviewsContainer>
    </>
}

export default Bookshelf