import { useNavigate } from "react-router-dom";
import { handlePhotoUrl } from "../../../utils/services/request";

const TopCategories: React.FC<{items: any[]}> = props => {

    const navigate = useNavigate();

    const handleItemClick = (id: any) => navigate(`/category/${id}`)
    return (
        <div className="top-categories">
            <h2>Top Categories</h2>

            <div className="category-list">
                {
                    props.items.map((item, i) => {
                        return (
                            <div onClick={() => handleItemClick(item.id)} className="list-item" key={`category-list-item-key-${i}`}>
                                <img src={handlePhotoUrl(item.photo)} alt="category thumbnail" />
                                <div className="info">
                                    <p>{item.title}</p>
                                    <p>500 views</p>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default TopCategories;