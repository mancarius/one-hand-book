import user from '../actions'
import firebase from '../../../helpers/firebase'
import actions from '../../actions'
import {
    errorsHandler
} from '../../../helpers/errorsHandler'

/**
 * return action if logout success, else display error
 * 
 * @param {*} store 
 * @returns 
 */
export const logoutMiddleware = store => next => action => {
    // skip if not the required action
    if (action.type !== user.logout().type) return next(action);
    // else
    // set general loading state
    store.dispatch(actions.document.loading.start());
    // signout from firebase
    firebase.signOut().then(() => {
            // Sign-out successful.
            localStorage.removeItem('user');
            // then go to reducer
            return next(action);
        })
        .catch(errorsHandler)
        .finally(store.dispatch(actions.document.loading.stop()));
}