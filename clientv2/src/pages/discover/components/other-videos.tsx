import { useNavigate } from "react-router-dom";
import { handlePhotoUrl } from "../../../utils/services/request";

const OtherVideos: React.FC<{items: any[]}> = props => {

    const navigate = useNavigate();

    const handleItemClick = (id: any) => navigate(`/watch/${id}`);

    return (
        <div className="other-videos">
            <h2>Other</h2>

            <div className="other-video-list">
                {
                    props.items.map(((item, i) => {
                        return (
                            <div onClick={() => handleItemClick(item.id)} className="list-item" key={`other-video-list-item-${i}`}>
                                <img src={handlePhotoUrl(item.thumbnail)} alt="" />

                                <div className="info">
                                    <p className="title">
                                        {item.title}
                                    </p>

                                    <div className="row">
                                        <p className="channel">
                                            {item.channel}
                                        </p>
                                        <p className="views">
                                            {item.views} views
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    }))
                }
            </div>
        </div>
    );
}

export default OtherVideos;