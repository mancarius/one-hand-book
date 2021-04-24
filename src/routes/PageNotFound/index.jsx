/* eslint-disable import/no-anonymous-default-export */
import image from '../../assets/18330.webp';
import Search from '../../components/GoogleBooksSearchField'
import styles from './styles/index.module.css'

export default function (props) {
    return (
        <div className={styles.container}>
            <img src={image} alt="Error 404 - Page not found" className={styles.image} />
            <h1 className={styles.title}>Ops!</h1>
            <h3>Content not found</h3>
            <div className={styles.search_box}>
                <Search placeholder="For what are you looking for?" />
            </div>
        </div>
    );
}