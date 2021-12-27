import AdminJs from 'adminjs';
import * as AdminJsExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import { db } from '../database';

AdminJs.registerAdapter(AdminJSSequelize);

const initAdminPanel = (database) => {
    const adminJs = new AdminJs({
        databases:[database],
        rootPath: '/admin'
    });

    //@ts-ignore
    const router = AdminJsExpress.buildRouter(adminJs);
    return router;
}

export default initAdminPanel;