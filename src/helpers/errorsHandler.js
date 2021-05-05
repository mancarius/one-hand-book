/* eslint-disable import/no-anonymous-default-export */
import React, {
    useEffect,
    useState
} from 'react'
import history from "./history";
import store from '../redux/store'
import user from '../redux/user/actions';
import {
    snackbar
} from './SnackBarUtils';
import SnackbarActions from '../components/SnackbarActions';
import base_path from './base_path';


function goToAuth() {
    history.push(base_path+'/auth', {
        from: history.location
    });
}


function googleApi({
    code,
    message,
    status
}, snackbar) {

    if (code === 401) {

        if (status === "UNAUTHENTICATED") {
            // if user already authed
            if (localStorage.getItem("user") !== null) {
                store.dispatch(user.logout());
            }
            snackbar('Session expired. Need authentication to continue.');
            goToAuth();
        }

    } else {
        switch (status) {
            case 'RESOURCE_EXHAUSTED':
                snackbar("Oh, i'm so sorry, but looks like our app is exhausted. Please try again after midnight");
                break;
            default:
                snackbar('Something goes wrong with api connection', {
                    variant: 'warn',
                });
        }

        console.log(code, message, status);
    }
}



export function errorsHandler(error) {
    // if error si null
    if (error === null) return undefined;
    // else
    console.warn(error);
    // if errors come by Api 
    if (error?.response?.data?.error) {
        googleApi(error.response.data.error, snackbar);
    }
    // else
    else {
        if (error instanceof TypeError || error instanceof SyntaxError) {
            snackbar(
                "Sorry mate, i can't complete this task because my developer is an ass...", {
                    variant: 'warn',
                }
            );
        } else if (error.name === 'UNAUTHENTICATED') {
            snackbar(
                error?.message ?? 'Need authentication to continue', {
                    variant: 'info',
                    action: (key) => (
                        <>
                            <SnackbarActions.Dismiss snackKey={key} />
                            <SnackbarActions.SignIn />
                        </>
                    )}
                );
            }
            else {
                snackbar(
                    error?.message ?? 'Something goes wrong', {
                        variant: 'error',
                    }
                );
            }
        }
    }


    /**
     * 
     * @param {*} err Error 
     * @returns 
     */
    export default function useErrorsHandler(err) {
        const [error, setError] = useState(null);

        useEffect(() => {
            errorsHandler(error);
        }, [error]);

        return setError;

    }