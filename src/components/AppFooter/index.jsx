import React from 'react'
import AppLogo from '../AppLogo'
import styles from './styles/index.module.css'

function AppFooter() {
    return <>
        <footer className={styles.footer}>
            <h2 className={styles.logo}>
                <AppLogo />
            </h2>
        </footer>
    </>
}

export default AppFooter