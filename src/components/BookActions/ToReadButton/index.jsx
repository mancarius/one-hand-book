/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useSnackbar } from 'notistack';
import { BookContext } from '../../BookContextProvider'
import useErrorsHandler from '../../../helpers/errorsHandler'
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@material-ui/icons/BookmarkRounded';
import gapi from '../../../helpers/googleBooksApi';
import SnackbarActions from '../../SnackbarActions';


async function updateState(volumeID, state) {
    let res = null;
    try {
        if (state) res = await gapi.addToMyToRead(volumeID);
        else res = await gapi.removeFromMyToRead(volumeID);
    } catch (err) {
        throw err;
    }
    // then
    return res;
}

export default function ToReadButton(props) {
    const user = useSelector(state => state.user);
    const { volume } = useContext(BookContext);
    const { enqueueSnackbar } = useSnackbar();
    const [toRead, setToRead] = useState(false);
    const isSubscribed = useRef(false);
    const errorsHandler = useErrorsHandler();


    const toggleAction = (type) => {
        if ('token' in user) {
            // update changes
            updateState(volume.id, !toRead)
                .then(res => {
                    if (!isSubscribed.current) return undefined;
                    // else
                    setToRead(prev => !prev);
                })
                .catch(err => {
                    if (!isSubscribed.current) return undefined;
                    // else
                    errorsHandler(err)
                });
        }
        else
        {
            enqueueSnackbar('Sign in to add this book to your "to read" list',
                {
                    variant: 'info',
                    action: (key) => (
                        <>
                            <SnackbarActions.Dismiss snackKey={key} />
                            <SnackbarActions.SignIn />
                        </>
                    )
                });
        }
    }


    useEffect(() => {
        isSubscribed.current = true;

        // get action status
        gapi.isToRead(volume.id)
            .then(res => {
                if (!isSubscribed.current) return undefined;
                setToRead(res);
            })
            .catch(err => {
                if (!isSubscribed.current) return undefined;
                // else
                errorsHandler(err)
            });

        return () => {
            isSubscribed.current = false;
        }
    }, [])


    return (
        <button onClick={() => toggleAction()}>
            {
                toRead ?
                    <BookmarkRoundedIcon />
                    :
                    <BookmarkBorderRoundedIcon />
            }
        </button>
    )
}