import React from 'react';
import {Swiper, SwiperProps, SwiperSlide} from 'swiper/react';
import 'swiper/css';

const HomeBanner: React.FC<{items: any[]}> = (props) => {


    const swiperSettings: SwiperProps = {
        slidesPerView: 3,
        spaceBetween: 30,
        initialSlide: 2,
        centerInsufficientSlides: true,
        loop: true,
        centeredSlides: true
    }

    return (
        <div className="banner">
            <Swiper {...swiperSettings} className='slider-wrapper'>
                {
                    props.items.map((item, i) => {
                        return (
                            <SwiperSlide className="slider-item" key={`slider-item-key-${i}`}>
                                <img src={item.thumbnail} alt="poto" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                <p>{item.title}</p>
                            </SwiperSlide>
                        );
                    })
                }
            </Swiper>
                
            
        </div>
    );
}

export default HomeBanner;