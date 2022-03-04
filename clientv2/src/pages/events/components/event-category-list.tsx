import React from 'react';
import { handlePhotoUrl } from '../../../utils/services/request';

interface EventCategoryListComponentProps {
    dataList: any[]
}

const EventCategoryList: React.FC<EventCategoryListComponentProps> = props => {

    return (
        <div className="event-category-list">
            <h1 className='title'>Explore By Category</h1>
            <div className="category-item-list">
                {
                    props.dataList.map((item, i) => {
                        return (
                            <div className="category-list-item" key={`category-list-item-${i}`}>
                                <img src={handlePhotoUrl(item.photo)} alt="category img" />
                                <div className="info">
                                    <p>{item.name}</p>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default EventCategoryList;