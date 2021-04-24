import logo from '../../assets/logo.webp'
import styles from './styles/index.module.css'

function AppLogo() {
    return <span className={styles.inline}>Sweet<img src={ logo } alt="SweetBook" />ook</span>
}

AppLogo.Icon = (props) => {
    return <img className={styles.onlyIcon} src={logo} alt="SweetBook" />;
}

export default AppLogo