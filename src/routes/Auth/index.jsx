/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import action from '../../redux/actions'
import { Button, CircularProgress } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import styles from './styles/index.module.css'
import firebase from '../../helpers/firebase'
import useErrorsHandler from '../../helpers/errorsHandler'

//const GoogleIcon = createSvgIcon(<path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>, 'GoogleIcon')

const useStyles = makeStyles((theme) => ({
  button: {
        margin: '1rem',
        width: '100%',
        maxWidth: '250px'
  },
}));



function setRedirectParam(path) {
    const params = new URLSearchParams(window.location.search);
    params.set('redirectPath', encodeURI(path));
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function getRedirectPath() {
    const params = new URLSearchParams(window.location.search);
    return decodeURI(params.get('redirectPath'));
}


function Auth(props) {
    const errorsHandler = useErrorsHandler();
    const dispatch = useDispatch();
    const redirectPath = (() => {
        const fromPath = props.location.state?.from;
        if (typeof fromPath === 'string')
            return props.location.state.from;
        else if (typeof fromPath === 'object') {
            const { pathname = '/', search = '', hash = '' } = props.location.state?.from ?? {};
            return pathname + search + hash;
        }
        else return '/';
    })();
    const classes = useStyles();
    const history = useHistory();
    const loading = useSelector(state => state.document.loading);
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector(state => state.user);

    useEffect(() => {
        
        dispatch(action.document.header.hide());
        // require redirect results only if user is not logged in to avoid bugs
        !user?.uid &&
        firebase.getGoogleRedirectResult()
            .then(result => {
                setIsLoading(false);
                // if is coming from google oauth page
                if (result.credential) {
                    /** @type {firebase.auth.OAuthCredential} */
                    var credential = result.credential;

                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = credential.accessToken;
                    
                    // ...
                    dispatch(action.user.login({ ...result.user, token }));
                }
                
            }).catch(error => {
                setIsLoading(false);
                errorsHandler(error);
            });
        
        return () => {
            dispatch(action.document.header.show());
            setIsLoading(true);
        }
    }, []);

    useEffect(() => {
        isLoading
            ? dispatch(action.document.loading.start())
            : dispatch(action.document.loading.stop())
            
    }, [isLoading]);

    useEffect(() => {
        user?.uid && history.replace(getRedirectPath() || '/');
    }, [user]);

    return <div className={styles.container}>
        {isLoading && <CircularProgress style={{margin: 'auto'}} />}
        {!isLoading && !user?.uid && <>
            <h2 className={styles.title}>Access to your library</h2>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => {
                    setIsLoading(true);
                    try {
                        setRedirectParam(redirectPath);
                        return firebase.GoogleAuth();  
                    } catch (e) {
                        setIsLoading(false);
                        errorsHandler(e);
                    }
                }}
            >
                Sign in with Google
            </Button>
            <Button variant="outlined" color="secondary" className={classes.button} onClick={() =>  history.goBack() }>Go back</Button>
        </>}
    </div>
}

export default React.memo(Auth)