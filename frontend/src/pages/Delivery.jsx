import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { BASE_URL } from '../../constants.js'
import { Typography, Steps, Card, Tag, Space, Badge, Spin, Empty, List, Image, Divider } from 'antd'

const { Title } = Typography

const STATUS_ORDER = ['pending', 'accepted', 'cooking', 'delivering', 'delivered']
const STATUS_COLORS = {
  pending: 'gold',
  accepted: 'blue',
  cooking: 'orange',
  delivering: 'purple',
  delivered: 'green',
}

function Delivery() {
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const phone = useMemo(() => {
    const saved = localStorage.getItem('trackPhone') || ''
    if (saved) return saved
    try {
      const rawUser = localStorage.getItem('user') || localStorage.getItem('currentUser')
      if (!rawUser) return ''
      const parsed = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser
      return (parsed && parsed.phone) ? String(parsed.phone) : ''
    } catch {
      return ''
    }
  }, [])

  const fetchAllOrders = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}api/orders`)
      if (res.data?.success && Array.isArray(res.data.orders)) {
        setAllOrders(res.data.orders)
      }
    } catch {
      // ignore errors
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  // No manual edit of phone; we read it from localStorage automatically

  const userOrders = useMemo(() => {
    if (!phone) return []
    return allOrders
      .filter((o) => (o.phone || '').trim() === phone.trim())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [allOrders, phone])

  const latestOrder = userOrders[0]

  useEffect(() => {
    if (!latestOrder) return
    if (latestOrder.status === 'delivered') return
    const id = setInterval(fetchAllOrders, 10000)
    return () => clearInterval(id)
  }, [latestOrder])

  // Search removed for simplicity; page auto-loads using saved phone

  const currentStepIndex = (status) => {
    const idx = STATUS_ORDER.indexOf(status || 'pending')
    return idx === -1 ? 0 : idx
  }

  return (
    <>
      <Navbar />
      <div className="p-10 max-w-6xl mx-auto min-h-screen">
        <Title level={2} className="mb-6">Track your delivery</Title>

        {/* Phone search removed; using saved phone from localStorage */}

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Spin size="large" tip="Loading orders..." />
          </div>
        ) : !phone ? (
          <Empty description="Enter your phone to view status" />
        ) : !latestOrder ? (
          <Empty description="No order found for this phone" />
        ) : (
          <Card
            className="mb-10"
            title={
              <Space align="center">
                <Badge color={STATUS_COLORS[latestOrder.status] || 'default'} />
                <span>Latest order status</span>
              </Space>
            }
            extra={
              <Tag color={STATUS_COLORS[latestOrder.status] || 'default'}>
                {(latestOrder.status || 'pending').toUpperCase()}
              </Tag>
            }
          >
            <Steps current={currentStepIndex(latestOrder.status)} responsive>
              <Steps.Step title="Pending" description="Order placed" />
              <Steps.Step title="Accepted" description="Restaurant accepted" />
              <Steps.Step title="Cooking" description="Being prepared" />
              <Steps.Step title="Delivering" description="On the way" />
              <Steps.Step title="Delivered" description="Completed" />
            </Steps>

            <Divider />
            <Title level={5} className="mb-4">Items</Title>
            <List
              dataSource={latestOrder.orders || []}
              rowKey={(item, idx) => `${latestOrder._id}-${idx}`}
              renderItem={(item) => (
                <List.Item>
                  <Space align="start" size={16}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={72}
                      height={54}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                      preview={false}
                      fallback="/fallback-image.png"
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      <div style={{ color: '#888' }}>{item.price} × {item.quantity}</div>
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        )}
      </div>
    </>
  )
}

export default Delivery