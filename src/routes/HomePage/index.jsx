import React, { useEffect } from "react";
import IfUserAuthed from "../../components/IfUserAuthed";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import action from "../../redux/actions";
import Bookshelf from "../../components/Bookshelf";
import GoogleBooksSearchField from "../../components/GoogleBooksSearchField";
import BookPreview from "../../components/BookPreview";
import styles from "./styles/index.module.css";
import { CarouselHeader } from "../../components/Carousel/Header";
import { Button } from "@material-ui/core";
import AppLogo from "../../components/AppLogo";
import base_path from "../../helpers/base_path";
import ArrowForwardRoundedIcon from "@material-ui/icons/ArrowForwardRounded";

const primaryCarouselResponsive = [
  {
    breakpoint: 870,
    settings: {
      slidesToShow: 2,
    },
  },
  {
    breakpoint: 600,
    settings: {
      slidesToShow: 1,
    },
  },
];

const HomePage = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(action.document.title.set(null));
    dispatch(action.document.header.set.title(null));
    dispatch(action.document.nav.set.activeItem("home"));
    dispatch(action.document.loading.stop());
  }, []);

  return (
    <>
      <div className="secondary-bg-color">
        <div className={styles.logo_container}>
          <AppLogo />
        </div>
        <GoogleBooksSearchField />
      </div>
      <IfUserAuthed>
        <div className={`${styles.carousel_container} ${styles.main_carousel}`}>
          <Bookshelf.BooksForYou
            fallback={<></>}
            carousel
            autoplay
            infinite
            centerMode
            maxResults={15}
            slidesToShow={3}
            responsive={primaryCarouselResponsive}
            component={<BookPreview coverAndDesc />}
          />
        </div>
        <section className={styles.bookshelves_container}>
          <CarouselHeader
            title="Recently Viewed"
            href={base_path + "/my-library/6/recently-viewed"}
            secondaryIcon={<ArrowForwardRoundedIcon />}
            onClick={() => {
              history.push("/my-library/6/recently-viewed");
            }}
          />
          <div className={styles.carousel_container}>
            <ul className={styles.secondary_carousel}>
              <Bookshelf.RecentlyViewed
                fallback={<p>You haven't seen any books recently.</p>}
                component={<BookPreview column />}
              />
            </ul>
          </div>
          <CarouselHeader
            title="To Read"
            href={base_path + "/my-library/2/to-read"}
            secondaryIcon={<ArrowForwardRoundedIcon />}
            onClick={() => {
              history.push(base_path + "/my-library/2/to-read");
            }}
          />
          <div className={styles.carousel_container}>
            <ul className={styles.secondary_carousel}>
              <Bookshelf.ToRead
                fallback={
                  <p>You don't seem to be reading any books at the moment</p>
                }
                component={<BookPreview column />}
              />
            </ul>
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ alignSelf: "center", marginTop: "1rem" }}
            onClick={() => history.push(base_path + "/my-library")}
          >
            Go To My Library
          </Button>
        </section>
      </IfUserAuthed>
    </>
  );
};

export default HomePage;
