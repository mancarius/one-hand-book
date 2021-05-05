import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { SearchTwoTone } from '@material-ui/icons'
import Avatar from '@material-ui/core/Avatar'
import BookTwoTone from '@material-ui/icons/BookTwoTone';
import HomeTwoTone from '@material-ui/icons/HomeTwoTone';
import styles from './styles/index.module.css';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import UserAvatar from '../../UserAvatar';
import UserNav from '../../UserNav';
import base_path from '../../../helpers/base_path';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
        margin: theme.spacing(1),
    },
  },
  small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        background: 'none',
        color: 'inherit',
        fontSize: 'inherit'
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));


/**
 *  Return a react component containing the mai app navigation
 */
const AppNav = () => {
    const classes = useStyles();
    const nav = useSelector(state => state.document.nav);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'user-popover' : undefined;
    
    return (
        <><nav className={styles.nav}>
            <ul className={styles.items}>
                { /// HOME
                    <li className={styles.item + (nav.activeItem === 'search' ? styles.active : '')}>
                        <Link to={base_path + ""} title="Search a book" >
                            <Avatar variant="square" className={classes.small}>
                                <SearchTwoTone />
                            </Avatar>
                            <span className={styles.label}>Search</span>
                        </Link>
                    </li>
                }
                { /// MY BOOKSHELVES
                    <li className={styles.item + (nav.activeItem === 'library' ? styles.active : '')}>
                        <Link to={base_path + "/my-library"} title="My Library">
                            <Avatar variant="square" className={classes.small}>
                                <BookTwoTone />
                            </Avatar>
                            <span className={styles.label}>My Library</span>
                        </Link>
                    </li>
                }
                { /// AUTH
                    <li className={styles.item + (nav.activeItem === 'account' ? styles.active : '')}>
                        <IconButton aria-describedby={id} variant="contained" onClick={handleClick}>
                            <UserAvatar className={classes.small} />
                        </IconButton>
                    </li>
                }
                
            </ul>
        </nav>
        
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            elevation={2}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <UserNav closePopover={() => setAnchorEl(null)} />        
        </Popover>
        
        </>
    );
};

export default AppNav