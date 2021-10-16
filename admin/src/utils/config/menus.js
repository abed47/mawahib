
const Permissions = {
    ADMIN: [true, true, true],
    MODERATOR: [true, true, true],
    EDITORIAL: [true, true, true]
}

export const sidenav = [
    {
        path: '/',
        icon: 'grid',
        title: 'Dashboard',
        permissions: Permissions.ADMIN
    },
    {
        path: '/categories',
        icon: 'list-outline',
        title: 'Categories',
        permissions: Permissions.ADMIN
    }
]

