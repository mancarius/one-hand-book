import {
    createMuiTheme
} from '@material-ui/core/styles';


const theme = createMuiTheme({
    overrides: {
        MuiButton: {
            root: {
                fontFamily: 'inherit',
                borderRadius: '2rem',
                border: 0,
                color: '#ffffff',
                height: 48,
                padding: '0 30px',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                letterSpacing: 'normal',
                width: 'fit-content',
                opacity: .9,
                '&:hover': {
                    opacity: 1
                }
            },
            text: {
                boxShadow: 'none',
                color: 'inherit'
            },
            textPrimary: {},
            textSecondary: {},
            outlined: {
                boxShadow: 'none',
                borderColor: 'inherit',
            },
            outlinedPrimary: {
                borderColor: 'var(--button-success-bg) !important',
                color: 'var(--darkgray) !important',
                '&:hover': {
                    backgroundColor: 'var(--button-success-bg) !important',
                    borderColor: 'var(--button-success-bg) !important',
                    color: 'var(--darkgray) !important',
                }
            },
            outlinedSecondary: {
                borderColor: 'var(--button-default-bg) !important',
                color: 'var(--button-default-bg) !important',
                '&:hover': {
                    backgroundColor: 'var(--button-default-bg) !important',
                    borderColor: 'var(--button-default-bg) !important',
                    color: 'var(--button-default-bg) !important',
                }
            },
            contained: {
                color: 'var(--darkgray) !important',
            },
            containedPrimary: {
                backgroundColor: 'var(--button-success-bg) !important',
                '&:hover': {
                    backgroundColor: 'var(--button-success-bg) !important',
                }
            },
            containedSecondary: {
                backgroundColor: 'var(--button-default-bg) !important',
                '&:hover': {
                    backgroundColor: 'var(--button-default-bg) !important',
                }
            }
        },
    },

})

export default theme