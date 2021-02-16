# River Level Sensor Alerts

Small system to keep track of various river water levels and send alerts

TODOs:
- [x] Backend logic
    - [x] Firebase push notifications
        - [x] Subscribe to notifs
        - [x] Send warn and danger notifs
    - [x] Datapoints
        - [x] Receive datapoints from sensors
        - [x] Send datapoints from app clients
- [x] Frontend
    - [x] Layout
        - [x] Sidebar
        - [x] Water level reading
        - [x] Water level graph
    - [x] Backend integration
        - [x] Sidebar populate sensors from server
        - [x] Regularly request water level from server
        - [x] Select sensors to subscribe to
    - [x] Push notifs
        - [x] Receive push notifs from server
            - [x] Display notification
- [ ] Hardware sensor logic
    - [ ] Water level logic
    - [ ] Send water level to server
    - [ ] Deepsleep loop