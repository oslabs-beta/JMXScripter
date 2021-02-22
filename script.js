
  const JMXInstallerWindows = 'curl --output JMXFILE.jar https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'
  const JMXInstallerLinux = 'sudo wget https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'

  // Create directory and download JMX Exporter Agent
  const currentWorkDir = {cwd: '..'}
  // cp.execSync(`mkdir JMXFOLDER`, currentWorkDir)
  currentWorkDir.cwd = '../JMXFOLDER'

  // cp.execSync(JMXInstallerWindows, currentWorkDir)
  // console.log('JMX Exporter jar file successful')

  // Copy JMX jar file onto /kafka-server/libs/ directory
  // (MAKE THIS DYNAMIC!!!!)
  console.log("...searching for /kafka-server/ directory...")
  const kafkaServerDir = cp.execSync('find /c/Users/ching/Desktop -type d -iname "kafka-server"');
  console.log('Kafka-Server directory found, copying JMX Exporter file to /kafka-server/libs/')

  const kafkaServerStr = kafkaServerDir.toString();
  const returned = pathResolver(kafkaServerStr);
  const kafkaLibsDir = `${returned}/libs/`;
 
  cp.execSync('cp JMXFILE.jar ' + kafkaLibsDir, currentWorkDir);
  console.log('exporter successfully copied to /kafka-server/libs/')

  // Configure Exporter 
  const kafkaConfigDir = `${returned}/config/`
  const kafkaServerStart = `${returned}/bin`
  
  currentWorkDir.cwd = kafkaServerStart;
  console.log('kafka server bin?? ', currentWorkDir)
  // cp.execSync(`cp kafka-2_0_0.yml ${kafkaConfigDir}`)
  // console.log('samle jmx exporter yml file successfully copied')

  // // remove existing kafka-server-start.sh
  cp.execSync('mkdir YOYOYO', currentWorkDir)
  // cp.execSync('rm kafka-server-start.sh', {cwd: kafkaServerStart})

  // console.log('original kafka-server-start.sh file deleted')
  // copy jmx configured one
  // cp.execSync(`cp kafka-server-start.sh ${kafkaServerStart}`)
