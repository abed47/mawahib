import AdminJs from 'adminjs';
import * as AdminJsExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import * as CategoryHooks from './hooks/upload-category-image.hook';
import * as ProductHooks from './hooks/upload-product-image.hook';
import Category from '../database/models/category';
import { Product } from '../database/models';

AdminJs.registerAdapter(AdminJSSequelize);

const initAdminPanel = (database) => {
    const adminJs = new AdminJs({
        databases:[database],
        resources: [
            {
                resource: Category,
                options: {
                    properties:{
                        
                        uploadImage: {
                            components:{
                                edit: AdminJs.bundle('./components/category-upload-photo.jsx'),
                            },
                            isVisible: {list: false, search: false, new: true, edit: true, view: false}
                        }
                    },
                    actions: {
                        new: {
                            after: CategoryHooks.after,
                            before: CategoryHooks.before
                        }
                    }
                }
            },
            {
                resource: Product,
                options: {
                    properties:{
                        
                        uploadImage: {
                            components:{
                                edit: AdminJs.bundle('./components/product-upload-photo.jsx'),
                            },
                            isVisible: {list: false, search: false, new: true, edit: true, view: false}
                        },
                        photo: {
                            isVisible: {list: true, search: true, new: false, edit: false, view: true}
                        }
                    },
                    actions: {
                        new: {
                            after: ProductHooks.after,
                            before: ProductHooks.before
                        }
                    }
                }
            }
        ],
        rootPath: '/admin'
    });

    //@ts-ignore
    const router = AdminJsExpress.buildRouter(adminJs);
    return router;
}

export default initAdminPanel;