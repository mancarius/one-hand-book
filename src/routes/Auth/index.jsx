/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useDispatch, } from "react-redux";
import action from '../../redux/actions'
import { Button, CircularProgress } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import styles from './styles/index.module.css'
import firebase from '../../helpers/firebase'
import useErrorsHandler from '../../helpers/errorsHandler'
import base_path from '../../helpers/base_path';


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

function getRedirectPathByUrl() {
  const params = new URLSearchParams(window.location.search);
  const redirectPath = params.get("redirectPath");
  return redirectPath ? decodeURI(redirectPath) : null;
}


function Auth(props) {
    const errorsHandler = useErrorsHandler();
    const dispatch = useDispatch();
    const redirectPath = (() => {
      const fromPath = getRedirectPathByUrl() || props.location.state?.from;
        if (typeof fromPath === 'string')
            return fromPath;
        else if (typeof fromPath === 'object') {
            const { pathname = base_path + "/", search = "", hash = "" } =
            fromPath ?? {};
            return pathname + search + hash;
        }
        else return base_path + '/';
    })();
    const classes = useStyles();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const user = firebase.getCurrentUser();
  
    // ON MOUNT
    useEffect(() => {
        
        dispatch(action.document.header.hide());
        // require redirect results only if user is not logged in to avoid bugs
        !user &&
        firebase.getGoogleRedirectResult()
            .then(result => {
                setIsLoading(false);
                // if coming from google oauth page
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
        user && history.replace(redirectPath);
    }, [user]);

    return (
      <div className={styles.container}>
        {isLoading && <CircularProgress style={{ margin: "auto" }} />}
        {!isLoading && !user?.uid && (
          <>
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
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={() => history.goBack()}
            >
              Go back
            </Button>
          </>
        )}
      </div>
    );
}

export default React.memo(Auth)