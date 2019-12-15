/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const shopRouter = {
  path: '/shop',
  component: Layout,
  redirect: '/shop/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/shop/index'),
      name: '店铺装修',
      meta: { title: '店铺装修', icon: 'shopping', noCache: true }
    }
  ]
}

export default shopRouter
