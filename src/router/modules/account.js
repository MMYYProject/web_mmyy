/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const accountRouter = {
  path: '/account',
  component: Layout,
  redirect: '/account/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/account/index'),
      name: '账户管理',
      meta: { title: '账户管理', icon: 'lock', noCache: true }
    }
  ]
}

export default accountRouter
