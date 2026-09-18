/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Typography, Box, Paper, Button, Card, CardContent, Grid2 as Grid, Chip, Alert, Divider } from "@mui/material";
import { Agriculture, ShowChart, Compare, ArrowForward, CheckCircle, Warning } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts/BarChart";
import "./dam.css";
import SessionsChart from "../components/sessionchart";

const Dam = () => {
  const { damId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [damData, setDamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waterCover, setWaterCover] = useState(null);
  const [volume, setVolume] = useState(null);
  const [sedimentation, setSediment] = useState(null);
  const [cropAnalysis, setCropAnalysis] = useState(location.state?.processData?.data || null);

  const handleLoad = async () => {
    try {
      console.log(`Fetching data for damId: ${damId}`);
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

      // If no state processData was passed, try fetching latest crop analysis for dam
      if (!cropAnalysis) {
        try {
          const cropRes = await axios.get(`http://127.0.0.1:8080/crops/analysis/dam/${damId}`);
          if (cropRes.data && cropRes.data.data && cropRes.data.data.length > 0) {
            setCropAnalysis(cropRes.data.data[0]);
          }
        } catch (e) {
          console.log("No previous crop analysis found for dam");
        }
      }
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

  const damLiveVolumeM3 = volume && volume.length > 0 ? volume[0] * 1000 : (damData?.gross_volume || 5000000);
  const cropWaterReq = cropAnalysis?.crop_water_requirement || 0;
  const optimalUsage = cropAnalysis?.optimal_water_usage || 0;
  const givenConfig = cropAnalysis?.water_given_config || 0;
  const waterBalance = damLiveVolumeM3 - cropWaterReq;

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", paddingLeft: "23vw", paddingRight: "22vw", paddingTop: "2vw", paddingBottom: "4vw", boxSizing: "border-box", bgcolor: "#F4F7F9" }}>
      
      {/* Header Banner & Title */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: "16px", bgcolor: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Chip label="Dam Details & Analytics" color="primary" size="small" sx={{ bgcolor: "#274C77", fontWeight: "bold", mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#274C77" }}>
              {damData ? damData.name : `Dam #${damId}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Process Flow Track 1: Real-Time Insights & Command Area Water Need
            </Typography>
          </Box>

          {/* CTA: Processing & Calculating Command Area */}
          <Button
            variant="contained"
            startIcon={<Agriculture />}
            endIcon={<ArrowForward />}
            onClick={handleNavigateCommandArea}
            sx={{ bgcolor: "#274C77", "&:hover": { bgcolor: "#1D3859" }, borderRadius: "10px", py: 1.5, px: 3, fontWeight: "bold" }}
          >
            Processing & Calculating Command Area
          </Button>
        </Box>
      </Paper>

      {loading && <Typography>Loading Dam Insights...</Typography>}

      {!loading && damData && (
        <>
          {/* Track 1 - Step 3A: Real Time Insights, Graphs & Charts */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: "16px", bgcolor: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ShowChart sx={{ color: "#274C77", fontSize: 30, mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#274C77" }}>
                Real Time Insights, Graphs & Charts
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {/* Graphs Container */}
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1.5vw", mb: 3 }}>
              {waterCover && waterCover.length > 0 && (
                <SessionsChart title={"Water Cover"} caption={"in km²"} d={waterCover} order={waterCover[0] > waterCover[waterCover.length - 1] ? 'Increasing' : 'Decreasing'} h={160} w="100%" />
              )}
              {volume && volume.length > 0 && (
                <SessionsChart title={"Live Storage Volume"} d={volume.map((i) => i / 1000)} caption={"in km³"} order={volume[0] > volume[volume.length - 1] ? 'Increasing' : 'Decreasing'} h={160} w="48%" />
              )}
              {sedimentation && sedimentation.length > 0 && (
                <SessionsChart title={"Sedimentation"} caption={"in km³"} d={sedimentation.map((i) => i / 1000000000)} order={sedimentation[0] > sedimentation[sedimentation.length - 1] ? 'Increasing' : 'Decreasing'} h={160} w="48%" />
              )}
            </Box>

            {/* Dam Metadata Cards */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "#FAFCFE" }}>
                  <Typography variant="caption" color="textSecondary">Gross Volume</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#274C77" }}>{damData.gross_volume ? `${(damData.gross_volume / 1e6).toFixed(2)} M m³` : "N/A"}</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "#FAFCFE" }}>
                  <Typography variant="caption" color="textSecondary">Location (Lat / Long)</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#274C77" }}>{damData.latitude}, {damData.longitude}</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "#FAFCFE" }}>
                  <Typography variant="caption" color="textSecondary">Mean Depth</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#274C77" }}>{damData.mean_depth ? `${damData.mean_depth} m` : "N/A"}</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "#FAFCFE" }}>
                  <Typography variant="caption" color="textSecondary">Status & Maintenance</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#274C77" }}>{damData.status || "Optimal"}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Track 1 - Step 5 & 6: Find Water Need & Compare */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", bgcolor: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Compare sx={{ color: "#274C77", fontSize: 30, mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#274C77" }}>
                  Find Water Need & Compare Analysis
                </Typography>
              </Box>

              <Button variant="outlined" startIcon={<Agriculture />} onClick={handleNavigateCommandArea} sx={{ color: "#274C77", borderColor: "#274C77" }}>
                {cropAnalysis ? "Re-calculate Command Area" : "Calculate Command Area"}
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {cropAnalysis ? (
              <Box>
                {/* Comparative Metric Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: "12px", borderColor: "#CBD5E1" }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="caption" color="textSecondary">Crop Water Requirement</Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#274C77", my: 0.5 }}>
                          {cropWaterReq.toLocaleString(undefined, { maximumFractionDigits: 1 })} m³
                        </Typography>
                        <Chip label="Baseline Need" size="small" variant="outlined" color="primary" />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: "12px", borderColor: "#CBD5E1" }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="caption" color="textSecondary">Water (Current Config)</Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#D97706", my: 0.5 }}>
                          {givenConfig.toLocaleString(undefined, { maximumFractionDigits: 1 })} m³
                        </Typography>
                        <Chip label="Current Method" size="small" variant="outlined" color="warning" />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: "12px", borderColor: "#CBD5E1" }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="caption" color="textSecondary">Optimal Water Usage</Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#16A34A", my: 0.5 }}>
                          {optimalUsage.toLocaleString(undefined, { maximumFractionDigits: 1 })} m³
                        </Typography>
                        <Chip label="Modern Efficiency" size="small" variant="outlined" color="success" />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: "12px", borderColor: "#CBD5E1" }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="caption" color="textSecondary">Dam Available Capacity</Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0284C7", my: 0.5 }}>
                          {damLiveVolumeM3.toLocaleString(undefined, { maximumFractionDigits: 1 })} m³
                        </Typography>
                        <Chip 
                          icon={waterBalance >= 0 ? <CheckCircle /> : <Warning />}
                          label={waterBalance >= 0 ? "Surplus Water" : "Water Deficit"} 
                          size="small" 
                          color={waterBalance >= 0 ? "success" : "error"} 
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Comparative Visual Chart */}
                <Box sx={{ p: 2, border: "1px solid #E2E8F0", borderRadius: "12px", bgcolor: "#FAFCFE", mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#274C77", mb: 1 }}>
                    Water Supply vs Crop Demand Comparison
                  </Typography>
                  <Box sx={{ height: 280, width: "100%" }}>
                    <BarChart
                      xAxis={[{ scaleType: 'band', data: ['Dam Live Vol', 'Crop Req', 'Current Config', 'Optimal Config'] }]}
                      series={[{
                        data: [
                          damLiveVolumeM3,
                          cropWaterReq > 0 ? cropWaterReq : damLiveVolumeM3 * 0.45,
                          givenConfig > 0 ? givenConfig : damLiveVolumeM3 * 0.55,
                          optimalUsage > 0 ? optimalUsage : damLiveVolumeM3 * 0.35
                        ],
                        color: '#274C77'
                      }]}
                      height={260}
                      margin={{ left: 100, right: 20, top: 20, bottom: 40 }}
                    />
                  </Box>
                </Box>

                {/* Optimization Recommendations */}
                {cropAnalysis?.suggestions && (
                  <Alert severity="info" sx={{ borderRadius: "10px" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>Irrigation Optimization Suggestions:</Typography>
                    {cropAnalysis.suggestions}
                  </Alert>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  No crop water need analysis found for this dam yet.
                </Typography>
                <Button variant="contained" startIcon={<Agriculture />} onClick={handleNavigateCommandArea} sx={{ bgcolor: "#274C77" }}>
                  Start Command Area Calculation & Crop Selection
                </Button>
              </Box>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Dam;

