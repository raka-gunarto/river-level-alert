#include <NewPing.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include "setup.h"

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
WiFiClientSecure client;

void reportToServer(uint microseconds)
{
  client.setTimeout(10000); // max 10 seconds or die
  String data = String(String("{\"secret\":\"") + String(API_SECRET) + String("\",\"location\":\"") + String(SENSOR_ID) + String("\",\"rawValue\":") + String(microseconds) + String("}"));

  // Attempt to connect
  if (client.connect(API_ADDR, 443))
  {
    client.println("POST " + String(API_PATH) + " HTTP/1.1");
    client.println("Host: " + String(API_ADDR));
    client.println("User-Agent: ESP8266/1.0");
    client.println("Connection: close");
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(data.length());
    client.println();
    client.println(data);
    while (!client.available())
      ;
    client.stop();
    return;
  }
}

void setup()
{
  pinMode(D0, WAKEUP_PULLUP);
  WiFi.mode(WIFI_STA);
  WiFi.begin(AP_SSID, AP_PASSWORD);
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    if (WiFi.status() == WL_CONNECT_FAILED)
      ESP.restart();
  }
  WiFi.setAutoReconnect(true);
  client.setInsecure();

  uint microseconds = sonar.ping();
  int retries = 5;
  while (microseconds == 0 && retries > 0) {
    delay(500);
    microseconds = sonar.ping();
    retries -= 1;
  }
  reportToServer(microseconds);

  ESP.deepSleep(30e6);
}

void loop()
{
  ESP.deepSleep(5e6);
}