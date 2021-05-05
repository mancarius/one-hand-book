import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import action from '../../redux/actions';
import useErrorsHandler from '../../helpers/errorsHandler'
import gapi from '../../helpers/googleBooksApi'
import PreviewsContainer from '../BookPreviewsContainer'
import styles from './styles/index.module.css'
import RenderCarousel from '../Carousel/Render';
import CircularProgress from "@material-ui/core/CircularProgress";



const Bookshelf = (props) => {
    const { component = <></>, carousel, grid, fallback } = props;
    const errorsHandler = useErrorsHandler();
    let isSubscribed = useRef(false);
    const options = useRef({
        maxResults: props.maxResults || 10,
        startIndex: props.startIndex || 0
    });
    const [volumes, setVolumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    
    
    useEffect(() => {
        isSubscribed.current = true;

        gapi.getMyBookshelfVolumes(props.shelfID, options.current)
            .then(res => {
                isSubscribed.current && Boolean(res.items) &&
                    setVolumes(res.items.map(volume => {
                        const _props = { key: volume.id, id: volume.id, ...volume.volumeInfo };
                        return React.cloneElement(component, _props);
                    }))
            })
            .catch(err => {
                isSubscribed.current && errorsHandler(err);
            })
            .finally(() => {
                isSubscribed.current && setLoading(false);
            });

        return(() => {
            isSubscribed.current = false;
        })
    }, [options, props.shelfID, component, errorsHandler]);


    useEffect(() => {
        loading ?
            dispatch(action.document.loading.start())
            :
            dispatch(action.document.loading.stop())
    }, [dispatch, loading]);


    return loading ? (
      <>
        <CircularProgress />
      </>
    ) : volumes.length ? (
      carousel ? (
        <RenderCarousel {...props}> {volumes} </RenderCarousel>
      ) : grid ? (
            <PreviewsContainer {...props}>{volumes}</PreviewsContainer>
        ) : (
            volumes
        )
    ) : (
      <div className={styles.fallback}>{fallback}</div>
    );
}


Bookshelf.Favorites = (props) => React.cloneElement(<Bookshelf />, { ...props, shelfID: 0 });;

Bookshelf.Purchased = (props) => React.cloneElement(<Bookshelf />, { ...props, shelfID: 1 });

Bookshelf.ToRead = (props) => React.cloneElement(<Bookshelf />, { ...props, shelfID: 2 });

Bookshelf.ReadingNow = (props) => React.cloneElement(<Bookshelf />, { ...props, shelfID: 3 });

Bookshelf.HaveRead = (props) => React.cloneElement(<Bookshelf />, { ...props, shelfID: 4 });

Bookshelf.Reviewed = (props) => React.cloneElement(<Bookshelf />, { ...props, shelfID: 5 });

Bookshelf.RecentlyViewed = (props) => React.cloneElement(<Bookshelf />, { ...props, shelfID: 6 });

Bookshelf.MyeBooks = (props) => React.cloneElement(<Bookshelf />, { ...props, shelfID: 7 });

Bookshelf.BooksForYou = (props) => React.cloneElement(<Bookshelf/>, {...props, shelfID: 8 });





export default Bookshelf;