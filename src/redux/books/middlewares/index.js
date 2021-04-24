import user from '../../books/actions'

export const loginMiddleware = store => next => action => {
    // skip if not the required action
    if (action.type !== user().login.type) return next(action);
    return next(action);
}