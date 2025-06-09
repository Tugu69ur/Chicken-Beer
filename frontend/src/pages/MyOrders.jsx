import React, { useEffect, useState } from "react";
import { List, Card, Typography, Divider, Empty, Modal, InputNumber, Button, message } from "antd";
import { DeleteOutlined, EditOutlined, ShoppingCartOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import Navbar from "../components/Navbar";

const { Title, Text } = Typography;

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  const calculateTotal = () => {
    return orders.reduce((total, order) => {
      const cleanPrice = Number(order.price.replace(/[,₮]/g, "")) || 0;
      return total + (cleanPrice * order.quantity);
    }, 0);
  };

  const handleEdit = (order) => {
    setEditingOrder({ ...order });
  };

  const handleSaveEdit = () => {
    if (editingOrder) {
      const updatedOrders = orders.map(order => 
        order.name === editingOrder.name ? editingOrder : order
      );
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      setEditingOrder(null);
      message.success("Захиалга амжилттай шинэчлэгдлээ");
    }
  };

  const handleDelete = (order) => {
    setDeleteConfirmOrder(order);
  };

  const confirmDelete = () => {
    if (deleteConfirmOrder) {
      const updatedOrders = orders.filter(order => order.name !== deleteConfirmOrder.name);
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      setDeleteConfirmOrder(null);
      message.success("Захиалга амжилттай устгагдлаа");
    }
  };

  const handleQuantityChange = (order, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedOrders = orders.map(item => 
      item.name === order.name ? { ...item, quantity: newQuantity } : item
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  if (!Array.isArray(orders) || orders.length === 0)
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Empty 
            description="Таны сагс хоосон байна" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button 
            type="primary" 
            size="large"
            icon={<ShoppingCartOutlined />}
            className="mt-4"
            onClick={() => window.location.href = '/'}
          >
            Захиалга хийх
          </Button>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="p-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="!mb-0">
            Таны сагс
          </Title>
          <Text className="text-lg">
            Нийт: <span className="font-bold text-red-600">{calculateTotal().toLocaleString()}₮</span>
          </Text>
        </div>

        <List
          grid={{ gutter: 24, column: 1 }}
          dataSource={orders}
          renderItem={(order, index) => {
            const cleanPrice = Number(order.price.replace(/[,₮]/g, "")) || 0;
            const total = cleanPrice * order.quantity;

            return (
              <List.Item key={index}>
                <Card 
                  bordered 
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <img
                        src={order.image}
                        alt={order.name}
                        width={120}
                        height={120}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                      <div>
                        <Text strong className="text-lg">{order.name}</Text>
                        <br />
                        <Text type="secondary" className="text-base">
                          {order.price} × {order.quantity}
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Button 
                          icon={<MinusOutlined />}
                          onClick={() => handleQuantityChange(order, order.quantity - 1)}
                          disabled={order.quantity <= 1}
                        />
                        <Text strong className="text-lg min-w-[40px] text-center">
                          {order.quantity}
                        </Text>
                        <Button 
                          icon={<PlusOutlined />}
                          onClick={() => handleQuantityChange(order, order.quantity + 1)}
                        />
                      </div>
                      <Text strong className="text-lg min-w-[120px] text-right">
                        {total.toLocaleString()}₮
                      </Text>
                      <div className="flex gap-2">
                        <Button 
                          type="primary" 
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(order)}
                        >
                          Засах
                        </Button>
                        <Button 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(order)}
                        >
                          Устгах
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />

        <Card className="mt-6">
          <div className="flex justify-between items-center">
            <div>
              <Text strong className="text-lg">Нийт захиалга:</Text>
              <Text className="ml-2">{orders.length} ширхэг</Text>
            </div>
            <div className="flex items-center gap-4">
              <Text strong className="text-xl">Нийт дүн:</Text>
              <Text strong className="text-2xl text-red-600">
                {calculateTotal().toLocaleString()}₮
              </Text>
            </div>
          </div>
          <Divider />
          <div className="flex justify-end gap-4">
            <Button 
              size="large"
              onClick={() => window.location.href = '/'}
            >
              Үргэлжлүүлэх
            </Button>
            <Button 
              type="primary" 
              size="large"
              onClick={() => message.success("Захиалга амжилттай илгээгдлээ")}
            >
              Захиалга хийх
            </Button>
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        title="Захиалга засах"
        open={editingOrder !== null}
        onOk={handleSaveEdit}
        onCancel={() => setEditingOrder(null)}
        okText="Хадгалах"
        cancelText="Болих"
      >
        {editingOrder && (
          <div className="space-y-4">
            <div>
              <Text strong>Бүтээгдэхүүн:</Text>
              <Text className="ml-2">{editingOrder.name}</Text>
            </div>
            <div>
              <Text strong>Тоо ширхэг:</Text>
              <InputNumber
                min={1}
                value={editingOrder.quantity}
                onChange={(value) => setEditingOrder({ ...editingOrder, quantity: value })}
                className="ml-2"
              />
            </div>
            <div>
              <Text strong>Нэгж үнэ:</Text>
              <Text className="ml-2">{editingOrder.price}</Text>
            </div>
            <div>
              <Text strong>Нийт үнэ:</Text>
              <Text className="ml-2">
                {(Number(editingOrder.price.replace(/[,₮]/g, "")) * editingOrder.quantity).toLocaleString()}₮
              </Text>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Захиалга устгах"
        open={deleteConfirmOrder !== null}
        onOk={confirmDelete}
        onCancel={() => setDeleteConfirmOrder(null)}
        okText="Тийм"
        cancelText="Үгүй"
      >
        <p>Та {deleteConfirmOrder?.name} захиалгыг устгахдаа итгэлтэй байна уу?</p>
      </Modal>
    </>
  );
}

export default MyOrders;
