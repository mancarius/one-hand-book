import type from './types'

function titleActions() {}

titleActions.set = (payload = null) => ({
    type: type.SET_DOCUMENT_TITLE,
    payload
});

export default titleActions;