import React, { useRef, useState } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import './Carousel.css'
import data from './data'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};
  
const Carousels = () => {

  const carouselRef = useRef(null);

  const handlePrevClick = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  const handleNextClick = () => {
  if (carouselRef.current) {
    carouselRef.current.next();
  }
  };
  const[noOfElement,setnoOfElement]=useState(3);
  const slice=data.cardData.slice(0,noOfElement);
return (
    <div className='bg-backgroundcolor my-10 w-full' id='project'>
      <Carousel responsive={responsive}
        ref={carouselRef}
        arrows={true}
        swipeable={true}
        draggable={false}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={4000}
        keyBoardControl={true}
        slidesToSlide={1}
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
      {slice.map((item,index)=>{
          return(
            <img src={item.img} className="card-img-top w-9/12 items-center justify-center mx-auto rounded-md"/>
          )
        })}
      </Carousel>
    </div>
)
}

export default Carousels