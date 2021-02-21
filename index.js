const cp = require('child_process');
const { stdout, stderr } = require('process');


// cp.exec('mkdir YOYOYO', {cwd: ".."}, (err, stdout, stderr) => {
//   console.log('stdout', stdout)
// });

try {
  // USER SHOULD BE ON DESKTOP DIRECTORY
  const JMXInstallerWindows = 'curl --output JMXExporter https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'

  const JMXInstallerLinux = 'sudo wget https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar'

  /**
   * mkdir somefolder
   * curl --output filename https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.13.0/jmx_prometheus_javaagent-0.13.0.jar
   * 
   * 
   *  - make JMXFolder on desktop
   *    - done
   *  - go into JMXFolder
   *    - 
   *  - download JMX Exporter
   * 
   */

  // cwd is just the path address

  const currentWorkDir = {cwd: '..'}
  // go to desktop and make jmx folder
  cp.execSync(`mkdir JMXFOLDER`, currentWorkDir)
  // change cwd value to jmx folder and cd into it
  currentWorkDir.cwd = '../JMXFOLDER'

  cp.execSync(JMXInstallerLinux, currentWorkDir)
  console.log('trying exec sync');
  // JMX EXPORTER DOWNLOADED!

  



} catch (err) {
  console.log("err", err);
}