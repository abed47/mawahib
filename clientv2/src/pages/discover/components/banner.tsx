import React, { useState } from 'react';
import {Swiper, SwiperProps, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import { IconButton } from '@mui/material';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const HomeBanner: React.FC<{items: any[]}> = (props) => {

    const [activeSet, setActiveStep] = useState<number>(1);
    const [swiperRef, setSwiperRef] = useState<any>(null);

    const handleSliderChange = (e: any) => {
        setActiveStep(e.realIndex)
    }

    const swiperSettings: SwiperProps = {
        slidesPerView: 3,
        spaceBetween: 30,
        initialSlide: 0,
        centerInsufficientSlides: true,
        loop: true,
        centeredSlides: true,
        autoplay: true,
        // onChange: handleSliderChange,
        speed: 500,
        onSlideChange: handleSliderChange,
    }

    const moveNext = () => {
        swiperRef.slideNext()
    }

    const moveBack = () => {
        swiperRef.slidePrev()
    }

    return (
        <div className="banner">
            <Swiper {...swiperSettings} className='slider-wrapper' onSwiper={s => setSwiperRef(s)}>
                {
                    props.items.map((item, i) => {
                        return (
                            <SwiperSlide className="slider-item" key={`slider-item-key-${i}`}>
                                <img src={item.thumbnail} alt="po" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                {/* <p>{item.title}</p> */}
                            </SwiperSlide>
                        );
                    })
                }
            </Swiper>
                
                <div className="dots-wrapper">
                    <IconButton onClick={moveBack}> <HiChevronLeft /> </IconButton>

                    <ul className="dots">
                        {props.items.map((item, i) => <li className={`dot ${activeSet === i ? 'active' : ''}`} key={`home-banner-discover-dots-${i}`}></li>)}
                    </ul>
                    <IconButton onClick={moveNext}> <HiChevronRight /> </IconButton>
                </div>
            
        </div>
    );
}

export default HomeBanner;