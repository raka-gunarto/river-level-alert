import React, { useEffect, useState } from "react";
import {
  SwipeableDrawer,
  AppBar,
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  IconButton,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { Waves, Menu, Favorite } from "@material-ui/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import axios from "axios";

import "./firebase";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSensor, setActiveSensor] = useState(null);

  const [sensors, setSensors] = useState(null);
  const [sensorData, setSensorData] = useState(null);

  const [subscriptions, setSubscriptions] = useState([]);

  const circleColor =
    sensorData && sensorData.data[0]
      ? sensorData.data[0].waterLevel >= sensorData.dangerLevel
        ? "#d50000"
        : sensorData.data[0].waterLevel >= sensorData.warnLevel
        ? "#ffd600"
        : "#00c853"
      : "#000000";

  useEffect(() => {
    axios.get("/sensors").then((resp) => {
      let sensorsTmp = [];
      for (let [id, info] of Object.entries(resp.data))
        sensorsTmp.push({
          id: id,
          name: info.name,
        });
      setActiveSensor(sensorsTmp[0]);
      setSensors(sensorsTmp);
    });

    setSubscriptions(JSON.parse(localStorage.getItem("subscriptions")) || []);
  }, []);

  useEffect(() => {
    let token = localStorage.getItem("fcmToken");
    if (!token) return;
    if (!sensors) return;
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
    for (let sensor of sensors)
      if (subscriptions.includes(sensor.id))
        axios.post(`/subscribe/${sensor.id}`, {
          token: token,
        });
      else
        axios.post(`/unsubscribe/${sensor.id}`, {
          token: token,
        });
  }, [subscriptions, sensors]);

  useEffect(() => {
    if (activeSensor)
      axios
        .get(`/data/${activeSensor.id}`)
        .then((resp) => setSensorData(resp.data));

    const updateLoop = setInterval(() => {
      if (activeSensor)
        axios
          .get(`/data/${activeSensor.id}`)
          .then((resp) => setSensorData(resp.data));
    }, 10000);

    return () => clearInterval(updateLoop);
  }, [activeSensor]);

  if (!sensors)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
        <br />
        <Typography>{"Loading Data..."}</Typography>
      </Box>
    );
  return (
    <div>
      <AppBar position="static" style={{ marginBottom: "10px" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap>
            {activeSensor.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
        >
          <List>
            {sensors.map((sensor) => (
              <ListItem
                button
                key={sensor.id}
                onClick={() => setActiveSensor(sensor)}
              >
                <ListItemIcon>
                  <Waves />
                </ListItemIcon>
                <ListItemText primary={sensor.name} />
              </ListItem>
            ))}
          </List>
        </div>
      </SwipeableDrawer>
      {!sensorData ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <CircularProgress />
          <br />
          <Typography>{"Loading Data..."}</Typography>
        </Box>
      ) : (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{
            minHeight: "80vh",
          }}
        >
          <Paper
            style={{
              padding: "20px",
              borderRadius: "100%",
              minHeight: "250px",
              minWidth: "250px",
              height: "25vw",
              width: "25vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: "10px",
              borderStyle: "solid",
              borderColor: circleColor,
            }}
            elevation={0}
          >
            <Typography variant="h2">
              {sensorData.data[0]?.waterLevel ? `${(sensorData.data[0].waterLevel / 100).toFixed(2)}m` : "NO DATA"}
            </Typography>
          </Paper>

          {sensorData.data && (
            <div
              style={{ marginTop: "50px", width: "80vw", overflowX: "scroll" }}
            >
              <ResponsiveContainer height={400}>
                <LineChart
                  data={sensorData.data
                    .map((val) => {
                      val.createdAt = new Date(val.createdAt).getTime();
                      val.waterLevel /= 100;
                      return val;
                    })
                    .reverse()}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    scale="time"
                    dataKey="createdAt"
                    tickFormatter={(time) => new Date(time).toLocaleString()}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => value.toFixed(2)}
                    labelFormatter={(time) => new Date(time).toLocaleString()}
                  />
                  <Legend />
                  <Line
                    name="Water Level (m)"
                    dataKey="waterLevel"
                    activeDot={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <FormControlLabel
            label="Send notifications"
            control={
              <Switch
                checked={subscriptions.includes(activeSensor.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    if (!subscriptions.includes(activeSensor.id))
                      setSubscriptions([...subscriptions, activeSensor.id]);
                  } else {
                    let subCp = subscriptions.slice();
                    subCp.splice(subCp.indexOf(activeSensor.id), 1);
                    setSubscriptions(subCp);
                  }
                }}
              />
            }
          />

          <Typography variant="caption">
            Made with <Favorite fontSize="small" style={{ color: "#ff0000" }} />{" "}
            by Raka Gunarto
          </Typography>
        </Grid>
      )}
    </div>
  );
}

export default App;
