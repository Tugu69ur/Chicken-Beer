import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Form, Input, Button, Typography, Row, Col, Card, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../../constants';
import DataTable from '../../components/ui/data-table';
import EmptyState from '../../components/ui/empty-state';
import Section from '../../components/ui/section';
import ConfirmDialog from '../../components/ui/confirm-dialog';
import { MapPin, Navigation } from 'lucide-react';

const { Title } = Typography;

function BranchControl() {
  const [form] = Form.useForm();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [47.918, 106.917],
      zoom: 13,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(mapInstance.current);

    mapInstance.current.on('click', function (e) {
      const { lat, lng } = e.latlng;
      setSelectedPosition([lat, lng]);

      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstance.current.removeLayer(layer);
        }
      });

      L.marker([lat, lng], { icon: defaultIcon })
        .addTo(mapInstance.current)
        .bindPopup('Selected location')
        .openPopup();
    });
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/branches`);
      setBranches(res.data);
    } catch (error) {
      message.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = async (values) => {
    if (!selectedPosition) {
      message.error('Please select a location on the map');
      return;
    }

    try {
      setAdding(true);
      await axios.post(`${BASE_URL}api/branches`, {
        ...values,
        position: selectedPosition,
      });
      message.success('New branch added');
      form.resetFields();
      setSelectedPosition(null);
      fetchBranches();
    } catch (error) {
      message.error(error.response?.data?.message || error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteBranch = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/branches/${id}`);
      message.success('Branch deleted');
      fetchBranches();
    } catch (error) {
      message.error(error.message);
    }
    setDeleteConfirm(null);
  };

  const columns = [
    { title: 'Branch Name', dataIndex: 'name', key: 'name', render: (text) => <span className="font-medium text-ink">{text}</span> },
    {
      title: 'Location', dataIndex: 'position', key: 'position',
      render: (pos) => (
        <span className="text-ink-muted text-sm font-mono">
          {pos ? `${pos[0].toFixed(4)}, ${pos[1].toFixed(4)}` : '—'}
        </span>
      ),
    },
    {
      title: 'Actions', key: 'action', width: 120,
      render: (_, record) => (
        <Button danger size="small" onClick={() => setDeleteConfirm(record)} className="rounded-full">
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Section title="Branch Management" subtitle="Add new branches and manage locations." />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={10}>
            <Card className="card-elevated border-0" title={
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-ink-muted" />
                <span className="text-sm font-semibold text-ink">Add New Branch</span>
              </div>
            }>
              <Form layout="vertical" form={form} onFinish={handleAddBranch}>
                <Form.Item label="Branch Name" name="name" rules={[{ required: true, message: 'Please enter branch name!' }]}>
                  <Input placeholder="e.g. Khoroolol Branch" />
                </Form.Item>

                <Form.Item label="Select Location">
                  <div
                    ref={mapRef}
                    style={{
                      height: '260px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid var(--color-surface-dim)',
                    }}
                  />
                  {selectedPosition && (
                    <p className="mt-2 text-xs text-ink-muted">
                      Selected: [{selectedPosition[0].toFixed(5)}, {selectedPosition[1].toFixed(5)}]
                    </p>
                  )}
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={adding} block className="rounded-full h-11">
                    Add Branch
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={14}>
            <Card className="card-elevated border-0" title={
              <div className="flex items-center gap-2">
                <Navigation size={16} className="text-ink-muted" />
                <span className="text-sm font-semibold text-ink">Registered Branches</span>
              </div>
            }>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spin size="large" />
                </div>
              ) : branches.length === 0 ? (
                <EmptyState title="No branches found" description="Add your first branch to get started." />
              ) : (
                <DataTable columns={columns} dataSource={branches} rowKey="_id" pagination={{ pageSize: 10 }} />
              )}
            </Card>
          </Col>
        </Row>

        <ConfirmDialog
          open={deleteConfirm !== null}
          title="Delete Branch?"
          description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
          onConfirm={() => handleDeleteBranch(deleteConfirm?._id)}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          danger
        />
      </div>
    </div>
  );
}

export default BranchControl;
