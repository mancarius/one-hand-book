import type from './types'

function loadingActions() {}

loadingActions.start = () => ({
    type: type.START_PAGE_LOADING
});

loadingActions.stop = () => ({
    type: type.STOP_PAGE_LOADING
})

export default loadingActions;