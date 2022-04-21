import { useNavigate } from "react-router-dom";
import { handlePhotoUrl } from "../../../utils/services/request";

const TopTalents: React.FC<{items: any[], live: any[]}> = props => {

    const navigate = useNavigate();

    const handleClick = (id: any, ops = false) => {
        if(ops) return navigate(`/live/${id}`)
        navigate(`/channel/${id}`);
    }
    return (
        <div className="top-talents">
            <h2>Top Talents</h2>

            <div className="channel-list">
                {
                    props.live.map((item, i) => {
                        return (
                            <div onClick={() => handleClick(item.video_uid, true)} className="channel-list-item" key={`top-talent-under-banner-list-item-live-${i}`}>
                                
                                <div className="live"> Live </div>
                                
                                <img src={handlePhotoUrl(item.channel.photo)} alt="" />
                                <p className="name">{item.channel.name}</p>
                                <p className="category">{item.channel.category}</p>
                            </div>
                        );
                    })
                }
                {
                    
                    props.items.map((item, i) => {
                        return (
                            <div onClick={() => handleClick(item.id)} className="channel-list-item" key={`top-talent-under-banner-list-item-${i}`}>
                                {
                                    item.live === 2 ? <div className="live"> Live </div> : ''
                                }
                                <img src={handlePhotoUrl(item.photo)} alt="" />
                                <p className="name">{item.name}</p>
                                <p className="category">{item.category}</p>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default TopTalents;