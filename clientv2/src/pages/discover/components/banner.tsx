import React, { useState } from 'react';
import {Swiper, SwiperProps, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import { IconButton } from '@mui/material';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { handlePhotoUrl } from '../../../utils/services/request';
import { useNavigate } from 'react-router-dom';

const HomeBanner: React.FC<{items: any[]}> = (props) => {

    const [activeSet, setActiveStep] = useState<number>(1);
    const [swiperRef, setSwiperRef] = useState<any>(null);

    const navigate = useNavigate();

    const handleSliderChange = (e: any) => {
        setActiveStep(e.realIndex)
    }

    const swiperSettings: SwiperProps = {
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: true,
        onSlideChange: handleSliderChange,
        breakpoints: {
            700: {
                slidesPerView: 3,
                autoplay: true
            },
            100: {
                slidesPerView: 1,
                autoplay: true
            }
        }
    }

    const moveNext = () => {
        swiperRef.slideNext()
    }

    const moveBack = () => {
        swiperRef.slidePrev()
    }

    const handleItemClick = (id: any) => navigate(`/watch/${id}`)

    return (
        <div className="banner">
            <Swiper {...swiperSettings} className='slider-wrapper' onSwiper={s => setSwiperRef(s)}>
                {
                    props.items.map((item, i) => {
                        return (
                            <SwiperSlide className="slider-item" key={`slider-item-key-${i}`} onClick={() => handleItemClick(item.id)}>
                                <img src={handlePhotoUrl(item.thumbnail)} alt="po" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
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