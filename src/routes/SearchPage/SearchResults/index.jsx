import React from 'react';
import styles from './styles/index.module.css'
import BookPreview from '../../../components/BookPreview';
import PreviewsContainer from '../../../components/BookPreviewsContainer';

const tileData = [{
    id: 1,
    img: '',
    title: 'This is a very long title',
    author: 'author',
}, {
    id: 2,
    img: '',
    title: 'Image',
    author: 'author',
  }, {
    id: 3,
    img: '',
    title: 'Image',
    author: 'author',
  }, {
    id: 4,
    img: '',
    title: 'Image',
    author: 'author',
  }, {
    id: 5,
    img: '',
    title: 'Image',
    author: 'author',
}]

export default function SearchResults() {

  return (
    <PreviewsContainer>
        {tileData.map((book) => (
          <BookPreview key={book.id} {...book}  />
        ))}
    </PreviewsContainer>
  );
}