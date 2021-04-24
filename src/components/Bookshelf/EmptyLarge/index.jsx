/* eslint-disable import/no-anonymous-default-export */
import { useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'
import image from '../../../assets/empty-box.svg';
import styles from './styles/index.module.css';

export default function (props) {
    const history = useHistory();
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>No books here</h2>
            <img className={styles.image} src={image} alt="Girl with empty box" />
            <Button
                variant="contained"
                color="primary"
                className={styles.shelves_button}
                onClick={() => history.push('/my-bookshelves')}
            >
                My bookshelves
            </Button>
        </div>
    );
}