/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom' 
import { useDispatch, useSelector } from 'react-redux';
import action from '../../redux/actions';
import Bookshelf from '../../components/Bookshelf'
import gapi from '../../helpers/googleBooksApi'
import useErrorsHandler from '../../helpers/errorsHandler'
import EmptyShelfLarge from '../../components/Bookshelf/EmptyLarge'
import { CarouselHeader } from '../../components/Carousel/Header'
import BookPreview from '../../components/BookPreview'
import styles from './styles/index.module.css'
import _ from 'lodash'
import BookshelfIcon from '../../components/Bookshelf/BookshelfIcon';
import Chip from '@material-ui/core/Chip';


const UserAuthError = (() => {
  return class extends Error {
    constructor(mess) {
      super(mess);
      this.name = "UNAUTHENTICATED";
    }
  };
})();


export default React.memo(function (props) {
    const { bookshelfID } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const [shelves, setShelves] = useState([]);
    const errorHandler = useErrorsHandler();
    const isSubscribed = useRef(false);
    const [loading, setLoading] = useState(true);
    const [shelfTitle, setShelfTitle] = useState('Bookshelf');
    const user = useSelector(state => state.user);


    useEffect(() => {
        try {
            isSubscribed.current = true;
            if (!user.uid) throw new UserAuthError();
            // set page header
            dispatch(action.document.header.set.title("Bookshelves"));
            dispatch(action.document.title.set("Bookshelves"));
            dispatch(action.document.nav.set.activeItem('bookshelves'));
            // load shelves list
            gapi.getMyBookshelves()
                .then(res => {
                    if (isSubscribed.current) {
                        setShelves(res.items?.filter(o => o.volumeCount > 0));
                    }
                })
                .catch(err => {
                    if (isSubscribed.current) {
                        throw err;
                    }
                })
                .finally(() => {
                    isSubscribed.current && setLoading(false);
                });
        } catch (e) {
            errorHandler(e);
        }
        
        return () => {
            isSubscribed.current = false;
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        // if isset shelf id, look for title
        if (bookshelfID >= 0) {
            const [shelf] = shelves.filter(o => o.id === Number(bookshelfID));
            const title = shelf?.title;
            title && setShelfTitle(title);
            title && dispatch(action.document.title.set(title));
            title && dispatch(action.document.header.set.title(title));
        }
        else {
            dispatch(action.document.header.set.title("Bookshelves"));
            dispatch(action.document.title.set("Bookshelves"));
            dispatch(action.document.nav.set.activeItem('bookshelves'));
        }
    }, [shelves, bookshelfID]);


    useEffect(() => {
        loading
            ?
            dispatch(action.document.loading.start())
            :
            dispatch(action.document.loading.stop())
    }, [loading]);


    return (
        <>{
            loading
                ?
                <></>
                :
                bookshelfID
                    ?
                    <Bookshelf grid large shelfID={bookshelfID} maxResults={40} fallback={<EmptyShelfLarge />} component={<BookPreview column />} />
                    :
                    <div className={styles.grid_container}>
                        {
                            shelves.map(shelf => {
                                const href = `/my-bookshelves/${shelf.id}/${_.kebabCase(shelf.title)}`;
                                return (
                                    <div className={styles.carousel_container} key={shelf.id}>
                                        <CarouselHeader
                                            title={shelf.title}
                                            onClick={() => {
                                                history.push(href);
                                            }}
                                            href
                                            primaryIcon={<BookshelfIcon shelfId={shelf.id} />}
                                            secondaryIcon={<Chip label={shelf.volumeCount} size="small" />}
                                        />
                                    </div>
                                );
                            })
                        }
                    </div>
        }</>
    )
});