import { useContext, useEffect, useState } from "react";
import { LayoutContext } from '../../../utils/context/layout';
import { getCategories, getCategoryImage } from '../../../utils/services/request';
const CategoryListPage = () => {
    
    const [categoryList, setCategoryList] = useState([]);

    const layoutCtx = useContext(LayoutContext);

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
    return(
        <div className="category-list-page">
            {
                categoryList.map((item, index) => {
                    return (
                        <div className="category-list-item">
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