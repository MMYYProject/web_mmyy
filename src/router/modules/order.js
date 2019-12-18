/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/orderIndex',
  children: [
    {
      path: '/orderIndex',
      component: () => import('@/views/order/index'),
      name: '订单管理',
      meta: { title: '订单管理', icon: 'list', noCache: true }
    }
  ]
}

export default orderRouter
