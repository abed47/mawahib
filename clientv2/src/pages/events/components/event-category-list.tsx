import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handlePhotoUrl } from '../../../utils/services/request';

interface EventCategoryListComponentProps {
    dataList: any[]
}

const EventCategoryList: React.FC<EventCategoryListComponentProps> = props => {

    const navigate = useNavigate();

    const handleCategoryClick = (id: number | string) => navigate('/event/category/' + id)

    return (
        <div className="event-category-list">
            <h1 className='title'>Explore By Category</h1>
            <div className="category-item-list">
                {
                    props.dataList.map((item, i) => {
                        return (
                            <div className="category-list-item" key={`category-list-item-${i}`} onClick={() => handleCategoryClick(item.id)}>
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