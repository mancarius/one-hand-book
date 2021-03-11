import styles from './styles/index.module.css'

export default function ListItem({id, img, title, author}) {
    return <li className={styles.item}>
        <img className={styles.image} src={img} alt={title}/>
        <div className={styles.info}>
            <h4 className={styles.title}>{title}</h4>
            <small className={styles.author}>{author}</small>
        </div>
    </li>;
}