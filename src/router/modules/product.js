/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: 'noRedirect',
  name: '商品管理',
  meta: {
    title: '商品管理',
    icon: 'component'
  },
  children: [
    {
      path: 'add',
      component: () => import('@/views/product/add'),
      name: '添加商品',
      meta: { title: '添加商品', noCache: true }
    },
    {
      path: 'list',
      component: () => import('@/views/product/list'),
      name: '商品列表',
      meta: { title: '商品列表', noCache: true }
    }
  ]
}

export default productRouter
