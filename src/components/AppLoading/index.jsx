/* eslint-disable import/no-anonymous-default-export */
import Logo from '../AppLogo';
import styles from './styles/index.module.css'

export default function () {
    return <div className={styles.container}>
        <div className={styles.logo}><Logo/></div>
    </div>;
}