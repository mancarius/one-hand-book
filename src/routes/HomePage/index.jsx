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

const secondaryCarouselResponsive = [
  {
    breakpoint: 750,
    settings: {
      slidesToShow: 9,
    },
  },
  {
    breakpoint: 600,
    settings: {
      slidesToShow: 7,
    },
  },
  {
    breakpoint: 500,
    settings: {
      slidesToShow: 5,
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
  }, []);

  return (
    <>
      <div className={styles.logo_container}>
        <AppLogo />
      </div>
      <GoogleBooksSearchField />
      <IfUserAuthed>
        <div className={`${styles.carousel_container} ${styles.main_carousel}`}>
          <CarouselHeader title="Books for you" />
          <Bookshelf.BooksForYou
            fallback={<h2>No books</h2>}
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
          <div className={styles.carousel_container}>
            <CarouselHeader
              title="Recently Viewed"
              href={"/my-bookshelves/6/recently-viewed"}
              onClick={() => {
                history.push("/my-bookshelves/6/recently-viewed");
              }}
            />
            <Bookshelf.RecentlyViewed
              fallback={<p>You haven't seen any books recently.</p>}
              carousel
              slidesToShow={10}
              maxResults={16}
              responsive={secondaryCarouselResponsive}
              component={<BookPreview onlyCover />}
            />
          </div>
          <div className={styles.carousel_container}>
            <CarouselHeader
              title="Keep reading..."
              button={{
                label: "more >",
                onClick: () => {
                  history.push("/my-bookshelves/3/recently-viewed");
                },
              }}
            />
            <Bookshelf.ReadingNow
              fallback={
                <p>You don't seem to be reading any books at the moment</p>
              }
              carousel
              slidesToShow={5}
              maxResults={15}
              responsive={secondaryCarouselResponsive}
              component={<BookPreview onlyCover />}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ alignSelf: "center" }}
            onClick={() => history.push("/my-bookshelves")}
          >
            My bookshelves
          </Button>
        </section>
      </IfUserAuthed>
    </>
  );
};

export default HomePage;
