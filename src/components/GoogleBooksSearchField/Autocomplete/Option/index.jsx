/* eslint-disable import/no-anonymous-default-export */
import parse from 'autosuggest-highlight/parse';
import styles from './styles/index.module.css';

export default ({ option }) => {
    const matches = option.matched_substring;
    const parts = parse(
        option.main_text,
        matches.map(match => [match.offset, match.offset + match.length]),
    );

    return (
        <div className={styles.autocomplete_option}>
            {parts.map((part, index) => {
                return (<span key={index} style={{ fontWeight: part.highlight ? 'bold' : 'normal' }}>
                    {part.text}
                </span>);
            })}
        </div>
    );
}