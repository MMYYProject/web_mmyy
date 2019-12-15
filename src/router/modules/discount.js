/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const discountRouter = {
  path: '/discount',
  component: Layout,
  redirect: 'noRedirect',
  name: '优惠设置',
  meta: {
    title: '优惠设置',
    icon: 'money'
  },
  children: [
    {
      path: 'add',
      component: () => import('@/views/discount/add'),
      name: '优惠券添加',
      meta: { title: '优惠券添加', noCache: true }
    },
    {
      path: 'manage',
      component: () => import('@/views/discount/manage'),
      name: '优惠券管理',
      meta: { title: '优惠券管理', noCache: true }
    }
  ]
}

export default discountRouter
