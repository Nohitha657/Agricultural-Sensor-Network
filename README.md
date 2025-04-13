Project Title     :- Agricultural Sensor Network Development
Domain            :-     The Internet of Things (IoT)
Problem Statement :- Transparent Agricultural Monitoring with IoT and Blockchain (Aptos DApp)
                      •  Buyers are unable to verify the quality or sustainability of produce.
                      •  Regulators struggle to enforce environmental policies effectively.
                      •  Consumers have limited visibility into how their food is grown.
                      •  Farmers miss out on market opportunities that reward transparency and data-backed practices 
Problem Description :- 
                         Modern agriculture is under increasing pressure to produce more with fewer resources while 
                         maintaining environmental sustainability and meeting regulatory standards. To meet these demands,
                         farms are turning to digital technologies such as precision agriculture and smart irrigation 
                         systems. At the heart of these systems lies the agricultural sensor network—a network of
                         IoT sensors deployed across fields to monitor critical parameters such as soil moisture,
                         temperature, humidity and water usage.
                        Despite the potential of these technologies, several key challenges persist:
                        1.	Fragmented Data Collection: Many farms use isolated or proprietary sensor systems that
                        don’t integrate well, leading to inconsistent or incomplete data sets.
                        2.	Manual Intervention and Errors: In some cases, farmers still manually collect data or 
                        transfer it between systems, introducing opportunities for human error or data loss.
                        3.	Lack of Real-Time Monitoring: Without continuous data streams, it's difficult to 
                        respond to environmental changes in a timely manner, which can result in crop loss or
                        inefficient resource use.
                        4.	Data Integrity and Trust: Sensor data is often stored in centralized systems that
                        can be altered or lost, making it difficult for external parties—such as buyers, 
                        certifiers, or regulators—to trust its authenticity.
                        5.	Limited Accessibility and Use of Data: Even when collected, sensor data is 
                        often underutilized due to a lack of standardized, user-friendly platforms for analysis and sharing.
                        These challenges hinder the widespread adoption and effectiveness of smart farming practices. 
                        An effective agricultural sensor network must not only collect accurate, real-time 
                        environmental data but also ensure data integrity, accessibility, and interoperability across stakeholders.
Tech Stack Used :-
                           Microcontroller & Embedded Systems:-
                        •	Arduino UNO     :- Main microcontroller for reading soil and environmental data from sensors and controlling the water pump.
                        •	DHT11 Sensor    :- For measuring temperature and humidity on the farm.
                        •	Soil Moisture Sensor :- To detect soil dryness levels and trigger irrigation when needed.
                        •	Relay Module    :- Used to control the water pump based on moisture readings.
                        Software Development :-
                        •	Visual Studio Code (VS Code) :-Primary development environment for writing and organizing firmware,
                        backend scripts, and smart contract code.
                        •	Arduino IDE     :- For compiling and uploading Arduino C++ code to the microcontroller
                        Blockchain & Web3 :-
                        •	Aptos Blockchain -A scalable and secure layer-1 blockchain platform where environmental sensor data is stored immutably.
                        •	Move Language -Smart contract language for Aptos, used to write logic for data validation and traceability.
                        Frontend & User Interface :-
                           Aptos DApp (Web Interface)
                        	A user-friendly decentralized application that displays on-chain sensor data to farmers, buyers, and regulators.
                            HTML, CSS, JavaScript (Optional) For designing and building the web interface of the DApp.
Project Explanation :-
                          This project combines IoT-based agricultural sensor networks with a decentralized application (DApp) built on the
                          Aptos blockchain to create a transparent, secure, and tamper-proof system for monitoring and recording on-farm environmental data.
                          1. Objective
                          The main goal is to automate the collection and recording of critical agricultural data—such as soil moisture, 
                          temperature, humidity, and water usage—and store it immutably on the Aptos blockchain. This ensures that the 
                          data is verifiable, traceable, and accessible to various stakeholders including farmers, buyers, regulators, and certifying agencies.
                          
                          2. How It Works
                          1.	Sensor Network Deployment
                          IoT sensors are installed across farm fields to continuously monitor environmental and soil conditions in real time.
                          2.	Data Collection & Processing
                          Sensor data is collected and processed through a local microcontroller or edge computing device (Arduino UNO).
                          This helps filter and format data for efficient transmission.
                          3.	Blockchain Integration
                          The processed data is sent to a backend application that communicates with the Aptos blockchain. 
                          Each data point (e.g., timestamped soil pH level) is recorded as a transaction, 
                          ensuring immutability and traceability.
                          4.	DApp Interface
                          A user-friendly DApp dashboard allows different users to access relevant data:
                          o	Farmers can view real-time sensor data and history
                          o	Buyers can verify product origin and growing conditions
                          o	Regulators can audit compliance with environmental standards
                          _
                          3. Benefits
                          •	Tamper-proof Data: Blockchain ensures no manipulation of environmental records
                          •	Real-time Monitoring: Enables smarter decisions and efficient resource use
                          •	Supply Chain Transparency: Builds trust between farmers, buyers, and consumers
                          •	Regulatory Compliance: Simplifies inspections and certifications



