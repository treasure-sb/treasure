"use client";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function FeaturedEventCarousel({
  featuredEvents,
}: {
  featuredEvents: JSX.Element[];
}) {
  return (
    <div className="mx-[-16px] sm:mx-[-32px]">
      <Carousel
        additionalTransfrom={0}
        arrows={false}
        autoPlay
        autoPlaySpeed={3500}
        centerMode={true}
        containerClass="container-with-dots"
        dotListClass=""
        focusOnSelect={false}
        ssr={true}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 3,
            partialVisibilityGutter: 10,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 2,
            partialVisibilityGutter: 30,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 1,
            partialVisibilityGutter: 10,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {featuredEvents.map((event) => (
          <div className="mx-2">{event}</div>
        ))}
      </Carousel>
    </div>
  );
}
