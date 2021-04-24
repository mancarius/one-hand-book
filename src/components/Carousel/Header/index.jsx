import React from 'react';
import styles from './styles/index.module.css';

export function CarouselHeader({ title, primaryIcon, secondaryIcon, href, onClick, ...props }) {
    function clickHandler(e) {
        e.preventDefault();
        typeof onClick === 'function' && onClick();
    }

    return (
        <div className={`${styles.header} carousel-header`}>
            <a href={href ? href.toString?.() : '#!'} onClick={clickHandler}>
                {// PRIMARY ICON
                    primaryIcon &&
                    <div className={styles.primaryIcon}>
                        {React.cloneElement(primaryIcon)}
                    </div>
                }
                {// TITLE
                    title &&
                    <h3 className={`${styles.title} carousel-title`}>{title}</h3>
                }
                {// SECONDARY ICON
                    secondaryIcon &&
                    <div className={styles.secondaryIcon}>
                        {React.cloneElement(secondaryIcon)}
                    </div>
                }
            </a>
        </div>
    );
}
