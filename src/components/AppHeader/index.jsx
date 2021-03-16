import React from 'react'
import {useLocation} from 'react-router-dom'
import AppLogo from '../AppLogo'
import AppNav from './AppNav'
import styles from './styles/index.module.css'

function AppHeader() {
    const location = useLocation();
    const path = location.pathname.split('/');
    const pathname = [...path].pop();

    return <>
        {
            path[1] !== 'book' &&
            <header className={styles.header}>
                <h1 className={styles.logo}>{pathname !== '' ? pathname : <AppLogo />}</h1>
                <AppNav location={location} />
            </header>
        }
    </>;
}
    
export default AppHeader