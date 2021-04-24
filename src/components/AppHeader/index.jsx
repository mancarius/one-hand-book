import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from "react-redux";
import AppLogo from '../AppLogo'
import AppNav from './AppNav'
import styles from './styles/index.module.css'

function AppHeader() {
    const page = useSelector(state => state.document);
    const location = useLocation();


    return <>
        {
            page.header.display &&
            <header className={styles.header}>
                <h1 className={styles.title}>{page.header.title ? page.header.title : <AppLogo.Icon inline />}</h1>
                {
                    page.nav.display &&
                    <AppNav location={location} />
                }
            </header>
        }
    </>;
}
    
export default AppHeader