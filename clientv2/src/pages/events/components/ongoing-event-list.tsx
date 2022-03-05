import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import EventCard from './event-card';
interface OngoingEventsListProps {
    dataList: any[];
    reload?: () => void;
}

const OngoingEventsList: React.FC<OngoingEventsListProps> = props => {
    return (
        <div className="ongoing-event-list">
            <h1 className='title' >Ongoing Events</h1>

            <div className="ongoing-event-item-list">
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
                                    <SwiperSlide className='slide' key={`ongoing-event-list-item-${i}`}>
                                        <EventCard 
                                            photo={item.photo}
                                            id={item.id}
                                            title={item.title}
                                            subscribed={item?.event_subscriptions?.length > 0 ? true : false}
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

export default OngoingEventsList;