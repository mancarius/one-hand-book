/* eslint-disable import/no-anonymous-default-export */
import React, { useState, createContext } from 'react'
import { Rating } from '@material-ui/lab'
import BookContextProvider from '../../components/BookContextProvider'
import BookActions from '../../components/BookActions'
import styles from './styles/index.module.css';

export default React.memo(function () {
    const [expandSynopsis, setExpandSynopsis] = useState(false);
    

    const toggleSynopsis = () => {
        setExpandSynopsis(prev => !prev);
    }

    
    return <BookContextProvider>
        <img className={styles.cover} src="https://books.google.it/books/content?id=XThFnQEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72xSCdRcwa_Pv2metsuUpfpMnkwLFL_fH42tMaQTmt1V51aewH22AqEkETytMitWx0CT8KdLWUqLWn5GzIgeyc8VI-OvfNiDID0udxA-ZJ_ijYEGCXCMnSWItL207Wk1bWVU55S" alt="Frontcover" />
        <div className={styles.info}>
            <h1 className={styles.title}>{'Titolo'}</h1>
            <h3 className={styles.author}>{'Author'}</h3>
            <div className={styles.publishing}><div className={styles.publisher}>{'Random House Digital, Inc.'}</div><div className={styles['published-date']}>(2005)</div></div>
            <div className={styles.review}>
                <Rating name="read-only" value={4.5} precision={0.5} readOnly size='small' />
                <span> (<span className="count">13</span> reviews)</span>
            </div>
            <BookActions />
            <div className={styles.synopsis}>
                <p className={styles['synopsis-window']} style={expandSynopsis ? { maxHeight: '100vh' } : {}}>Una nuova edizione dello Hobbit di J.R.R. Tolkien, illustrata da Jemima Catlin. Il volume contiene il testo integrale del romanzo e centinaia di immagini a colori. Bilbo Baggins conduce una vita tranquilla e confortevole, viaggia di rado e non si allontana mai troppo dalla dispensa del suo buco-hobbit. La sua pace viene presto interrotta quando Gandalf lo stregone e una compagnia di tredici nani bussano alla sua porta e lo coinvolgono in un'avventura alla ricerca del tesoro custodito da Smaug il Terribile, un enorme, pericoloso drago...</p>
                <button onClick={toggleSynopsis}>{expandSynopsis ? 'Less...' : 'More...'}</button>
            </div>
        </div>
        <div className={styles.bibliography}>
            <h2>Bibliography</h2>
            <dl>
                <dt>Title</dt>
                <dd>Lo Hobbit. Un viaggio inaspettato. Ediz. illustrata</dd>
                <dt>Genre</dt>
                <dd>Narrativa straniera</dd>
                <dt>Author</dt>
                <dd>John Ronald Reuel Tolkien</dd>
                <dt>Translators</dt>
                <dd>C. Ciuferri, P. Paron</dd>
                <dt>Illustrator</dt>
                <dd>Jemina Catlin</dd>
                <dt>Publisher</dt>
                <dd>Bompiani, 2013</dd>
                <dt>ISBN</dt>
                <dd>8845274403, 9788845274404</dd>
                <dt>Lenght</dt>
                <dd>374 pages</dd>
            </dl>
        </div>
    </BookContextProvider>;
});