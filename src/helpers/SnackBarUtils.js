import {
    useSnackbar
} from 'notistack'

let useSnackbarRef = null;

export const SnackbarUtilsConfigurator = () => {
    useSnackbarRef = useSnackbar();
    return null;
};

export const snackbar = (...args) => useSnackbarRef.enqueueSnackbar(...args);

export const closeSnackbar = (...args) => useSnackbarRef.closeSnackbar(...args);