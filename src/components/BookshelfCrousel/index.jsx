import Slider from "react-slick";
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import BookPreview from '../BookPreview'
import styles from './styles/index.module.css'

export default function Carousel({ bookshelf, limit = 10 }) {
    const settings = {
        dots: false,
        infinite: false,
        arrows: false,
        lazyLoad: 'progressive',
        slide: 'ul',
        slidesToScroll: 1
    }
    return <>
        <h3 className={styles.title}>{bookshelf?.title}</h3>
        <div className={styles.carousel}>
            <Slider {...settings}>
                {
                    bookshelf?.slice(0, limit).map((book, index) => {
                        return <BookPreview {...book} />
                    })
                }
                <div className={styles.expandButtonContainer}>
                    <button className={styles.expandButton}>
                        <AddRoundedIcon />Expand
                    </button>
                </div>
            </Slider>
        </div>
    </>;
}