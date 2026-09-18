import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Alert,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Agriculture,
  ShowChart,
  ArrowForward,
  WaterDrop,
} from "@mui/icons-material";
import "./dam.css";
import SessionsChart from "../components/sessionchart";

const Dam = () => {
  const { damId } = useParams();
  const navigate = useNavigate();
  const [damData, setDamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waterCover, setWaterCover] = useState(null);
  const [volume, setVolume] = useState(null);
  const [sedimentation, setSediment] = useState(null);

  const handleLoad = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8080/dam/${damId}`);
      setDamData(response.data.data);

      let res = await axios.get(`http://127.0.0.1:8080/dam/analysis/${damId}`);
      let x = res.data.data.map((i) => i.water_cover);

      if (x.length === 0) {
        await axios.post(`http://127.0.0.1:8080/dam/analysis/${damId}`);
        res = await axios.get(`http://127.0.0.1:8080/dam/analysis/${damId}`);
        x = res.data.data.map((i) => i.water_cover);
      }

      setVolume(res.data.data.map((i) => i.live_volume));
      setSediment(res.data.data.map((i) => i.sedimentation));
      setWaterCover(x);
    } catch (error) {
      console.error("Error fetching dam data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoad();
  }, [damId]);

  const handleNavigateCommandArea = () => {
    navigate(`/cordid/${damId}`);
  };

  return (
    <div className="page-wrapper">
      {/* Header Banner & Action Button */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          mb: 3,
          borderRadius: "16px",
          bgcolor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Chip
              icon={<WaterDrop sx={{ fontSize: "0.85rem !important" }} />}
              label="Dam Telemetry & Monitoring"
              size="small"
              sx={{
                bgcolor: "rgba(39, 76, 119, 0.08)",
                color: "#274C77",
                fontWeight: 700,
                fontSize: "0.72rem",
                mb: 1,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1B3B6F", letterSpacing: "-0.5px" }}>
              {damData ? damData.name : `Dam #${damId}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Real-time reservoir storage telemetry, surface water spread, and sedimentation monitoring.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Agriculture />}
            endIcon={<ArrowForward />}
            onClick={handleNavigateCommandArea}
            sx={{
              bgcolor: "#1B3B6F",
              "&:hover": { bgcolor: "#0B2545" },
              borderRadius: "10px",
              py: 1.3,
              px: 3,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(27, 59, 111, 0.25)",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Calculate Command Area
          </Button>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#1B3B6F" }} />
        </Box>
      ) : damData ? (
        /* =========================================================================
           REAL-TIME RESERVOIR TELEMETRY SCREEN (ONLY)
           ========================================================================= */
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: "16px",
            bgcolor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 16px rgba(27, 59, 111, 0.06)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                bgcolor: "rgba(39, 76, 119, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#274C77",
                mr: 1.5,
              }}
            >
              <ShowChart fontSize="small" />
            </Box>
            <div>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1B3B6F", lineHeight: 1.2 }}>
                Real-Time Reservoir Telemetry
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Multi-temporal satellite monitoring of water spread, storage volume, and sedimentation
              </Typography>
            </div>
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          {/* Responsive Charts Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
              gap: 2.5,
              mb: 3,
            }}
          >
            {waterCover && waterCover.length > 0 && (
              <SessionsChart
                title="Surface Water Spread"
                caption="in km² (Satellite Cover)"
                d={waterCover}
                order={waterCover[0] > waterCover[waterCover.length - 1] ? "Increasing" : "Decreasing"}
                h={160}
              />
            )}
            {volume && volume.length > 0 && (
              <SessionsChart
                title="Live Storage Volume"
                d={volume.map((i) => i / 1000)}
                caption="in km³ (Effective Storage)"
                order={volume[0] > volume[volume.length - 1] ? "Increasing" : "Decreasing"}
                h={160}
              />
            )}
            {sedimentation && sedimentation.length > 0 && (
              <SessionsChart
                title="Reservoir Sedimentation"
                caption="in km³ (Bed Deposition)"
                d={sedimentation.map((i) => i / 1000000000)}
                order={sedimentation[0] > sedimentation[sedimentation.length - 1] ? "Increasing" : "Decreasing"}
                h={160}
              />
            )}
          </Box>

          {/* Dam Metadata Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
              gap: 2,
            }}
          >
            <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "#F8FAFC", borderColor: "#E2E8F0" }}>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>Gross Volume</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1B3B6F", mt: 0.5 }}>
                {damData.gross_volume ? `${(damData.gross_volume / 1e6).toFixed(2)} M m³` : "N/A"}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "#F8FAFC", borderColor: "#E2E8F0" }}>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>Location Coordinates</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1B3B6F", mt: 0.5 }}>
                {damData.latitude?.toFixed(3)}, {damData.longitude?.toFixed(3)}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "#F8FAFC", borderColor: "#E2E8F0" }}>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>Mean Reservoir Depth</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1B3B6F", mt: 0.5 }}>
                {damData.mean_depth ? `${damData.mean_depth} m` : "N/A"}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "#F8FAFC", borderColor: "#E2E8F0" }}>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>Telemetry Status</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#10B981", mt: 0.5 }}>
                {damData.status || "Operational"}
              </Typography>
            </Paper>
          </Box>
        </Paper>
      ) : (
        <Alert severity="error">Dam telemetry data not found.</Alert>
      )}
    </div>
  );
};

export default Dam;
