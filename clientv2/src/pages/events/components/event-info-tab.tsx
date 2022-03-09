import React from 'react';
import { EventViewResponseData } from '../../../utils/types';
import FirstPlaceImage from '../../../assets/images/first-place.png';
import SecondPlaceImage from '../../../assets/images/second-place.png';
import ThirdPlaceImage from '../../../assets/images/third-place.png';

interface ComponentProps {
    data: EventViewResponseData
}

const EventInfoTab: React.FC<ComponentProps> = props => {
    
    return (
        <div className="info">
            <div className="description" dangerouslySetInnerHTML={{__html: props.data.description}}></div>
            <hr />
            <div className="prize-pool">
                {
                    props.data.prize_pool_description ? <div className="prize-pool-description" dangerouslySetInnerHTML={{__html: props.data.prize_pool_description}}></div> : null
                }

                <div className="rewards">
                    {
                        props.data.first_prize_amount ?
                        <div className="reward">
                            <img src={FirstPlaceImage} alt="prize logo" />
                            <p>{props.data.first_prize_amount} Cheer</p>
                        </div>
                        : null
                    }
                    {
                        props.data.second_prize_amount ?
                        <div className="reward">
                            <img src={SecondPlaceImage} alt="prize logo" />
                            <p>{props.data.second_prize_amount} Cheer</p>
                        </div>
                        : null
                    }
                    {
                        props.data.third_prize_amount ?
                        <div className="reward">
                            <img src={ThirdPlaceImage} alt="prize logo" />
                            <p>{props.data.third_prize_amount} Cheer</p>
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>
    );
}

export default EventInfoTab;