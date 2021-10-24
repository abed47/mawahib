import { Route } from 'react-router-dom';
import CategoryPage from './components/category';
import CategoryListPage from './components/main';

const CategoriesPage = () => {
    return <>
        <Route path="/categories" exact component={CategoryListPage} />
        <Route path="/categories/:id" exact component={CategoryPage} />
    </>
}
export default CategoriesPage;