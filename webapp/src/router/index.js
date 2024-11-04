import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/incidents' 
    },
    {
      path: '/incidents',
      name: 'incidents',
      component: () => import('../views/incidents/Incidents.vue'),
    },
    {
      path: '/incidents/:incident_id/:cause/:sourceN1/:sourceN2',
      name: 'details',
      component: () => import('../views/incidents/Details.vue'),
      props: true
    },
    {
      path: '/war_rooms/:incident_id',
      name: 'war_rooms',
      component: () => import('../views/war_rooms/WarRooms.vue'),
      props: true
    },

   {
      path: '/subscriptions',
      name: 'subscripcions',
      component: () => import('../views/subcriptions/Subcriptions.vue')
    },   
  ]
})

export default router
