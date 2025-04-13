import { config } from "dotenv";
config();
import cors from 'cors';

import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import axios from "axios";
import express from "express";
import fs from "fs";

// --- Configuration ---
const PRIVATE_KEY = process.env.APTOS_PRIVATE_KEY;
const MODULE_ADDRESS = process.env.MODULE_ADDRESS;
const COM_PORT = process.env.COM_PORT || "COM6";
const BAUD_RATE = 9600;
const COOLDOWN_MS = 5_000;

if (!PRIVATE_KEY || !MODULE_ADDRESS) {
  console.error("❌ Missing PRIVATE_KEY or MODULE_ADDRESS in .env");
  process.exit(1);
}

const privateKey = new Ed25519PrivateKey(Buffer.from(PRIVATE_KEY, "hex"));
const account = Account.fromPrivateKey({ privateKey });
const aptos = new Aptos(new AptosConfig({ network: Network.DEVNET }));
const FUNCTION_NAME = `${MODULE_ADDRESS}::agro_sensor_v2::update_data`;

console.log("🧾 Account address:", account.accountAddress.toString());

// --- Serial Setup ---
const port = new SerialPort({ path: COM_PORT, baudRate: BAUD_RATE });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

let temp = null;
let humidity = null;
let moisture = null;
let lastSent = 0;

port.on("error", (err) => {
  console.error("❌ Serial port error:", err.message);
});

parser.on("data", async (line) => {
  line = line.trim();
  console.log("📥 Received:", line);

  if (line.startsWith("Temp:")) {
    [temp, humidity] = parseTempHumidity(line);
  } else if (line.startsWith("Soil Moisture:")) {
    moisture = parseMoisture(line);

    if (temp !== null && humidity !== null && moisture !== null) {
      await sendToAptos(temp, humidity, moisture);
      temp = humidity = moisture = null; // Reset after sending
    }
  }
});

// --- Parsing Helpers ---
function parseTempHumidity(line) {
  const match = line.match(/Temp:\s*([\d.]+).*Humidity:\s*([\d.]+)/i);
  return match ? [parseFloat(match[1]), parseFloat(match[2])] : [null, null];
}

function parseMoisture(line) {
  const match = line.match(/Soil Moisture:\s*(\d+)/i);
  return match ? parseInt(match[1]) : null;
}

function writeToJson(temp, humidity, moisture, timestamp) {
  const data = {
    timestamp: new Date(timestamp).toISOString(),
    temperature: temp,
    humidity: humidity,
    moisture: moisture,
    reading_id: "", 
    address: MODULE_ADDRESS,
  };

  const filePath = "sensor_data.json";

  fs.readFile(filePath, "utf8", (err, jsonData) => {
    let jsonArray = [];
    if (!err) {
      try {
        jsonArray = JSON.parse(jsonData);
      } catch (parseErr) {
        console.error("❌ JSON parse error:", parseErr.message);
      }
    }
    jsonArray.push(data);
    fs.writeFile(filePath, JSON.stringify(jsonArray.slice(-1000), null, 2), (writeErr) => {
      if (writeErr) {
        console.error("❌ File write error:", writeErr.message);
      } else {
        console.log("✅ Data written to JSON file.");
      }
    });
  });
}

// --- Blockchain Submitter ---
async function sendToAptos(temp, humidity, moisture) {
  const now = Date.now();
  if (now - lastSent < COOLDOWN_MS) {
    console.log("⏳ Cooldown active, skipping submission.");
    return;
  }
  lastSent = now;

  console.log("📡 Sending to Aptos:", { temp, humidity, moisture });

  try {
    const tx = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: FUNCTION_NAME,
        functionArguments: [
          moisture.toString(),
          temp.toString(),
          humidity.toString(),
        ],
      },
      options: {
        maxGasAmount: 10000,
        gasUnitPrice: 100,
      },
    });

    await fundAccount(account.accountAddress.toString());
    console.log("💰 Funding account:", account.accountAddress.toString());
    const signedTx = await aptos.signAndSubmitTransaction({
      signer: account,
      transaction: tx,
    });
    writeToJson(temp, humidity, moisture, now);

    await aptos.waitForTransaction({ transactionHash: signedTx.hash });
    console.log("✅ Submitted to Aptos:", signedTx.hash);
  } catch (error) {
    console.error("❌ Error submitting to Aptos:", error.message);
  }
}

// --- Faucet Funding Function ---
async function fundAccount(address) {
  try {
    const url = `https://faucet.devnet.aptoslabs.com/mint?address=${address}&amount=1000000`;
    const res = await axios.post(url);
    console.log("🚰 Faucet funded account:", res.data);
  } catch (err) {
    console.error("❌ Faucet funding failed:", err.message);
  }
}

// --- Express Server Setup ---
const app = express();
const eport = 5000;

app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods if needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
  }));
app.get("/api/readings", (req, res) => {
    console.log("got hit");
  const filePath = "sensor_data.json";
  fs.readFile(filePath, "utf8", (err, jsonData) => {
    if (err) {
      res.status(500).send("❌ Error reading file");
      return;
    }
    console.log(JSON.parse(jsonData));
    res.json(JSON.parse(jsonData));
  });
});

app.listen(eport, () => {
  console.log(`🚀 Express server running on http://localhost:${eport}`);
});