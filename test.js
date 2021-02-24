const cp = require('child_process');


try {
  // nano doesn't work
  // execfileSync(file, [args], {optins}, cb);
  const hey = cp.execSync('echo "please freakin work" > new.service');

  // YOU ARE A GOD.

  // cp.execSync(`echo "line 1" > new.service`);
  // cp.execSync(`echo "line 2" >> new.service`);
  // cp.execSync(`echo "line 3" >> new.service`);

  //  A GOD I TELL YOU. A GOD
  /**
    [Service]
    Type=simple
    Environment="JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64"
    ##Add the line below
    Environment="KAFKA_OPTS=-javaagent:/usr/local/kafka-server/libs/jmx_prometheus_javaagent-0.13.0.jar=7075:/usr/local/kafka-server/config/sample_jmx_exporter.yml"
    ExecStart=/usr/local/kafka-server/bin/kafka-server-start.sh /usr/local/kafka-server/config/server.properties
    ExecStop=/usr/local/kafka-server/bin/kafka-server-stop.sh
    Restart=on-abnormal
   */

  cp.execSync(`echo "[Service]" > new.service`);
  cp.execSync(`echo "Type=simple" >> new.service`);
  cp.execSync(`echo "Environment="JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64"" >> new.service`);
  cp.execSync(`echo "##Add the line below" >> new.service`);

  cp.execSync(`echo "Environment="KAFKA_OPTS=-javaagent:/usr/local/kafka-server/libs/jmx_prometheus_javaagent-0.13.0.jar=7075:/usr/local/kafka-server/config/sample_jmx_exporter.yml"" >> new.service`);
  cp.execSync(`echo "ExecStart=/usr/local/kafka-server/bin/kafka-server-start.sh /usr/local/kafka-server/config/server.properties" >> new.service`);
  cp.execSync(`echo "ExecStop=/usr/local/kafka-server/bin/kafka-server-stop.sh" >> new.service`);
  cp.execSync(`echo "Restart=on-abnormal" >> new.service`);


} catch (err) {
  console.log("err", err);
}
