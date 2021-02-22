const cp = require('child_process');
const { stdout, stderr } = require('process');


// cp.exec('mkdir YOYOYO', {cwd: ".."}, (err, stdout, stderr) => {
//   console.log('stdout', stdout)
// });

try {
  // USER SHOULD BE ON DESKTOP DIRECTORY

  const JMXInstallerWindows = 'curl --output JMXFILE.jar https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'
  // const JMXInstallerLinux = 'sudo wget https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'

  const currentWorkDir = {cwd: '..'}
  cp.execSync(`mkdir JMXFOLDER`, currentWorkDir)
  currentWorkDir.cwd = '../JMXFOLDER'

  cp.execSync(JMXInstallerWindows, currentWorkDir)
  console.log('JMX Exporter jar file successful')

  // Find JMX FOLDER PATH
  // MAKE THIS DYNAMIC!!!!
  // the one that works: 'find /c/Users -type d -iname "Kafka-Server"'
  console.log("...searching for Kafka-Server file Path...")
  const kafkaServerDir = cp.execSync('find /c/Users/ching/Desktop -type d -iname "Kafka-Server"');
  console.log('Kafka-Server directory found, copying JMX Exporter file to /Kafka-Server/libs/')


  const kafkaServerStr = kafkaServerDir.toString();
  let newStr = '';
  // loop and end if el is "\"
  let starting = false;
  for(let i = kafkaServerStr.length; i >=0; i--){
    
    let currentChar = kafkaServerStr[i];
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
  let kafkaLibsDir = newStr.split('').reverse().join('') + '/libs/';

  // Copy JMXFILE.jar into the Kafka-Server/libs/ 
  // CLEARLY THIS WORKS: cp JMXFILE.jar /c/Users/ching/Desktop/Kafka-Server/libs/
  cp.execSync('cp JMXFILE.jar ' + kafkaLibsDir, currentWorkDir);

  /**
   *  1. Find out Kafka's Lib dir
   *    - find .   (searches current director)    
   *    - find <can be dir name>
   *    - find . -type d  (finds all dirs and no files)
   *    - find . -type f  (finds all files and no dirs)
   * 
   *    - find . -type f -name "<file name>"  finds file of exact name
   *    - find . -type f -name "<file name>*" wild card for any fitting that description
   *    - find . -type f -iname "<file name>" finds any files with name but not case sensitive
   * 
   *  2. Copy file onto Kafka's Lib dir
   */

} catch (err) {
  console.log("err", err);
}