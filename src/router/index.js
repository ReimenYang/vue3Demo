import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home')
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/userCenter',
        component: () => import('@/views/userCenter'),
        children: [
            { path: '', redirect: 'login' }
            // { path: '/login', component: () => import('@/views/userCenter/login') }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/userCenter/login')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
