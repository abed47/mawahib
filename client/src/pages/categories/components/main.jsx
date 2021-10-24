import { useContext, useEffect, useState } from "react";
import { LayoutContext } from '../../../utils/context/layout';
import { getCategories, getCategoryImage } from '../../../utils/services/request';
import { useHistory } from 'react-router-dom';

const CategoryListPage = () => {
    
    const [categoryList, setCategoryList] = useState([]);

    const layoutCtx = useContext(LayoutContext);
    const history = useHistory();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        layoutCtx.showPreLoader();
        try {
            let cats = await getCategories();
            setCategoryList(cats.data);
            layoutCtx.hidPreLoader();
        } catch (err) {
            layoutCtx.hidPreLoader();
            layoutCtx.showSnackBar(err.message || 'error loading categories', 'error')
        }
    }

    const navigate = (path) => {
        history.push(path)
    }
    return(
        <div className="category-list-page">
            {
                categoryList.map((item, index) => {
                    return (
                        <div key={`category-list-item-${item.id}-${index}`} className="category-list-item" onClick={() => navigate(`/categories/${item.id}`)}>
                            <img src={getCategoryImage(item.photo)} alt="category logo" />
                            <h1>{item.name}</h1>
                        </div>
                    );
                })
            }
        </div>
    );
}
export default CategoryListPage;