import React from 'react';
import Slider from 'react-slick'
import("slick-carousel/slick/slick.css");
import("slick-carousel/slick/slick-theme.css");
import('./styles/index.css');

export default function Carousel({ children, autoplay = false, centerMode = false, responsive = null, slidesToShow = 1, infinite = false, fade = false, ...props }) {
    const settings = {
      infinite,
      arrows: false,
      dots: false,
      autoplay,
      responsive,
      autoplaySpeed: 8000,
      speed: 1500,
      easing: "ease-in-out",
      lazyLoad: "progressive",
      slidesToShow,
      slidesToScroll: centerMode ? 1 : slidesToShow,
      centerMode,
      fade,
      centerPadding: "20px",
    };


    return (
        <Slider {...settings}>{children}</Slider>
    );
}
