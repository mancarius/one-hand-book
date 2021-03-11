import React from 'react';
import styles from './styles/index.module.css'
import GoogleBooksSearchField from './GoogleBooksSearchField'
import SearchResults from './SearchResults';


export default function SearchPage() {
    return <>
        <div className={styles['search-filed-container']}><GoogleBooksSearchField /></div>
        <h3 className={styles.title}>Search results:</h3>
        <SearchResults/>
    </>;
}