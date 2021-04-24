/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom' 
import { useDispatch } from "react-redux";
import { Rating } from '@material-ui/lab'
import { Paper, List, IconButton } from '@material-ui/core';
import action from '../../redux/actions'
import GoogleBooks from '../../helpers/googleBooksApi'
import BookContextProvider from '../../components/BookContextProvider'
import BookActions from '../../components/BookActions'
import ArrowBackRounded from '@material-ui/icons/ArrowBackRounded';
import UnfoldMoreRoundedIcon from '@material-ui/icons/UnfoldMoreRounded';
import ButtonBack from '../../components/ButtonGoBack'
import BookCover from '../../components/Book/Cover'
import ExploreLink from '../../components/Book/ExploreLink'
import BuyButton from '../../components/Book/BuyButton'
import WebReaderButton from '../../components/Book/WebReaderButton'
import GoToTopButton from '../../components/GoToTopButton'
import styles from './styles/index.module.css';
import useErrorsHandler from '../../helpers/errorsHandler';
import UnfoldLessRoundedIcon from '@material-ui/icons/UnfoldLessRounded';





export default React.memo(() => {
    const location  = useLocation();
    const history = useHistory();
    const volumeID = new URLSearchParams(location.search).get("volumeID");
    const errorsHandler = useErrorsHandler();
    const dispatch = useDispatch();
    const [expandSynopsis, setExpandSynopsis] = useState(false);
    const [volume, setVolume] = useState({});
    const [imageLinks, setImageLinks] = useState({});
    const [loading, setLoading] = useState(true);
    const [coverZoom, setCoverZoom] = useState(true);



    const fetchVolume = React.useCallback(() => {
        GoogleBooks.getVolume(volumeID)
            .catch(error => {
                errorsHandler(error);
            })
            .then(res => {
                console.log(res);
                setVolume(res);
            });
    }, [volumeID]);


    const toggleSynopsis = () => {
        setExpandSynopsis(prev => !prev);
    }



    const toggleCoverZoom = () => {
        console.log('toggle');
        setCoverZoom(prev => !prev);
    }
    

    useEffect(() => {
        // if not receive a valid volumeID
        (volumeID === 'undefined' || volumeID.lenght === 0) && history.push('/');
        // else
        // set page header
        dispatch(action.document.title.set(null));
        dispatch(action.document.header.set.title(null));
        // then
        // connect to api
        fetchVolume();
        
        return () => {
        }
    }, []);

    useEffect(() => {
        let imgs = volume?.volumeInfo?.imageLinks ?? {};
        let title = volume?.volumeInfo?.title ?? null;

        dispatch(action.document.title.set(title));

        setImageLinks(imgs);

    }, [volume]);

    useEffect(() => {
        !loading && toggleCoverZoom();
    }, [loading])

    
    return (<article className={styles.book_container}>
        {/* work around for image load event */}
        <img style={{display: 'none'}} alt="" src={imageLinks.thumbnail} onLoad={() => setLoading(false)} />
        <BookContextProvider
            volume={volume}
            loading={loading}
        >
            <UserActions>
                <ButtonBack title='Go back'>
                    <ArrowBackRounded style={{ color: 'inherit', textShadow: 'inherit' }} />
                </ButtonBack>
                <BookActions.FavoriteButton />
                <BookActions.ToReadButton />
                <GoToTopButton />
            </UserActions>
            <BookCover className={styles.cover + (coverZoom ? ' ' + styles.zoom : '')} imageLinks={imageLinks} title="Frontcover" />
            <div className={styles.info}>
                <h1 className={styles.title}>{volume?.volumeInfo?.title}</h1>
                <h3 className={styles.author}>{volume?.volumeInfo?.authors?.join(', ')}</h3>
                <div className={styles.publisher}>{volume?.volumeInfo?.publisher}</div>
                <div className={styles.review}>
                    <Rating name="read-only" value={volume?.volumeInfo?.averageRating ?? 0} precision={0.5} readOnly size='small' />
                    <span> (<span className="count">{volume?.volumeInfo?.ratingsCount ?? '0'}</span>)</span>
                </div>
            </div>
            <div className={styles.actionsContainer}>
                <BuyButton ebook />
                <WebReaderButton variant="outlined" />
            </div>
            {
                volume.volumeInfo?.description &&
                <Paper elevation={0} className={styles.card +' '+styles.synopsis}>
                    <h2>Description</h2>
                    <p className={styles['synopsis-window']} style={expandSynopsis ? { maxHeight: '1000vh' } : {}}>{volume?.volumeInfo?.description?.replace(/<(.|\n)*?>/g, '') ?? ''}</p>
                    <div className={styles.buttonContainer} style={expandSynopsis ? { paddingTop: 0, marginTop: 0 } : {}}>
                        <IconButton
                            aria-label={expandSynopsis ? 'Read less' : 'Read more'}
                            onClick={toggleSynopsis}
                        >
                            {
                                expandSynopsis ?
                                    <UnfoldLessRoundedIcon fontSize="inherit"/>
                                    :
                                    <UnfoldMoreRoundedIcon fontSize="inherit"/>
                            }
                        </IconButton>
                    </div>
                </Paper>
            }            
            <Paper elevation={0} className={styles.card +' '+styles.bibliography}>
                <h2>Bibliography</h2>
                <dl>
                    <dt>Title</dt>
                    <dd>{ volume?.volumeInfo?.title }</dd>
                    <dt>Genre</dt>
                    <dd>{ volume?.volumeInfo?.mainCategory ?? volume?.volumeInfo?.categories?.join(' - ') ?? 'General' }</dd>
                    <dt>Authors</dt>
                    <dd>{ volume?.volumeInfo?.authors?.join(', ') }</dd>
                    <dt>Publisher</dt>
                    <dd>{volume?.volumeInfo?.publisher}, { volume?.volumeInfo?.publishedDate?.split('-')[0] }</dd>
                    <dt>ISBN</dt>
                    <dd>{ volume?.volumeInfo?.industryIdentifiers?.map(i => i.identifier).join(', ') }</dd>
                    <dt>Lenght</dt>
                    <dd>{ volume?.volumeInfo?.pageCount } pages</dd>
                </dl>
            </Paper>
            <Paper elevation={0} className={styles.card +' '+styles.explore}>
                <h2>Related</h2>
                <List component="nav">
                    {
                        volume?.volumeInfo?.authors?.map((author, index) => <ExploreLink key={index} item={author} folder="inauthor" secondary="Author">More by </ExploreLink>)
                    }
                    <ExploreLink item={volume?.volumeInfo?.publisher} folder="inpublisher" secondary="Publisher">More by </ExploreLink>
                </List>
            </Paper>
        </BookContextProvider>
    </article>);
});






const UserActions = ({ children, ...props }) => {
    console.log('children', children);
    return (
        <div className={styles.userActionsContainer}>
            {children}
        </div>
    );
}