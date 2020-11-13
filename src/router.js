import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import userCenter from './views/UserCenter'
import AddArticle from './views/AddArticle'
import ArticleDetail from './views/ArticleDetail'
import ArticleAside from './views/ArticleAside'
import CommentAside from './views/CommentAside'
import UserMessage from './views/UserMessage'
import OtherMessage from './views/OtherMessage'

// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location, onResolve, onReject) {
//   try {
//     return originalPush.call(this, location, onResolve, onReject)
//   } catch (err) {
//     return originalPush.call(this, location).catch(err => err)
//   }
// }

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/addArticle',
      name: 'addArticle',
      component: AddArticle
    },
    {
      path: '/userCenter',
      name: 'userCenter',
      component: userCenter,
      children: [
        {
          path: 'myArticle',
          component: ArticleAside
        }, {
          path: 'myComment',
          component: CommentAside
        }
      ]
    }, {
      path: '/articleDetail/:id',
      name: 'articleDetail',
      component: ArticleDetail

    },
    {
      path: '/userMessage',
      name: 'userMessage',
      component: UserMessage
    },
    {
      path: '/otherMessage/:id',
      name: 'otherMessage',
      component: OtherMessage
    }
  ]
})
