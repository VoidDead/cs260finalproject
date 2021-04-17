import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Spells from '../views/Spells.vue'
import CharacterCreator from '../views/CharacterCreator.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/charactercreator',
    name: 'CharacterCreator',
    component: CharacterCreator
  },
  {
    path: '/spells',
    name: 'Spells',
    component: Spells
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
