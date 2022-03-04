import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
interface UpcomingEventsListProps {
    dataList: any[]
}

const UpcomingEventsList: React.FC<UpcomingEventsListProps> = props => {
    return (
        <div className="upcoming-event-list">
            <h1 className='title' >Upcoming Events</h1>

            <div className="upcoming-event-item-list">
                <Swiper
                    slidesPerView={3}
                    className="slider-wrapper"
                    spaceBetween={50}
                    style={{width: '100%'}}
                >
                    {
                        props.dataList.map((item, i) => {
                            return (
                                <SwiperSlide className='slide' key={`upcoming-event-list-item-${i}`}>
                                    <div className="slide-content">hello 1</div>
                                </SwiperSlide>   
                            );
                        })
                    }       
                </Swiper>
            </div>
        </div>
    );
}

export default UpcomingEventsList;