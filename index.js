const cp = require('child_process');
const { stdout, stderr } = require('process');

function pathResolver (foundPath) {

  let newStr = '';

  // loop and end if el is "\"
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
  // FIND USERS DESKTOP

  const JMXInstallerWindows = 'curl --output JMXFILE.jar https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'
  const JMXInstallerLinux = 'sudo wget https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'

  const currentWorkDir = {cwd: '..'}
  cp.execSync(`mkdir JMXFOLDER`, currentWorkDir)
  currentWorkDir.cwd = '../JMXFOLDER'

  cp.execSync(JMXInstallerWindows, currentWorkDir)
  console.log('JMX Exporter jar file successful')

  // Find JMX FOLDER PATH
  // MAKE THIS DYNAMIC!!!!
  console.log("...searching for Kafka-Server file Path...")
  const kafkaServerDir = cp.execSync('find /c/Users/ching/Desktop -type d -iname "Kafka-Server"');
  console.log('Kafka-Server directory found, copying JMX Exporter file to /Kafka-Server/libs/')

  const kafkaServerStr = kafkaServerDir.toString();
  const returned = pathResolver(kafkaServerStr);
  let kafkaLibsDir = `${returned}/libs/`;
 
  cp.execSync('cp JMXFILE.jar ' + kafkaLibsDir, currentWorkDir);
  console.log('exporter successfully copied to /kafka-server/libs/')


} catch (err) {
  console.log("err", err);
}