import type from './types'

const navActions = {

    hide: () => ({
        type: type.NAV_HIDE,
    }),

    show: () => ({
        type: type.NAV_SHOW,
    }),

    set: {

        activeItem: (payload = null) => ({
            type: type.NAV_SET_ACTIVE_ITEM,
            payload
        }),
        
    },

};

export default navActions;