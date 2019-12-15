/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const metricsRouter = {
  path: '/metrics',
  component: Layout,
  redirect: '/metrics/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/metrics/index'),
      name: '数据统计',
      meta: { title: '数据统计', icon: 'table', noCache: true }
    }
  ]
}

export default metricsRouter
