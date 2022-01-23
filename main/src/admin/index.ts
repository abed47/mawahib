import AdminJs from 'adminjs';
import * as AdminJsExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import * as CategoryHooks from './hooks/upload-category-image.hook';
import Category from '../database/models/category';

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
            }
        ],
        rootPath: '/admin'
    });

    //@ts-ignore
    const router = AdminJsExpress.buildRouter(adminJs);
    return router;
}

export default initAdminPanel;