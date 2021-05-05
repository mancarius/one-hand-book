import React, { useEffect, useState, useRef } from 'react'
import _ from 'lodash';
import coverFallback from '../../../assets/no-book-cover.jpg'
import styles from './styles/index.module.css'

export default React.memo(function Cover({ title, className, imageLinks = {}, ...props }) {
    const imgRef = useRef(null);
    const tmpRef = useRef(null);
    // src of the visible image
    const [src, setSrc] = useState(coverFallback);
    // src of the hidden image
    const [temp, setTemp] = useState(imageLinks?.thumbnail ?? '');



    function loadImage() {
        let imgWidth = imgRef.current.width;
        let newSrc = imageLinks?.thumbnail ?? coverFallback;

        if (imgWidth > 130) {
            if (imgWidth <= 300 && "small" in imageLinks)
                newSrc = imageLinks.small;
            else if (imgWidth <= 575)
                newSrc = imageLinks.medium ?? imageLinks.small ?? newSrc;
            else
                newSrc = imageLinks.large ?? imageLinks.medium ?? imageLinks.small ?? newSrc;
        }

        setTemp(newSrc);
    }



    function onTmpLoad() {
        // if tmp size > img size then replace
        tmpRef.current.height > 0 &&
            tmpRef.current.width > 0 &&
            setSrc(temp);
    }
    


    useEffect(() => {

        const debounced = _.debounce(loadImage, 500);
        // call on first rendering
        debounced();
        
        window.addEventListener('resize', debounced);
        
        return () => {
            debounced.cancel();
            window.removeEventListener('resize', debounced);
        }
        
    }, []);




    return (
        <>
            <img ref={tmpRef} style={{ display: 'none' }} src={temp} alt='' onLoad={onTmpLoad} />
            <img className={className + ' ' + styles.image} ref={imgRef} data-role="cover" src={src} title={title} alt="Frontcover" />
        </>
    );
});