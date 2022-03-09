import AdminJs from 'adminjs';
import * as AdminJsExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import * as CategoryHooks from './hooks/upload-category-image.hook';
import * as ProductHooks from './hooks/upload-product-image.hook';
import * as EventPhotoHooks from './hooks/upload-product-image.hook';
import * as EventCoverHooks from './hooks/upload-event-cover.hook';
import Category from '../database/models/category';
import { Product, Event } from '../database/models';

AdminJs.registerAdapter(AdminJSSequelize);

const initAdminPanel = (database) => {
    const adminJs = new AdminJs({
        databases:[database],
        resources: [
            {
                resource: Event,
                options: {
                    properties: {
                        prize_pool_description: {
                            type: 'richtext',
                            props: {
                                borderless: false,
                                quill: {
                                    bounds: 'string'
                                }
                            }
                        },
                        description: {
                            type: 'richtext',
                            props: {
                                borderless: false,
                                quill: {
                                    bounds: 'string'
                                }
                            }
                        },
                        photo: {
                            isVisible: { list: true, search: true, new: false, edit: false, view: true}
                        },
                        cover: {
                            isVisible: { list: true, search: true, new: false, edit: false, view: true}
                        },
                        uploadImage: {
                            components: {
                                edit: AdminJs.bundle('./components/event-photo-upload-photo.jsx')
                            },
                            isVisible: { list: false, search: false, new: true, edit: true, view: false}
                        },
                        uploadCover: {
                            components: {
                                edit: AdminJs.bundle('./components/event-cover-upload-photo.jsx')
                            },
                            isVisible: { list: false, search: false, new: true, edit: true, view: false}
                        }
                    },
                    actions: {
                        new: {
                            before: async (request, context) => {
                                const modifiedReq = await EventPhotoHooks.before(request, context);
                                return EventCoverHooks.before(modifiedReq, context);
                            },
                            after: async (response, request, context) => {
                                const modifiedRes = await EventPhotoHooks.after(response, request, context);
                                return EventCoverHooks.after(modifiedRes, request, context);
                            }
                        }
                    }
                }
            },
            {
                resource: Category,
                options: {
                    properties:{
                        
                        uploadImage: {
                            components:{
                                edit: AdminJs.bundle('./components/category-upload-photo.jsx'),
                            },
                            isVisible: {list: false, search: false, new: true, edit: true, view: false}
                        },
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