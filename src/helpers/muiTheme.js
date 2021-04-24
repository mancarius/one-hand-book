import {
    createMuiTheme
} from '@material-ui/core/styles';
import styles from '../styles/index.css'

const primary = styles.button_primary;
const secondary = styles.button_secondary;

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
                opacity: .8,
                '&:hover': {
                    opacity: 1
                }
            },
            text: {
                boxShadow: 'none',
                color: 'inherit'
            },
            textPrimary: {
                ...styles.button_primary
            },
            textSecondary: {
                ...styles.button_secondary
            },
            outlined: {
                boxShadow: 'none',
                borderColor: 'inherit',
            },
            outlinedPrimary: {
                borderColor: 'var(--button-success-bg)',
                color: 'var(--darkgray)',
                '&:hover': {
                    backgroundColor: 'transparent',
                    borderColor: 'var(--button-success-bg)',
                    color: 'var(--darkgray)',
                }
            },
            outlinedSecondary: {
                borderColor: 'var(--button-default-bg)',
                color: 'var(--button-default-bg)',
                '&:hover': {
                    backgroundColor: 'transparent',
                    borderColor: 'var(--button-default-bg)',
                    color: 'var(--button-default-bg)',
                }
            },
            contained: {
                color: 'var(--darkgray) !important',
            },
            containedPrimary: {
                backgroundColor: 'var(--button-success-bg)',
                '&:hover': {
                    backgroundColor: 'var(--button-success-bg)',
                }
            },
            containedSecondary: {
                backgroundColor: 'var(--button-default-bg)',
                '&:hover': {
                    backgroundColor: 'var(--button-default-bg)',
                }
            }
        },
    },

})

export default theme