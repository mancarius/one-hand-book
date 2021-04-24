import React from 'react';
import Bookshelf from '../'
import styles from './styles/index.module.css'
import Cover from '../../Book/Cover'


const BookshelfIcon = React.memo(({ shelfId }) => {

    return <div className={styles.icon}>
        <div className={styles.images_container}>
            <Bookshelf
                shelfID={shelfId}
                carousel
                fade
                autoplay
                infinite
                maxResults={10}
                component={<Cover className={styles.image} />}
            />
        </div>
    </div>
});


export default BookshelfIcon;