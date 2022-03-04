import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import EventCard from './event-card';

interface SubscribedEventsListProps {
    dataList: any[]
}

const SubscribedEventsList: React.FC<SubscribedEventsListProps> = props => {
    return (
        <div className="upcoming-event-list">
            <h1 className='title' >My Events</h1>

            <div className="upcoming-event-item-list">
                <div className="swiper-container">
                    <Swiper
                        slidesPerView={3}
                        className="slider-wrapper"
                        spaceBetween={50}
                        loop={true}
                        autoplay={true}
                        
                    >
                        {
                            props.dataList.map((item, i) => {
                                return (
                                    <SwiperSlide className='slide' key={`upcoming-event-list-item-${i}`}>
                                        <EventCard 
                                            photo={item.photo}
                                            id={item.id}
                                            title={item.title}
                                            subscribed={false}
                                            categoryName={item?.category?.name}
                                        />
                                    </SwiperSlide>   
                                );
                            })
                        }       
                    </Swiper>
                </div>
            </div>
        </div>
    );
}

export default SubscribedEventsList;