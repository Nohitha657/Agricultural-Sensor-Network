import axios from "axios";

import {
  useWallet,
  InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useEffect, useState } from "react";
import AgroDashboard from "./agroDashboard";

export type SensorReading = {
  address: string;
  timestamp: string;
  humidity: number;
  temperature: number;
  moisture: number;
  reading_id: string;
};

export const aptos = new Aptos();
export const moduleAddress = "7f829b8586dc2f3694a5d12a9f22fde9b4ffd7badd6aaa32051f940e665b0858"

function App() {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [humidity, setHumidity] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [moisture, setMoisture] = useState<number>(0);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();
  const filePath= "C:\Users\Devi Sree\my-projects\DApp\aptos-backend\sensor_data.json"
  const fetchReadingsJS = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/readings");
      const json = response.data;
      // console.log(json);
      const last60 = json?.slice(-60) || [];

      // console.log(last60);
      setReadings(last60);
    } catch (error) {
      console.error("Error fetching sensor readings:", error);
    }
  };
  const fetchReadings = async () => {
    if (!account) return;
    
    try {
      const resource = await aptos.getAccountResource({
        accountAddress: account.address,
        resourceType: `${moduleAddress}::agro::SensorLog`,
      });

      const tableHandle = resource.readings.handle;
      const readingCount = resource.reading_counter;
      let data: SensorReading[] = [];

      for (let i = 1; i <= readingCount; i++) {
        const item = {
          key_type: "u64",
          value_type: `${moduleAddress}::agro_sensor_v2::get_data`,
          key: `${i}`,
        };
        const reading = await aptos.getTableItem<SensorReading>({
          handle: tableHandle,
          data: item,
        });
        data.push(reading);
      }

      setReadings(data.reverse());
    } catch (error) {
      console.error("Failed to fetch readings:", error);
    }
  };

  const submitReading = async () => {
    if (!account) return;
    setTransactionInProgress(true);

    const tx: InputTransactionData = {
      data: {
        function: `${moduleAddress}::agro_sensor_v2::update_data`,
        functionArguments: [
          humidity.toString(),
          temperature.toString(),
          moisture.toString(),
        ],
      },
    };

    try {
      const response = await signAndSubmitTransaction(tx);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      await fetchReadings();
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  useEffect(() => {
    fetchReadingsJS();
  }, [account?.address]);

  return (
    <AgroDashboard
      readings={readings}
      humidity={humidity}
      temperature={temperature}
      moisture={moisture}
      setHumidity={setHumidity}
      setTemperature={setTemperature}
      setMoisture={setMoisture}
      submitReading={submitReading}
      account={account}
      transactionInProgress={transactionInProgress}
    />
  );
}

export default App;
