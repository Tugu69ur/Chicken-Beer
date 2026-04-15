import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "/assets/real.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import { Row, Col, Card, Input, Typography } from "antd";
import Navbar from "../components/Navbar";
import axios from "axios";
import { BASE_URL } from "../../constants.js";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Title, Paragraph } = Typography;

const userIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: markerShadowPng,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
  shadowSize: [41, 41],
  className: "round-icon",
});

export default function SimpleMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [center] = useState([47.9181, 106.9175]);
  const [searchText, setSearchText] = useState("");
  const [branches, setBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState(null);
  const navigate = useNavigate();

  const filteredPlaces = branches.filter((place) =>
    place.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectBranch = (branch) => {
    localStorage.setItem("selectedBranch", JSON.stringify(branch));
    localStorage.setItem("orderOption", "pickup");
    setActiveBranch(branch);
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
    if (!mapRef.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center,
      zoom: 14,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [center]);

  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    branches.forEach((place) => {
      const popupContent = document.createElement("div");
      popupContent.style.textAlign = "center";
      popupContent.style.maxWidth = "220px";
      popupContent.style.fontFamily = "Manrope, sans-serif";
      popupContent.style.color = "#1f2937";
      popupContent.innerHTML = `
          <h3 style="margin:0 0 8px; font-size:16px; font-weight:700;">${place.name}</h3>
          <img src="${place.img}" alt="${place.name}" style="width:100%; border-radius:12px; margin-bottom:10px; object-fit:cover; height:120px;" />
        `;

      const button = document.createElement("button");
      button.textContent = "Сонгох";
      button.style.backgroundColor = "#D81E1E";
      button.style.color = "white";
      button.style.border = "none";
      button.style.padding = "10px 16px";
      button.style.borderRadius = "999px";
      button.style.cursor = "pointer";
      button.style.fontWeight = "700";
      button.style.marginTop = "8px";
      button.onclick = () => handleSelectBranch(place);
      popupContent.appendChild(button);

      const marker = L.marker(place.position, { icon: userIcon })
        .addTo(mapInstance.current)
        .bindPopup(popupContent);

      markersRef.current.push(marker);
    });
  }, [branches]);

  useEffect(() => {
    if (activeBranch && mapInstance.current) {
      mapInstance.current.setView(activeBranch.position, 15, {
        animate: true,
      });
    }
  }, [activeBranch]);

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-[32px] bg-white/95 p-8 shadow-2xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#D81E1E]">Салбарын байршил</p>
              <Title level={2} className="mt-3 text-slate-950">
                Таны хамгийн ойр салбарууд
              </Title>
            </div>
          </div>
        </section>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-inner">
              <div className="h-[360px] sm:h-[480px] lg:h-[620px]" ref={mapRef} />
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <div className="space-y-5">
              <Card className="rounded-[28px] border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-[#D81E1E]">Филтер</p>
                    <Title level={4} className="mt-3 text-slate-950">
                      Салбар хайх
                    </Title>
                  </div>
                  <Search
                    placeholder="Салбарын нэрээр хайх"
                    allowClear
                    enterButton="Хайх"
                    size="large"
                    onChange={(e) => setSearchText(e.target.value)}
                    className="rounded-3xl"
                  />
                </div>
              </Card>

              <Card className="rounded-[28px] border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <Title level={5} className="mb-4 text-slate-950">
                  Салбарын жагсаалт
                </Title>
                <div className="space-y-4">
                  {filteredPlaces.length > 0 ? (
                    filteredPlaces.map((place, index) => (
                      <div
                        key={index}
                        className="rounded-[24px] border border-slate-200 bg-white p-4 transition hover:border-[#D81E1E] hover:shadow-lg"
                        onClick={() => {
                          setActiveBranch(place);
                          if (mapInstance.current) {
                            mapInstance.current.setView(place.position, 15, {
                              animate: true,
                            });
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{place.name}</p>
                            <p className="mt-1 text-sm text-slate-500">{place.address }</p>
                          </div>
                          <button
                            type="button"
                            className="rounded-full bg-[#D81E1E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#B11616]"
                            onClick={() => handleSelectBranch(place)}
                          >
                            Сонгох
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                      Хайлтад нийцсэн салбар олдсонгүй.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
