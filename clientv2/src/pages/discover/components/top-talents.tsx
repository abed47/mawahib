import { useNavigate } from "react-router-dom";
import { handlePhotoUrl } from "../../../utils/services/request";

const TopTalents: React.FC<{items: any[]}> = props => {

    const navigate = useNavigate();

    const handleClick = (id: any) => {
        navigate(`/channel/${id}`);
    }
    return (
        <div className="top-talents">
            <h2>Top Talents</h2>

            <div className="channel-list">
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