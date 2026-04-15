import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { BASE_URL } from '../../constants.js'
import { Typography, Steps, Card, Tag, Space, Badge, Spin, Empty, List, Image, Divider, Button, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const STATUS_ORDER = ['pending', 'accepted', 'cooking', 'delivering', 'delivered']
const STATUS_COLORS = {
  pending: 'gold',
  accepted: 'blue',
  cooking: 'orange',
  delivering: 'purple',
  delivered: 'green',
}

function getSavedPhone() {
  const saved = localStorage.getItem('trackPhone') || ''
  if (saved) return saved
  try {
    const rawUser = localStorage.getItem('user') || localStorage.getItem('currentUser')
    if (!rawUser) return ''
    const parsed = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser
    return parsed?.phone ? String(parsed.phone) : ''
  } catch {
    return ''
  }
}

function Delivery() {
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState(getSavedPhone)
  const [searchPhone, setSearchPhone] = useState('')
  const navigate = useNavigate()

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

  const handleSearch = () => {
    const normalized = searchPhone.trim()
    if (!/^[0-9]{8}$/.test(normalized)) {
      message.error('Утасны дугаар 8 оронтой байх ёстой')
      return
    }
    setPhone(normalized)
    localStorage.setItem('trackPhone', normalized)
    message.success('Утасны дугаар хадгалагдлаа')
  }

  const handleClearPhone = () => {
    setPhone('')
    setSearchPhone('')
    localStorage.removeItem('trackPhone')
  }

  const userOrders = useMemo(() => {
    if (!phone) return []
    return allOrders
      .filter((o) => (o.phone || '').trim() === phone.trim())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [allOrders, phone])

  const latestOrder = userOrders[0]

  useEffect(() => {
    if (!latestOrder || latestOrder.status === 'delivered') return
    const id = setInterval(fetchAllOrders, 50000)
    return () => clearInterval(id)
  }, [latestOrder])

  const currentStepIndex = (status) => {
    const idx = STATUS_ORDER.indexOf(status || 'pending')
    return idx === -1 ? 0 : idx
  }

  const orderDate = latestOrder?.createdAt
    ? new Date(latestOrder.createdAt).toLocaleString('mn-MN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  const totalAmount = latestOrder?.orders?.reduce((sum, item) => {
    const price = parseInt(String(item.price).replace(/[^\d]/g, ''), 10) || 0
    return sum + price * (item.quantity || 1)
  }, 0) || 0

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(216,29,30,0.12),transparent_24%),linear-gradient(180deg,#fffaf6_0%,#f8f2ee_55%,#fff_100%)] pb-16">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10 rounded-[32px] bg-white/95 p-8 shadow-2xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#D81E1E]">Захиалгын явц</p>
              <Title level={2} className="mt-3 text-slate-950">
                Таны захиалгын төлөв
              </Title>
            </div>
            {phone ? (
              <Tag className="rounded-full border border-[#D81E1E]/15 bg-[#fff1f0] px-4 py-2 text-sm font-semibold text-[#D81E1E]">
                {"+976 "+phone}
              </Tag>
            ) : null}
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.25fr_1fr]">
          <Card className="rounded-[32px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Spin size="large" tip="Захиалгын мэдээлэл ачааллаж байна..." />
              </div>
            ) : !phone ? (
              <div className="flex min-h-[320px] flex-col justify-center gap-6">
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <Title level={4} className="text-slate-900">Утасны дугаараа оруулна уу</Title>
                  <Paragraph className="max-w-lg mx-auto text-slate-600">
                    Захиалгын статусыг харахын тулд 8 оронтой утасны дугаараа оруулна уу.
                  </Paragraph>
                </div>
                <div className="grid gap-4 sm:grid-cols-[1.5fr_0.7fr]">
                  <Input
                    size="large"
                    placeholder="8 оронтой утасны дугаар"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                  />
                  <Button type="primary" size="large" onClick={handleSearch}>
                    Хайх
                  </Button>
                </div>
              </div>
            ) : !latestOrder ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 text-center">
                <Empty description="Таны утасны дугаарт захиалга олдсонгүй" />
                <Paragraph className="max-w-md text-slate-600">
                  Та захиалга хийсний дараа захиалтын статус энд харагдана. Утасны дугаараа өөрчлөх бол доорх товчийг дарна уу.
                </Paragraph>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button type="primary" danger onClick={() => navigate('/')}>
                    Захиалга хийх
                  </Button>
                  <Button onClick={handleClearPhone}>Утасны дугаар солих</Button>
                </div>
              </div>
            ) : (
              <div>
                <Card
                  className="mb-8 rounded-[28px] border border-[#F0E3DF] bg-[#fff7f3] p-6"
                  title={
                    <Space align="center">
                      <Badge color={STATUS_COLORS[latestOrder.status] || 'default'} />
                      <span className="font-semibold">Захиалгын мэдээлэл</span>
                    </Space>
                  }
                  extra={
                    <Tag color={STATUS_COLORS[latestOrder.status] || 'default'}>
                      {(latestOrder.status || 'pending').toUpperCase()}
                    </Tag>
                  }
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Захиалга</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">#{latestOrder._id?.slice(-6) || '---'}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Захиалсан</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{orderDate}</p>
                    </div>
                  </div>
                </Card>

                <Steps current={currentStepIndex(latestOrder.status)} responsive>
                  <Steps.Step title="Хүлээгдэж байна" description="Захиалга өгсөн" />
                  <Steps.Step title="Хүлээн авсан" description="Салбар хүлээн авсан" />
                  <Steps.Step title="Бэлтгэж байна" description="Захиалга бэлтгэж байна" />
                  <Steps.Step title="Ачаалах" description="Хүргэлтийн ажилтан явж байна" />
                  <Steps.Step title="Дууссан" description="Захиалга дууссан" />
                </Steps>

                <Divider />
                <Title level={5} className="mb-4 text-slate-900">
                  Захиалгын дэлгэрэнгүй
                </Title>
                <List
                  dataSource={latestOrder.orders || []}
                  rowKey={(item, idx) => `${latestOrder._id}-${idx}`}
                  renderItem={(item) => (
                    <List.Item className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                      <Space align="start" size={16}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={60}
                          style={{ objectFit: 'cover', borderRadius: 12 }}
                          preview={false}
                          fallback="/fallback-image.png"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-500">{item.price} × {item.quantity}</p>
                        </div>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </Card>

          <Card className="w-full rounded-[32px] border border-slate-200 bg-[#fff4ed] shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <div className="space-y-6">
              <div>
                <Title level={4}>Товч мэдээлэл</Title>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Нийт захиалга</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{userOrders.length}</p>
                </div>
                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Сүүлийн захиалгын дүн</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{totalAmount.toLocaleString()} ₮</p>
                </div>
                <div className="rounded-[24px] bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Сүүлд шинэчилсэн</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{latestOrder ? orderDate : '---'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Delivery