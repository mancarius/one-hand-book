import styles from './styles/index.module.css'

export default function Item({id, img, title, author}) {
    return <li className={styles.item} onClick={()=>{console.log('click on the book')}}>
        <img className={styles.image} src={img} alt={title}/>
        <div className={styles.info}>
            <h4 className={styles.title}>{title}</h4>
            <small className={styles.author}>{author}</small>
        </div>
    </li>;
}