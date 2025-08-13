import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "../assets/real.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import { Row, Col, Card, Input } from "antd";
import Navbar from "../components/Navbar";
import axios from "axios";
import { BASE_URL } from "../../constants.js";
import { useNavigate } from "react-router-dom";

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

export default function SimpleMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [center] = useState([47.9181, 106.9175]);
  const [searchText, setSearchText] = useState("");
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  const filteredPlaces = branches.filter((place) =>
    place.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handler for selecting a branch
  const handleSelectBranch = (branch) => {
    localStorage.setItem("selectedBranch", JSON.stringify(branch));
    localStorage.setItem("orderOption", "pickup");
    navigate("/");
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/branches`);
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

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

      branches.forEach((place) => {
        const popupContent = document.createElement("div");
        popupContent.style.textAlign = "center";
        popupContent.style.maxWidth = "200px";
        popupContent.innerHTML = `
          <h3>${place.name}</h3>
          <img src="${place.img}" alt="${place.name}" style="width:100%; border-radius:8px; margin-bottom:8px;" />
        `;
        const button = document.createElement("button");
        button.textContent = "Сонгох";
        button.style.backgroundColor = "#D81E1E";
        button.style.color = "white";
        button.style.border = "none";
        button.style.padding = "8px 16px";
        button.style.borderRadius = "6px";
        button.style.cursor = "pointer";
        button.style.fontWeight = "600";
        button.onclick = () => handleSelectBranch(place);
        popupContent.appendChild(button);

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
  }, [branches]);

  return (
    <>
      <Navbar />
      <Row gutter={[16, 16]} className="px-4 sm:px-6 md:px-8 lg:px-12 py-4">
        <Col xs={24} md={16}>
          <div
            ref={mapRef}
            className="h-[320px] sm:h-[420px] md:h-[600px] rounded-[12px] overflow-hidden shadow"
          />
        </Col>
        <Col xs={24} md={8} className="mt-2 md:mt-0">
          <h2 className="text-lg sm:text-xl mb-4">Салбарууд</h2>
          <Search
            placeholder="Хайх..."
            allowClear
            enterButton
            onChange={(e) => setSearchText(e.target.value)}
            className="mb-4"
          />

          <div className="space-y-3">
            {filteredPlaces.map((place, index) => (
              <Card
                key={index}
                style={{ backgroundColor: "#f9f9f9" }}
                hoverable
                size="small"
                onClick={() => {
                  if (mapInstance.current) {
                    mapInstance.current.setView(place.position, 14);
                  }
                }}
              >
                {place.name}
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </>
  );
}
