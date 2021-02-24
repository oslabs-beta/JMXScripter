const cp = require('child_process');
const { start } = require('repl');

function pathResolver(foundPath) {
  let newStr = '';
  let starting = false;
  let fixedDir;
  if (foundPath[foundPath.length - 2] === 'r') {

    for (let i = foundPath.length; i >= 0; i--) {
      let currentChar = foundPath[i];
      if (!starting) {
        if (currentChar === 'r') {
          starting = true;
          newStr += currentChar;
          continue;
        }
        continue;
      }
      newStr += currentChar;
    }
    fixedDir = newStr.split('').reverse().join('');
    return fixedDir;

  } else {
    fixedDir;

    //    /Users/shahprose/Desktop/kafka_2.13-2.7.0-test
    for (let i = foundPath.length; i >= 0; i--) {
      let currentChar = foundPath[i];
      if (!starting) {
        if (currentChar === '0') {
          starting = true;
          newStr += currentChar;
          continue;
        }
        continue;
      }
      newStr += currentChar;
    }
    fixedDir = newStr.split('').reverse().join('');
  }
  return fixedDir;
}

try {

  // INITIAL SETUP
  // URL for JMX Exporter agent download
  const JMXInstallerWindows = 'curl --output JMXFILE.jar https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'
  const JMXInstallerLinux = 'sudo wget https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'

  // Create directory and download JMX Exporter Agent
  const currentWorkDir = {cwd: '..'};
  cp.execSync(`mkdir JMXFOLDER`, currentWorkDir)
  currentWorkDir.cwd = '../JMXFOLDER'
  cp.execSync(JMXInstallerWindows, currentWorkDir)

  // Find Kafka path and copy JMX Exporter file into libs dir
  const kafkaServerDir = cp.execSync('find /home -type d -iname "kafka_2.13-2.7.0*"');
  // const kafkaServerDir = cp.execSync('find /c/Users/ching/Desktop -type d -iname "kafka-server*"');
  const kafkaServerStr = kafkaServerDir.toString();

  const returned = pathResolver(kafkaServerStr);
  console.log('returned from path Resolver: ', returned)
  const kafkaLibsDir = `${returned}/libs/`;
  cp.execSync('cp JMXFILE.jar ' + kafkaLibsDir, currentWorkDir);

  // CHECKS:
  // Java path, kafka.service, kafka path

  // CONFIGURE EXPORTER
  // Copy kafka-2_0_0.yml file onto config dir 
  const kafkaConfigDir = `${returned}/config/`;
  const kafkaServerStart = `${returned}/bin/`;
  cp.execSync(`cp kafka-2_0_0.yml ${kafkaConfigDir}`);

  // Remove and replace existing kafka-server-start.sh file
  // Check later to see if this can just be appended
  cp.execSync(`rm ${kafkaServerStart}kafka-server-start.sh`);
  cp.execSync(`cp kafka-server-start.sh ${kafkaServerStart}`);
  // cp.execSync(`sudo chmod +x kafka-server-start.sh`);
  
  const serverPropertiesPath = `${kafkaConfigDir}server.properties`;
​  const kafkaServerStartPath = `${kafkaServerStart}kafka-server-start.sh`;
  const jmxExporterPath = `${kafkaLibsDir}JMXFILE.jar`;
  const kafkaYmlPath = `${kafkaConfigDir}kafka-2_0_0.yml`;

  console.log('JMX Exporter path: ', jmxExporterPath)
  console.log('kafka yml path: ', kafkaYmlPath)
  console.log('server.properties path: ', serverPropertiesPath);
  console.log('kafka-server-start.sh path: ', kafkaServerStartPath);
  
//   // IMPORTANT: Creating kafka.service file with correct paths
//   // Needs paths for: jmx exporter, yml file, kafka server start sh, server.properties
//   // cp.execSync(`echo "[Service]" > kafka.service`);
//   // cp.execSync(`echo "Type=simple" >> kafka.service`);
//   // cp.execSync(`echo "Environment="JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64"" >> kafka.service`);
  
//   // cp.execSync(`echo "##Add the line below" >> kafka.service`);
//   // cp.execSync(`echo "Environment="KAFKA_OPTS=-javaagent:/usr/local/kafka-server/libs/jmx_prometheus_javaagent-0.13.0.jar=7075:/usr/local/kafka-server/config/sample_jmx_exporter.yml"" >> kafka.service`);
//   // cp.execSync(`echo "ExecStart=/usr/local/kafka-server/bin/kafka-server-start.sh /usr/local/kafka-server/config/server.properties" >> kafka.service`);
//   // cp.execSync(`echo "ExecStop=/usr/local/kafka-server/bin/kafka-server-stop.sh" >> kafka.service`);
//   // cp.execSync(`echo "Restart=on-abnormal" >> kafka.service`);




//   // CONFIGURE SYSTEMD
//   // CHECK FOR SYSTEMD
// //   const checkSystemDKafka = cp.execSync('find /etc/systemd/system -type f -iname "kafka.service"')
// //   const systemDPathString = checkSystemDKafka.toString();
// //   const resolvedSystemDPath = pathResolver(systemDPathString);
// // ​
// //   // do that thing u learned before about finding the specific line inside a file with GREP
// //   cp.execSync(`sudo rm ${resolvedSystemDPath}`);
// //   console.log('sucessfully removed original kafka.service file.');
// //   cp.execSync(`sudo cp kafka.service ${resolvedSystemDPath}`);

// //   // check if daemon reload and restart are both possible from this cwd
// //   console.log('new kafka.service file copied onto ~/systemd/system/. Beginning daemon-reload');
// //   cp.execSync('systemctl daemon-reload');
// //   cp.execSync('systemctl restart kafka');
// //   console.log('JMX Exporter has been installed and configured. You may now go to localhost:7075 to check metrics');
// // ​
//   // If it doesn't work then check for firewalls on that port
// ​
} catch (err) {
  console.log("err", err);
}