import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import EventCard from './event-card';
interface OngoingEventsListProps {
    dataList: any[]
}

const OngoingEventsList: React.FC<OngoingEventsListProps> = props => {
    return (
        <div className="ongoing-event-list">
            <h1 className='title' >Ongoing Events</h1>

            <div className="ongoing-event-item-list">
                <div className="swiper-container">
                    <Swiper
                        slidesPerView={props?.dataList.length > 1 ? props.dataList.length : 0}
                        className="slider-wrapper"
                        spaceBetween={0}
                        loop={props?.dataList?.length ? true : false}
                        autoplay={true}
                        noSwiping={props.dataList.length > 1 ? true : false}                        
                    >
                        {
                            props.dataList.map((item, i) => {
                                return (
                                    <SwiperSlide className='slide' key={`ongoing-event-list-item-${i}`}>
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

export default OngoingEventsList;