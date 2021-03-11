import React from 'react'
import { Link } from 'react-router-dom'
import {FaceTwoTone, SearchTwoTone} from '@material-ui/icons'
import styles from './styles/index.module.css'

const AppNav = (props) => {
    return (<><nav className={styles.nav}>
        <ul className={styles.items}>
            <li className={styles.item}>
                <Link to="/search" ><SearchTwoTone /></Link>
            </li>
            <li className={styles.item}>
                <Link to="/auth" ><FaceTwoTone /></Link>
            </li>
        </ul>
    </nav></>);
}

export default AppNav