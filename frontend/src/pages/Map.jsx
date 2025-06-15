import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "../assets/real.png";
import place from "../assets/logo1.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import { Row, Col, Card, Input } from "antd";
import Navbar from "../components/Navbar";

const { Search } = Input;

const userIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: markerShadowPng,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
  shadowSize: [41, 41],
  className: "round-icon",
});

const randomPlaces = [
  {
    name: "Наран Молл",
    position: [47.917, 106.906],
    img: place,
  },
  {
    name: "Зайсан Хилл",
    position: [47.879, 106.956],
    img: place,
  },
  {
    name: "Баруун 4 зам",
    position: [47.918, 106.895],
    img: place,
  },
  {
    name: "Шангри-Ла",
    position: [47.92, 106.918],
    img: place,
  },
  { name: "МУИС", position: [47.92, 106.915], img: place },
  {
    name: "Тэнгис кинотеатр",
    position: [47.919, 106.917],
    img: place,
  },
];

export default function SimpleMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [center] = useState([47.9181, 106.9175]);
  const [searchText, setSearchText] = useState("");

  const filteredPlaces = randomPlaces.filter((place) =>
    place.name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current, {
        center,
        zoom: 14,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance.current);

      randomPlaces.forEach((place) => {
        const popupContent = `
            <div style="text-align:center; max-width:200px;">
      <h3>${place.name}</h3>
      <img src="${place.img}" alt="${place.name}" style="width:100%; border-radius:8px; margin-bottom:8px;" />
        <button onclick="window.location.href='/'"  style="
        background-color: #D81E1E;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">Сонгох</button>
    </div>
  `;

        L.marker(place.position, { icon: userIcon })
          .addTo(mapInstance.current)
          .bindPopup(popupContent);
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <>
      <Navbar />
      <Row gutter={16} style={{ padding: "24px" }}>
        <Col span={16}>
          <div
            ref={mapRef}
            style={{
              height: "600px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          />
        </Col>
        <Col span={8}>
          <h2 style={{ marginBottom: "16px" }}>Салбарууд</h2>
          <Search
            placeholder="Хайх..."
            allowClear
            enterButton
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: "16px" }}
            className="custom-search"
          />

          {filteredPlaces.map((place, index) => (
            <Card
              key={index}
              style={{ marginBottom: "12px", backgroundColor: "#f9f9f9" }}
              hoverable
              size="small"
            >
              {place.name}
            </Card>
          ))}
        </Col>
      </Row>
    </>
  );
}
