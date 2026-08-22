import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from '/assets/real.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import { Row, Col, Card, Input, Typography } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Navigation } from 'lucide-react';

const { Search: AntSearch } = Input;
const { Title, Paragraph } = Typography;

const userIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: markerShadowPng,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
  shadowSize: [41, 41],
  className: 'round-icon',
});

function Map() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [center] = useState([47.9181, 106.9175]);
  const [searchText, setSearchText] = useState('');
  const [branches, setBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState(null);
  const navigate = useNavigate();

  const filteredPlaces = branches.filter((place) =>
    place.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectBranch = (branch) => {
    localStorage.setItem('selectedBranch', JSON.stringify(branch));
    localStorage.setItem('orderOption', 'pickup');
    setActiveBranch(branch);
    navigate('/');
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/branches`);
        setBranches(response.data);
      } catch (error) {
        console.error('Error fetching branches:', error);
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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
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
      const popupContent = document.createElement('div');
      popupContent.style.textAlign = 'center';
      popupContent.style.maxWidth = '220px';
      popupContent.style.fontFamily = 'Inter, sans-serif';
      popupContent.style.color = '#1f2937';
      popupContent.innerHTML = `
        <h3 style="margin:0 0 8px; font-size:14px; font-weight:700;">${place.name}</h3>
        <img src="${place.img}" alt="${place.name}" style="width:100%; border-radius:10px; margin-bottom:10px; object-fit:cover; height:100px;" />
      `;

      const button = document.createElement('button');
      button.textContent = 'Select Branch';
      button.style.backgroundColor = '#9f1239';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.padding = '10px 16px';
      button.style.borderRadius = '9999px';
      button.style.cursor = 'pointer';
      button.style.fontWeight = '600';
      button.style.marginTop = '8px';
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
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-red mb-2">
            <Navigation size={14} />
            Locations
          </div>
          <Title level={2} className="!mb-2 text-ink">
            Our Branches
          </Title>
          <Paragraph type="secondary" className="text-base">
            Find the nearest Chicken2030 branch and place your order for pickup.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="bg-white rounded-2xl border border-surface-dim overflow-hidden shadow-sm">
              <div className="h-[360px] sm:h-[480px] lg:h-[560px]" ref={mapRef} />
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <div className="space-y-5">
              <Card className="card-elevated border-0">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-red mb-2">
                      <Search size={12} />
                      Filter
                    </div>
                    <Title level={4} className="!mb-0 text-ink">Find a Branch</Title>
                  </div>
                  <Input
                    placeholder="Search by branch name"
                    size="large"
                    prefix={<Search size={16} className="text-ink-muted" />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </Card>

              <Card className="card-elevated border-0">
                <Title level={5} className="!text-ink !mb-4">Branch List</Title>
                <div className="space-y-3">
                  {filteredPlaces.length > 0 ? (
                    filteredPlaces.map((place, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl border border-surface-dim p-4 cursor-pointer hover:shadow-md hover:border-brand-red/30 transition-all duration-200"
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
                          <div className="min-w-0 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red-soft flex-shrink-0">
                              <MapPin size={18} className="text-brand-red" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-ink truncate">{place.name}</p>
                              <p className="mt-0.5 text-xs text-ink-muted truncate">{place.address}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectBranch(place);
                            }}
                            className="flex-shrink-0 btn btn-primary btn-sm"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-surface-dim bg-surface-muted p-8 text-sm text-ink-muted text-center">
                      No branches found matching your search.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Map;
