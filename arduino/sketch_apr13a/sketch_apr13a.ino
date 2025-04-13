// Do not forget to subscribe my YouTube channel ktronic110

#include <LiquidCrystal.h>
#include <DHT.h>

// Pin Configuration
const int relayPin = 3;       // Relay control pin
const int sensorPin = A0;     // Analog pin for soil moisture sensor
const int threshold = 400;    // Moisture threshold

#define DHTPIN 7              // DHT11 data pin
#define DHTTYPE DHT11

// Initialize LCD: RS, E, D4, D5, D6, D7
LiquidCrystal lcd(8, 9, 10, 11, 12, 13);
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH); // Initially pump OFF

  Serial.begin(9600);
  dht.begin();
  lcd.begin(16, 2);

  lcd.print("Smart Watering");
  delay(2000);
  lcd.clear();
}

void loop() {
  int sensorValue = analogRead(sensorPin);
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  Serial.print("Soil Moisture: ");
  Serial.println(sensorValue);
  Serial.print("Temp: ");
  Serial.print(temperature);
  Serial.print(" C, Humidity: ");
  Serial.println(humidity);

  // LCD Line 1: Temp & Humidity
  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print(temperature);
  lcd.print("C H:");
  lcd.print(humidity);
  lcd.print("%");

  // LCD Line 2: Soil + Pump status
  lcd.setCursor(0, 1);
  lcd.print("Soil:");
  lcd.print(sensorValue);

  if (sensorValue < threshold) {
    digitalWrite(relayPin, LOW); // Turn pump ON
    lcd.setCursor(12, 1);
    lcd.print("Pump:ON ");
  } else {
    digitalWrite(relayPin, HIGH); // Turn pump OFF
    lcd.setCursor(12, 1);
    lcd.print("Pump:OFF");
  }

  delay(2000);
}
