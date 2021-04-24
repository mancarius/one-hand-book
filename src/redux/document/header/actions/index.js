import type from './types'

const headerActions = {

    hide: () => ({
        type: type.HEADER_HIDE,
    }),

    show: () => ({
        type: type.HEADER_SHOW,
    }),

    set: {

        title: (payload = null) => ({
            type: type.HEADER_SET_TITLE,
            payload
        }),

        documentTitle: (payload = null) => ({
            type: type.HEADER_SET_DOCUMENT_TITLE,
            payload
        }),

    },
};

export default headerActions;