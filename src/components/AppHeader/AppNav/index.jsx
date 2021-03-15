import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {FaceTwoTone, SearchTwoTone} from '@material-ui/icons'
import styles from './styles/index.module.css'

const AppNav = (props) => {
    const { pathname } = props.location;
    
    return (<><nav className={styles.nav}>
        <ul className={styles.items}>
            {/// SEARCH
                pathname !== '/search' &&
                    <li className={styles.item}>
                        <Link to="/search" ><SearchTwoTone /></Link>
                    </li>
            }
            {/// AUTH
                pathname !== '/auth' &&
                    <li className={styles.item}>
                        <Link to="/auth" ><FaceTwoTone /></Link>
                    </li>
            }
        </ul>
    </nav></>);
};

export default AppNav