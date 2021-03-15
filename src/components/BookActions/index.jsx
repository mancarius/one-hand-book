/* eslint-disable import/no-anonymous-default-export */
import React, { useContext } from 'react'
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRounded from '@material-ui/icons/FavoriteRounded';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@material-ui/icons/BookmarkRounded';
import { BookContext } from '../../components/BookContextProvider'
import styles from './styles/index.module.css';

export default React.memo(function (props) {
    const { favorite, toggleFavorite, readLater, toggleReadLater } = useContext(BookContext);

    return <div className={styles.actions}>
        <button onClick={toggleFavorite}>
            {
                favorite ?
                    <><FavoriteRounded />In my Favorites</>
                    :
                    <><FavoriteBorderRoundedIcon />Add to Favorites</>
            }
        </button>
        <button onClick={toggleReadLater}>
            {
                readLater ?
                    <><BookmarkRoundedIcon />Saved</>
                    :
                    <><BookmarkBorderRoundedIcon />Read Later</>
            }
        </button>
    </div>;
});