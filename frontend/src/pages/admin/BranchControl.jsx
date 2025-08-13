import {
  Form,
  Input,
  Button,
  Table,
  Typography,
  Row,
  Col,
  Card,
  Modal,
  Spin,
} from "antd";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../../constants";
import Navbar from "../../components/Navbar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIcon2xPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;
const { confirm } = Modal;

const BranchControl = () => {
  const [form] = Form.useForm();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const defaultIcon = new L.Icon({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIcon2xPng,
    shadowUrl: markerShadowPng,
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

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(mapInstance.current);

    mapInstance.current.on("click", function (e) {
      const { lat, lng } = e.latlng;
      setSelectedPosition([lat, lng]);

      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstance.current.removeLayer(layer);
        }
      });

      L.marker([lat, lng], { icon: defaultIcon })
        .addTo(mapInstance.current)
        .bindPopup("Сонгосон байршил")
        .openPopup();
    });
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/branches`);
      setBranches(res.data);
    } catch (error) {
      toast.error("Салбаруудыг татаж чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = async (values) => {
    if (!selectedPosition) {
      toast.error("Газрын зураг дээр салбарын байршлыг сонгоно уу!");
      return;
    }

    try {
      setAdding(true);
      await axios.post(`${BASE_URL}api/branches`, {
        ...values,
        position: selectedPosition,
      });
      toast.success("Шинэ салбар нэмэгдлээ.");
      form.resetFields();
      setSelectedPosition(null);
      fetchBranches();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteBranch = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/branches/${id}`);
      toast.success("Салбар амжилттай устлаа.");
      fetchBranches();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Салбарыг устгах уу?",
      icon: <ExclamationCircleOutlined />,
      content: "Энэ үйлдэл нь буцаж болдоггүй!",
      okText: "Тийм",
      okType: "danger",
      cancelText: "Үгүй",
      onOk: async () => {
        console.log("Deleting ID:", id); // Debug log
        await handleDeleteBranch(id);
      },
      onCancel() {
        console.log("Cancelled deletion");
      },
    });
  };

  const columns = [
    {
      title: "Салбарын нэр",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Үйлдэл",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => handleDeleteBranch(record._id)}>
          Устгах
        </Button>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 max-w-[1500px] w-full mx-auto">
        <Title level={2}>Салбар Удирдах</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Шинэ Салбар Нэмэх" variant="outlined">
              <Form layout="vertical" form={form} onFinish={handleAddBranch}>
                <Form.Item
                  label="Салбарын нэр"
                  name="name"
                  rules={[
                    { required: true, message: "Салбарын нэр оруулна уу!" },
                  ]}
                >
                  <Input placeholder="Жишээ: Хороолол салбар" />
                </Form.Item>

                <Form.Item>
                  <div
                    ref={mapRef}
                    style={{
                      height: "300px",
                      borderRadius: "12px",
                      marginTop: "0.5rem",
                    }}
                    className="shadow"
                  />
                  {selectedPosition && (
                    <p className="mt-2 text-sm text-gray-600">
                      Сонгосон байршил: [{selectedPosition[0].toFixed(5)},{" "}
                      {selectedPosition[1].toFixed(5)}]
                    </p>
                  )}
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    loading={adding}
                    block
                  >
                    Салбар нэмэх
                  </Button>

                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Бүртгэлтэй Салбарууд" variant="outlined">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spin size="large" />
                </div>
              ) : (
                                <Table
                  dataSource={branches}
                  columns={columns}
                  rowKey="_id"
                  pagination={{ pageSize: 5 }}
                  size="small"
                  scroll={{ x: true }}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BranchControl;
