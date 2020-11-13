import { request, requestFd } from './request'
// import Qs from 'qs'
//= =====================登陆注册==========
// 注册
export function register (data) {
  return requestFd({
    url: '/my/register',
    data
  })
}
// 登录
export function login (data) {
  return requestFd({
    url: '/my/login',
    data
  })
}
// 退出
export function logout () {
  return request({
    url: '/my/logout'
  })
}
// ==============end 登陆注册
//= ============用户=========
// 其他用户 页面
export function othermessage (id) {
  return request({
    url: '/othermessage/' + id
  })
}

// 更新用户信息
export function updateMessgae (data, id) {
  return request({
    method: 'put',
    url: '/userMessgae/' + id,
    data
  })
}
// 上传头像
export function uploadAvatar (data) {
  return request({
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/upavatar',
    data
  })
}
//= ==================文章=======
// 发表文章
export function addArticle (data) {
  return requestFd({
    url: '/addArticle',
    data
  })
}

// 查询文章列表（登陆用户、其他用户）
export function articleList (id, params) {
  return request({
    url: '/articleList/' + id,
    params
  })
}
// 文章详情
export function articleDetail (id) {
  return request({
    url: '/articleDetail/' + id
  })
}
// 删除文章
export function deleteArticle (id) {
  return request({
    method: 'delete',
    url: '/article/' + id
  })
}
// 查询一篇文章的数据
export function article (id) {
  return request({
    url: '/article/' + id
  })
}
// 更新文章数据
export function updateArticle (data, id) {
  return request({
    method: 'put',
    url: '/article/' + id,
    data
  })
}
// ==================end 文章
//= ==================评论
// 发表评论
export function addComment (data) {
  return requestFd({
    url: '/comment',
    data
  })
}
// 删除评论
export function deleteComment (id) {
  return request({
    method: 'delete',
    url: '/comment/' + id
  })
}
// 用户评论
export function getComment (params) {
  return request({
    url: '/comment',
    params
  })
}
// 文章评论
export function articleComment (params) {
  return request({
    url: '/articleComment',
    params
  })
}
//= =======end评论
// 首页
export function getAllArticle (page) {
  return request({
    url: '/allArticle?time=' + +new Date(),
    params: {
      page
    }
  })
}
// 关键词
export function articleKey (params) {
  return request({
    url: '/articleKey',
    params: params
  })
}
// 时间
export function articleTime (params) {
  return request({
    url: '/articleTime',
    params: params
  })
}
