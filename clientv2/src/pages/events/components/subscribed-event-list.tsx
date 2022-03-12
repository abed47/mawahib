import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import EventCard from './event-card';

interface SubscribedEventsListProps {
    dataList: any[],
    reload?: () => void
}

const SubscribedEventsList: React.FC<SubscribedEventsListProps> = props => {
    return (
        <div className="upcoming-event-list">
            <h1 className='title' >My Events</h1>

            <div className="upcoming-event-item-list">
                <div className="swiper-container">
                    <Swiper
                        slidesPerView={props?.dataList.length > 1 ? 3 : 0}
                        className="slider-wrapper"
                        spaceBetween={props?.dataList.length > 1 ? 50 : 0}
                        loop={props?.dataList?.length ? true : false}
                        autoplay={true}
                        noSwiping={props.dataList.length > 1 ? true : false}                        
                    >
                        {
                            props.dataList.map((item, i) => {
                                return (
                                    <SwiperSlide className='slide' key={`my-event-list-item-${i}`}>
                                        <EventCard 
                                            photo={item.cover}
                                            id={item.id}
                                            title={item.title}
                                            subscribed={true}
                                            categoryName={item?.category?.name}
                                            reload={props.reload}
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