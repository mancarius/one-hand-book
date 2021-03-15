import type from './types'

function userActions() {}

userActions.login = (payload = null) => ({
    type: type.USER_LOGIN,
    payload
});

userActions.logout = (payload = null) => ({
    type: type.USER_LOGOUT,
    payload
})

export default userActions;