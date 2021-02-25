# JMXScripter

## Overview
This script automatically downloads and configures the JMX exporter for your Kafka instance. Please read the entire README before starting. 

## Getting Started
- Clone this repo
````git clone https://github.com/Khyunwoo1/JMXScripter.git````
- Run the application in the root folder
````node index.js````

## Important Notes
- By default, the information exported from your Kafka instance from JMX exporter is written to localhost:7075. If you wish to change this, enter a new port number in line 51 of the index.js file before running. 
- Only works for Linux/Ubuntu and Mac OS. Will add Windows compatibility in a later version.
- This script will override the following files. Make sure to save any customizations elsewhere before running this script if you wish to save them.
  - kafka-server-start.sh
  - kafka.service
- This script assumes your Java file is in the /usr/lib/jvm directory. If it's not, you will have to find your path and replace it in line 47 of the index.js file. We hope to automate this as well in a later version. 

## Links
This script was written as a companion for it's parent application which you can find here: https://github.com/oslabs-beta/klustr

The JMX Exporter .jar file is sourced from: https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/

The kafka-2_0_0.yml file is sourced from: https://github.com/prometheus/jmx_exporter/tree/master/example_configs
