module agro_sensor::agro_sensor_v3 {
    use std::signer;
    use std::table;


    /// Each sensor reading
    struct SensorReading has copy, drop, store {
        moisture: u32,
        temperature: u32,
        humidity: u32,
        timestamp: u64,
    }

    /// Log of up to 60 readings
    struct SensorLog has key {
        readings: table::Table<u64, SensorReading>,
        reading_counter: u64,
    }

    /// Initialize the resource for an account
    public entry fun init(account: &signer) {
        move_to(account, SensorLog {
            readings: table::new<u64, SensorReading>(),
            reading_counter: 0,
        });
    }

    /// Add a new sensor reading; remove oldest if over 60
    public entry fun update_data(account: &signer, moisture: u32, temperature: u32, humidity: u32, timestamp: u64) acquires SensorLog {
        let addr = signer::address_of(account);
        let log = borrow_global_mut<SensorLog>(addr);

        let next_id = log.reading_counter + 1;

        let reading = SensorReading {
            moisture,
            temperature,
            humidity,
            timestamp
        };

        table::add(&mut log.readings, next_id, reading);
        log.reading_counter = next_id;

        // Keep only last 60 readings
        if (next_id > 60) {
            let remove_id = next_id - 60;
            let _ = table::remove(&mut log.readings, remove_id);
        }
    }

    /// Get the total number of readings ever recorded
    public fun get_reading_count(account: address): u64 acquires SensorLog {
        borrow_global<SensorLog>(account).reading_counter
    }

    /// Get a specific reading by ID
    public fun get_reading(account: address, id: u64): SensorReading acquires SensorLog {
        let log = borrow_global<SensorLog>(account);
        table::borrow(&log.readings, id)
    }
}