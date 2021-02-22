const cp = require('child_process');
const { stdout, stderr } = require('process');

function pathResolver (foundPath) {

  let newStr = '';
  let starting = false;

  for(let i = foundPath.length; i >=0; i--){
    
    let currentChar = foundPath[i];
    if(!starting){
      if(currentChar === 'r'){
        starting = true;
        newStr+= currentChar
        continue;
      }
      continue;
    }
    newStr += currentChar
  }
  let fixedDir = newStr.split('').reverse().join('');

  return fixedDir
}

try {
  // FIND USERS DESKTOP!

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
  let kafkaLibsDir = `${returned}/libs/`;
 
  cp.execSync('cp JMXFILE.jar ' + kafkaLibsDir, currentWorkDir);
  console.log('exporter successfully copied to /kafka-server/libs/')

  // Configure Exporter 
  
  // update cwd to /kafka-server/config/
  const kafkaConfigDir = `${returned}/config/`

  // grab kafka-2_0_0.yml file from script dr and cp it to saved cwd
  cp.execSync(`cp kafka-2_0_0.yml ${kafkaConfigDir}`)
  console.log('samle jmx exporter yml file successfully copied')

} catch (err) {
  console.log("err", err);
}