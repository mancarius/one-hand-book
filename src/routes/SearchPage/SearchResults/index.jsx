import React from 'react';
import styles from './styles/index.module.css'
import BookPreview from '../../../components/BookPreview';

const tileData = [{
    img: '',
    title: 'This is a very long title',
    author: 'author',
},{
    img: '',
    title: 'Image',
    author: 'author',
},{
    img: '',
    title: 'Image',
    author: 'author',
},{
    img: '',
    title: 'Image',
    author: 'author',
},{
    img: '',
    title: 'Image',
    author: 'author',
}]

export default function SearchResults() {

  return (
    <ul className={styles.grid}>
        {tileData.map((book) => (
          <BookPreview key={book.id} {...book} onClick={()=>{console.log('click on the book')}} />
        ))}
    </ul>
  );
}