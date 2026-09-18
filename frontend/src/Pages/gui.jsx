import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, FeatureGroup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import indiaGeoJson from "../assets/akhandbharat.json";
import indiaStatesGeoJson from "../assets/chal.json";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "./gui.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api/config";
import {
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  AccountBalance,
  Refresh,
  Polyline,
  ArrowForward,
  Layers,
  LocationOn,
  Clear,
  ZoomOutMap,
} from "@mui/icons-material";

// Custom Water Reservoir Marker Icon
const damPinIcon = L.divIcon({
  className: "custom-dam-marker",
  html: `
    <div style="
      background: linear-gradient(135deg, #1B3B6F 0%, #274C77 100%);
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #FFFFFF;
      box-shadow: 0 4px 10px rgba(27, 59, 111, 0.4);
    ">
      <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Helper component that automatically handles Leaflet size invalidation and bounds fitting
function MapController({ fitBoundsCoords, resetKey }) {
  const map = useMap();

  useEffect(() => {
    const applyFit = () => {
      map.invalidateSize();
      if (fitBoundsCoords) {
        map.fitBounds(fitBoundsCoords, {
          padding: [35, 25],
          maxZoom: 6,
        });
      }
    };

    // Immediate and slightly delayed invocation to handle layout mount
    applyFit();
    const timer = setTimeout(applyFit, 150);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [map, fitBoundsCoords, resetKey]);

  return null;
}

const Gui = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [polygonSelected, setPolygonSelected] = useState(false);
  const [fetchingDams, setFetchingDams] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // GeoJSON coordinates are [longitude, latitude].
  // Full world bounds ensure the background mask seamlessly blankets the entire globe outside India.
  const worldBounds = [
    [-180, -85.0511],
    [180, -85.0511],
    [180, 85.0511],
    [-180, 85.0511],
    [-180, -85.0511],
  ];

  const styleMask = {
    fillColor: "rgb(227, 235, 238)",
    color: "#000",
    fillOpacity: 1,
    weight: 0,
  };

  const mask = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            worldBounds,
            ...indiaGeoJson.features.flatMap((f) =>
              f.geometry.type === "Polygon"
                ? f.geometry.coordinates
                : f.geometry.coordinates.flat()
            ),
          ],
        },
      },
    ],
  };

  // Target bounding box representing all of India with comfortable headroom for markers
  const indiaFitBounds = [
    [6.5, 68.0],
    [37.8, 97.5],
  ];

  // Restricts panning so user doesn't drift away from India, with safe margins around borders
  const indiaMaxBounds = [
    [3.5, 63.0],
    [40.0, 103.0],
  ];
  const navigate = useNavigate();

  const fetchCoordinates = async () => {
    setFetchingDams(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/dam`);

      if (Array.isArray(response.data.data)) {
        const coords = response.data.data.map((dam) => ({
          latitude: dam.latitude,
          longitude: dam.longitude,
          name: dam.name,
          damId: dam.id,
        }));
        setCoordinates(coords);
      }
    } catch (error) {
      console.error("Error fetching dam coordinates:", error);
    } finally {
      setFetchingDams(false);
    }
  };

  useEffect(() => {
    fetchCoordinates();
  }, []);

  const handlePolygonCreated = (e) => {
    const layer = e.layer;
    if (layer instanceof L.Polygon) {
      const latLngs = layer.getLatLngs()[0];
      const coords = latLngs.map((latLng) => [latLng.lat, latLng.lng]);
      setPolygonCoordinates(coords);
      setPolygonSelected(true);
    }
  };

  const handleClearPolygon = () => {
    setPolygonCoordinates([]);
    setPolygonSelected(false);
  };

  const handleNavigate = () => {
    navigate(`/polygon/coordinates=${encodeURIComponent(JSON.stringify(polygonCoordinates))}`);
  };

  return (
    <div className="page-wrapper">
      <div className="map-page-wrapper">
        {/* Page Header */}
        <div className="map-header-card">
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1} sx={{ mb: 1 }}>
            <Box>
              <Chip
                icon={<Layers sx={{ fontSize: "0.9rem !important" }} />}
                label="National Hydro-Telemetry Workspace"
                size="small"
                sx={{
                  bgcolor: "rgba(39, 76, 119, 0.08)",
                  color: "#274C77",
                  fontWeight: 600,
                  mb: 1,
                  fontSize: "0.72rem",
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#1B3B6F", letterSpacing: "-0.5px" }}>
                Interactive Dams & Reservoir Map
              </Typography>
            </Box>
            <Chip
              label={`${coordinates.length} Dams Monitored`}
              color="primary"
              variant="outlined"
              sx={{ borderColor: "#274C77", color: "#274C77", fontWeight: 600 }}
            />
          </Stack>
          <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 820 }}>
            Inspect real-time dam locations across India. Click any marker to view live water storage volume and telemetry analytics, or use the drawing tool on the left to enclose a custom command area polygon.
          </Typography>
        </div>

        {/* Controls Bar */}
        <div className="map-controls-bar">
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#274C77" }}>
              Map Tools:
            </Typography>
            <Chip
              icon={<LocationOn sx={{ fontSize: "0.85rem !important" }} />}
              label="Click marker for telemetry"
              size="small"
              variant="outlined"
              sx={{ borderColor: "#CBD5E1", fontSize: "0.75rem" }}
            />
            <Chip
              icon={<Polyline sx={{ fontSize: "0.85rem !important" }} />}
              label="Draw polygon tool enabled"
              size="small"
              variant="outlined"
              sx={{ borderColor: "#CBD5E1", fontSize: "0.75rem" }}
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
            {polygonSelected && (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<Clear />}
                  onClick={handleClearPolygon}
                  sx={{ borderRadius: "8px", textTransform: "none" }}
                >
                  Clear Selection
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={handleNavigate}
                  sx={{
                    bgcolor: "#0284C7",
                    "&:hover": { bgcolor: "#0369A1" },
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  View Polygon Details ({polygonCoordinates.length} vertices)
                </Button>
              </>
            )}

            <Button
              variant="outlined"
              size="small"
              startIcon={<ZoomOutMap />}
              onClick={() => setResetKey((k) => k + 1)}
              sx={{
                borderColor: "#CBD5E1",
                color: "#274C77",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { borderColor: "#274C77", bgcolor: "rgba(39, 76, 119, 0.04)" },
              }}
            >
              Reset View
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={fetchingDams ? <CircularProgress size={14} color="inherit" /> : <Refresh />}
              onClick={() => {
                fetchCoordinates();
                setResetKey((k) => k + 1);
              }}
              disabled={fetchingDams}
              sx={{
                bgcolor: "#274C77",
                "&:hover": { bgcolor: "#1B3B6F" },
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                px: 2,
              }}
            >
              {fetchingDams ? "Updating..." : "Refresh Coordinates"}
            </Button>
          </Stack>
        </div>

        {/* Map Container */}
        <div className="map-container-card">
          <MapContainer
            center={[23.0, 82.0]}
            zoom={4.75}
            zoomSnap={0.25}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            maxBounds={L.latLngBounds(indiaMaxBounds)}
            maxBoundsViscosity={0.7}
            minZoom={3.5}
            maxZoom={10}
            zoomControl={true}
          >
            <MapController fitBoundsCoords={indiaFitBounds} resetKey={resetKey} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <GeoJSON data={mask} style={styleMask} />
            <GeoJSON className="ind" data={indiaGeoJson} />
            <GeoJSON
              className="states"
              data={indiaStatesGeoJson}
              onEachFeature={(feature, layer) =>
                layer.on({
                  click: (e) => {
                    const bounds = e.target.getBounds();
                    e.target._map.fitBounds(bounds, { padding: [50, 50] });
                  },
                })
              }
            />

            {coordinates.map((coord, index) => (
              <Marker
                key={index}
                position={[coord.latitude, coord.longitude]}
                icon={damPinIcon}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                }}
              >
                <Popup>
                  <div className="dam-popup-card">
                    <h4 className="dam-popup-title">{coord.name}</h4>
                    <p className="dam-popup-meta">
                      Coordinates: {coord.latitude.toFixed(4)}, {coord.longitude.toFixed(4)}
                    </p>
                    <button
                      className="dam-popup-btn"
                      onClick={() => navigate(`/dam/${coord.damId}`)}
                    >
                      View Dam Telemetry →
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Drawing Feature Group */}
            <FeatureGroup>
              <EditControl
                position="topleft"
                onCreated={handlePolygonCreated}
                draw={{
                  rectangle: false,
                  circle: false,
                  marker: false,
                  polyline: false,
                  circlemarker: false,
                  polygon: {
                    allowIntersection: false,
                    shapeOptions: {
                      color: "#F59E0B",
                      weight: 3,
                      fillOpacity: 0.25,
                    },
                  },
                }}
              />
            </FeatureGroup>
          </MapContainer>
        </div>

        {/* Selected Polygon Coordinates Preview Card */}
        {polygonCoordinates.length > 0 && (
          <Paper elevation={0} className="polygon-summary-card">
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1B3B6F" }}>
                  Selected Command Area Polygon ({polygonCoordinates.length} Vertices)
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Custom region captured from map drawing tool.
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowForward />}
                onClick={handleNavigate}
                sx={{
                  bgcolor: "#274C77",
                  "&:hover": { bgcolor: "#1B3B6F" },
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Calculate Command Area
              </Button>
            </Stack>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                maxHeight: 120,
                overflowY: "auto",
                p: 1.5,
                bgcolor: "#F8FAFC",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
              }}
            >
              {polygonCoordinates.map((coord, idx) => (
                <Chip
                  key={idx}
                  label={`P${idx + 1}: ${coord[0].toFixed(4)}, ${coord[1].toFixed(4)}`}
                  size="small"
                  sx={{ bgcolor: "#FFFFFF", border: "1px solid #CBD5E1", fontSize: "0.72rem" }}
                />
              ))}
            </Box>
          </Paper>
        )}
      </div>
    </div>
  );
};

export default Gui;
