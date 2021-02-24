const cp = require('child_process');
const { start } = require('repl');
​
  /**
   * WARNING: THIS JMX INSTALLATION SCRIPT WILL OVERRIDE ANY CUSTOM CONFIGURATIONS PREVIOUSLY DONE TO BOTH kafka-server-start.sh AND /systemd/system/kafka.service
   * 
   * THIS WILL HAVE NO EFFECT ON YOUR kafka.properties NOR YOUR zookeeper.properties FILES.
   * 
   * IF YOU WISH TO CONTINUE, DO X
   * OTHERWISE, MANUALLY JMX EXPORTER CONFIGURATION IS RECOMMENDED.
   */
​
  function pathResolver(foundPath) {
    let newStr = '';
    let starting = false;
    let fixedDir;
    if (foundPath[foundPath.length - 2] === 'e') {
      console.log("here?")
      for (let i = foundPath.length; i >= 0; i--) {
        let currentChar = foundPath[i];
        if (!starting) {
          if (currentChar === 'e') {
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
      console.log('found path!!!', foundPath);
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
​
try {​
  /**
   * - Need path to kafka-server-start.sh 
   *  - we get this later
   *  - 
   * - Need path to kafka's config/server.properties
   *  - get this later too for the yml file, but need to attach it to the server.properties file
   *    so that we can use the file path later for the kafka.service file
   * 
   * 
   *  The hardest part will be seeing how from node.js we can either create a new kafka.service file or edit it
   *  or we can copy in the kafka.service file first and then write on it later
   * 
   *      echo "whateever words" >> <file name>
   *      echo "hahaha" >> kafka.service
   * 
   *      to edit 
   *      sed 's/unix/linux/' this.service
   *      CHECK IF WORKS ON UBUNTU
   * 
   *  ALSO DON'T FORGET TO SUDO CHMOD +X KAFKA-SERVER-START.SH, SERVER.PROPERTIES, AND KAFKA.SERVICE
   * 
   * 
   *  IF USER DOESN'T WANT THEIR ORIGINAL CONFIGS EDITED, WILL CREATE NEW FILES WITH DIFF NAMES
   */
​
  const JMXInstallerWindows = 'curl --output JMXFILE.jar https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'
  const JMXInstallerLinux = 'sudo wget https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'
​
  // Create directory and download JMX Exporter Agent
  const currentWorkDir = {cwd: '..'};
  cp.execSync(`mkdir JMXFOLDER`, currentWorkDir)
  currentWorkDir.cwd = '../JMXFOLDER'
​
  cp.execSync(JMXInstallerWindows, currentWorkDir)
  // console.log('JMX Exporter jar file successful')

  // console.log("...searching for kafka directory...")
  const kafkaServerDir = cp.execSync('find /home -type d -iname "kafka_2.13-2.7.0*"');
  const kafkaServerStr = kafkaServerDir.toString();
  // console.log('path found on Erics computer', kafkaServerStr);
  const returned = pathResolver(kafkaServerStr);
  // console.log('RETURNED?', returned)
​
​
  const kafkaLibsDir = `${returned}/libs/`;
  cp.execSync('cp JMXFILE.jar ' + kafkaLibsDir, currentWorkDir);
  // console.log('exporter successfully copied to /kafka-server/libs/');
​
​
​
  // // Configure Exporter 
  const kafkaConfigDir = `${returned}/config/`
  const kafkaServerStart = `${returned}/bin/`
  cp.execSync(`cp kafka-2_0_0.yml ${kafkaConfigDir}`);

  // remove existing kafka-server-start.sh
  cp.execSync(`rm ${kafkaServerStart}kafka-server-start.sh`);
  // copy jmx configured one
  console.log('PREVIOUS KAFKA-SERVER-START.SH FILE DELETED');
  cp.execSync(`cp kafka-server-start.sh ${kafkaServerStart}`);
  console.log('NEW KAFKA-SERVER-START.SH FILE COPIED');
  
​
​
​
  // // CONFIGURE SYSTEMD
  const checkSystemDKafka = cp.execSync('find /etc/systemd/system -type f -iname "kafka.service"')
  const systemDPathString = checkSystemDKafka.toString();
  const resolvedSystemDPath = pathResolver(systemDPathString);
​
  // do that thing u learned before about finding the specific line inside a file with GREP
  cp.execSync(`sudo rm ${resolvedSystemDPath}`);
  console.log('sucessfully removed original kafka.service file.');
  cp.execSync(`sudo cp kafka.service ${resolvedSystemDPath}`);

  // check if daemon reload and restart are both possible from this cwd
  console.log('new kafka.service file copied onto ~/systemd/system/. Beginning daemon-reload');
  cp.execSync('systemctl daemon-reload');
  cp.execSync('systemctl restart kafka');
  console.log('JMX Exporter has been installed and configured. You may now go to localhost:7075 to check metrics');
​
  // If it doesn't work then check for firewalls on that port
​
} catch (err) {
  console.log("err", err);
}