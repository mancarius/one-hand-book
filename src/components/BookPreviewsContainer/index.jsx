import styles from './styles/index.module.css'

export default function Container({ children }) {
    return <ul className={styles.grid}>{children}</ul>;
}