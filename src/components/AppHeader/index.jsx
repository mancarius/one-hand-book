import React from 'react'
import AppLogo from '../AppLogo'
import AppNav from './AppNav'
import styles from './styles/index.module.css'

function AppHeader() {
    return (<>
        <header className={styles.header}>
            <h1 className={styles.h1}><AppLogo/></h1>
            <AppNav />
        </header>
        </>
    );
}
    
export default AppHeader