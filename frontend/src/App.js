import React, { useEffect, useState } from "react";
import {
  SwipeableDrawer,
  AppBar,
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
} from "@material-ui/core";
import { Waves, Menu } from "@material-ui/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const sensors = [
  { id: "sensor_1", name: "Place 1" },
  { id: "sensor_2", name: "Place 2" },
  { id: "sensor_3", name: "Place 3" },
];

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSensor, setActiveSensor] = useState(sensors[0]);

  const [sensorData, setSensorData] = useState(null);

  const circleColor = sensorData
    ? sensorData.data[0].waterLevel >= sensorData.dangerLevel
      ? "#d50000"
      : sensorData.data[0].waterLevel >= sensorData.warnLevel
      ? "#ffd600"
      : "#00c853"
    : null;

  useEffect(() => {}, []);
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
        <div
          style={{
            position: "fixed",
            left: 0,
            height: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </div>
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
              height: "40vw",
              width: "40vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: "10px",
              borderStyle: "solid",
              borderColor: circleColor,
            }}
            elevation={0}
          >
            <Typography variant="h1">
              {sensorData.data[0].waterLevel}
            </Typography>
          </Paper>

          <LineChart
            width="40vw"
            height="20vh"
            data={sensorData.data.slice().reverse()}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="createdAt" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="waterLevel" activeDot={true} />
          </LineChart>
        </Grid>
      )}
    </div>
  );
}

export default App;
