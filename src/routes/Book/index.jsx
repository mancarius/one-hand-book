/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom' 
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from 'notistack';
import { Rating } from '@material-ui/lab'
import parseHTML from 'html-react-parser'
import GoogleBooks from '../../helpers/googleBooksApi'
import BookContextProvider from '../../components/BookContextProvider'
import BookActions from '../../components/BookActions'
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import ButtonBack from '../../components/ButtonGoBack'
import styles from './styles/index.module.css';


export default React.memo(props => {
    const { volumeID } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const user = useSelector(state => state.user);
    const [expandSynopsis, setExpandSynopsis] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [readLater, setReadLater] = useState(false);
    const [volume, setVolume] = useState({});
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const toggleAction = (type) => {
        if ('token' in user) {
            if(type === 'favorite')
                setFavorite(prev => !prev);
            else if (type === 'toRead')
                setReadLater(prev => !prev);
        }
        else
        {
            enqueueSnackbar('Sign in to add this book to your favorites');
        }
    }

    const toggleSynopsis = () => {
        setExpandSynopsis(prev => !prev);
    }
    
    useEffect(() => {
        // if not receive a valid volumeID
        (volumeID === 'undefined' || volumeID.lenght === 0) && history.push('/');
        // else
        GoogleBooks.getVolume(volumeID)
            .catch(error => {
                
            })
            .then(res => {
                console.log(res);
                setVolume({ ...res.volumeInfo, sale: res.saleInfo });
            });
        // cancel pending request on component unmount
        return () => GoogleBooks.abort();
    }, []);

    useEffect(() => {
        let img = volume?.imageLinks?.large
            ?? volume?.imageLinks?.medium
            ?? volume?.imageLinks?.small
            ?? volume?.imageLinks?.thumbnail
            ?? '';
        if (img !== '') {
            setImage(img);
        }

        setFavorite(volume.isFavorite);
        setReadLater(volume.toRead);
    }, [volume]);

    
    return (<>
        <ButtonBack classes={styles.btnBack} title='Go back'><CancelRoundedIcon style={{color: 'inherit', textShadow: 'inherit'}}/></ButtonBack>
        {/* work around per image load event */}
        <img style={{display: 'none'}} src={image} onLoad={() => setLoading(false)} />
        <BookContextProvider
            volume={volume}
            favorite={favorite}
            toggleAction={toggleAction}
            readLater={readLater}
            loading={loading}
        >
            <img className={ styles.cover } src={image} alt="Frontcover" />
            <div className={styles.info}>
                <h1 className={styles.title}>{volume?.title}</h1>
                <h3 className={styles.author}>{volume?.authors?.join(', ')}</h3>
                <div className={styles.publishing}><div className={styles.publisher}>{volume?.publisher}</div><div className={styles['published-date']}>({volume?.publishedDate?.split('-')[0]})</div></div>
                <div className={styles.review}>
                    <Rating name="read-only" value={volume?.averageRating ?? 0} precision={0.5} readOnly size='small' />
                    <span> (<span className="count">{volume?.ratingsCount}</span> reviews)</span>
                </div>
                <BookActions style={{margin: '2rem 0'}} />
                <div className={styles.synopsis}>
                    <p className={styles['synopsis-window']} style={expandSynopsis ? { maxHeight: '1000vh' } : {}}>{ parseHTML(volume?.description ?? '')}</p>
                    <button onClick={toggleSynopsis}>{expandSynopsis ? 'Less...' : 'More...'}</button>
                </div>
            </div>
            <div className={styles.bibliography}>
                <h2>Bibliography</h2>
                <dl>
                    <dt>Title</dt>
                    <dd>{ volume?.title }</dd>
                    <dt>Genre</dt>
                    <dd>{ volume?.mainCategory ?? volume?.categories?.join() ?? 'General' }</dd>
                    <dt>Authors</dt>
                    <dd>{ volume?.authors?.join(', ') }</dd>
                    <dt>Publisher</dt>
                    <dd>{volume?.publisher}, { volume?.publishedDate?.split('-')[0] }</dd>
                    <dt>ISBN</dt>
                    <dd>{ volume?.industryIdentifiers?.map(i => i.identifier).join(', ') }</dd>
                    <dt>Lenght</dt>
                    <dd>{ volume?.pageCount } pages</dd>
                </dl>
            </div>
        </BookContextProvider>
    </>);
});