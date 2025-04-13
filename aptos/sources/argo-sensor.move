module agro_sensor::agro_sensor {
use std::signer;
    struct SensorData has key {
        temperature: u8,
        humidity: u8,
        moisture: u16,
    }

    /// Stores or updates the sensor data
    public entry fun update_data(account: &signer, temperature: u8, humidity: u8, moisture: u16) acquires SensorData {
        let addr = signer::address_of(account);
        if (exists<SensorData>(addr)) {
            let data_ref = borrow_global_mut<SensorData>(addr);
            data_ref.temperature = temperature;
            data_ref.humidity = humidity;
            data_ref.moisture = moisture;
        } else {
            move_to(account, SensorData {
                temperature,
                humidity,
                moisture
            });
        }
    }

    /// Reads the sensor data
    public fun get_data(account: address): SensorData acquires SensorData {
        let data_ref = borrow_global<SensorData>(account);
        SensorData {
            temperature: data_ref.temperature,
            humidity: data_ref.humidity,
            moisture: data_ref.moisture
        }
    }
}