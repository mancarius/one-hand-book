/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import action from '../../redux/user/actions'
import { Button, CircularProgress } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
//import createSvgIcon from "@material-ui/icons/utils/createSvgIcon";
import styles from './styles/index.module.css'
import firebase from '../../helpers/firebase'

//const GoogleIcon = createSvgIcon(<path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>, 'GoogleIcon')

const useStyles = makeStyles((theme) => ({
  button: {
        borderRadius: '2em',
        padding: '1rem',
        margin: '0 1rem',
        backgroundColor: '#ffffa5'
  },
}));

function Auth(props) {
    const dispatch = useDispatch();
    const redirectPath = props.location.state?.from?.pathname ?? '/';
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        // require redirect results only if user is not logged in to avoid bugs
        !user?.uid &&
        firebase.getGoogleRedirectResult()
            .then((result) => {
                setLoading(false);
                if (result.credential) {
                    /** @type {firebase.auth.OAuthCredential} */
                    var credential = result.credential;
                    console.log('credential', credential);

                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = credential.accessToken;
                    console.log('token', token);
                    // ...
                    dispatch(action.login({ ...result.user, token } ) );
                }
                
            }).catch((error) => {
                setLoading(false);
                console.warn('error', error);
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
    }, []);

    useEffect(() => {
        user?.uid && history.push(redirectPath);
    }, [user]);

    return <div className={styles.container}>
        {loading && <CircularProgress style={{margin: 'auto'}} />}
        {!loading && !user?.uid && <>
            <h2 className={styles.title}>Access to your library</h2>
            <Button variant="contained" className={classes.button} onClick={() => { setLoading(true); return firebase.GoogleAuth() }}>Continue with Google</Button>
        </>}
    </div>
}

export default Auth