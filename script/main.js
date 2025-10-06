var blogPost = document.querySelector(".posted");
var RecentPost = document.querySelector(".list-unstyled");
var bigDisplay_titl = document.querySelector(".display-4");
var bigDisplay_date = document.querySelector(".my-3");
var bigDisplay_more = document.querySelector(".mb-0");

var AddImg = (Folder, Name) => {
  return `<br><img src="../media/pictures/${Folder}/${Name}.jpg" width="640px" heigh="360px" alt="一張圖片"><br><br>`;
};
var AddTag = (tag, content) => {
  return `<${tag}>${content}</${tag}>`;
};
var data = [
  {
    date: "10月06號,2025",
    title: "Ubuntu 24.04 上建置 Hadoop 3.3.6 與 Spark 4.x（單機/多節點）完整指南",
    content: `<h1 id="ubuntu-24-04-hadoop-3-3-6-spark-4-x-">Ubuntu 24.04 上建置 Hadoop 3.3.6 與 Spark 4.x（單機/多節點）完整指南</h1>
<h2 id="-">主機的硬體配置</h2>
<ul>
<li>i7 12700h</li>
<li>32G ram</li>
</ul>
<p>本文件依據你的筆記重新整理，補齊步驟、修正易錯處（例如屬性名稱與常見埠號），並提供單機模式、YARN 叢集與 Spark Standalone 三種常見運行方式的操作說明。指令以 Ubuntu 24.04 LTS、VirtualBox、Windows 主機的 PowerShell 為主。</p>
<blockquote>
<p>提示</p>
<ul>
<li>文中以使用者 <code>hduser</code> 為例，請依你的實際使用者替換。</li>
<li>Hadoop 3.3.6 與 JDK 17 相容；Spark 版本以你實際下載為準（文中示例為 4.0.x，下載網址請至官方頁面確認最新版本）。</li>
</ul>
</blockquote>
<hr>
<h2 id="1-">1. 環境與版本</h2>
<ul>
<li>Host：Windows（使用 PowerShell 操作 VirtualBox）</li>
<li>VM：Ubuntu 24.04 LTS</li>
<li>Java：OpenJDK 17</li>
<li>Hadoop：3.3.6</li>
<li>Scala：2.13.x（Spark 需 Scala 適配版本）</li>
<li>Spark：4.0.x（hadoop3 發行包）</li>
<li>拓樸：<ul>
<li>單機：master（本機）</li>
<li>多節點（示例）：master、data1、data2、data3（Host-Only 網段 192.168.56.0/24）</li>
</ul>
</li>
</ul>
<hr>
<h2 id="2-vm-">2. VM 初始設定</h2>
<h3 id="2-1-guest-additions-">2.1 Guest Additions 與剪貼簿</h3>
<ol>
<li><p>在 Ubuntu 內安裝必要套件：</p>
<pre><code class="lang-bash">sudo apt update
sudo apt <span class="hljs-keyword">install </span>-y <span class="hljs-keyword">bzip2 </span>tar <span class="hljs-keyword">build-essential </span>linux-headers-$(uname -r)
</code></pre>
</li>
<li><p>掛載並安裝 Guest Additions（VirtualBox 功能表：裝置 &gt; 插入來賓增強功能光碟映像…），安裝完成後重開機。</p>
</li>
<li><p>關機並在 VM 設定中啟用「雙向剪貼簿」。</p>
</li>
</ol>
<hr>
<h2 id="3-">3. 系統工具與使用者準備</h2>
<ul>
<li>安裝 SSH 伺服器與 rsync、net-tools：</li>
</ul>
<pre><code class="lang-bash">sudo apt <span class="hljs-keyword">install</span> -y openssh-<span class="hljs-keyword">server</span> rsync net-tools
</code></pre>
<ul>
<li>建議建立專用帳號（若尚未建立）：</li>
</ul>
<pre><code class="lang-bash"><span class="hljs-symbol">sudo</span> <span class="hljs-keyword">adduser </span>hduser
<span class="hljs-symbol">sudo</span> usermod -aG sudo hduser
</code></pre>
<ul>
<li>以 <code>hduser</code> 登入或切換：</li>
</ul>
<pre><code class="lang-bash"><span class="hljs-attribute">su - hduser</span>
</code></pre>
<ul>
<li>產生 SSH 金鑰（Ubuntu 24.04 建議使用 RSA 或 Ed25519；此處以 RSA 為例）：</li>
</ul>
<pre><code class="lang-bash">ssh-keygen -t rsa -<span class="hljs-selector-tag">b</span> <span class="hljs-number">4096</span> -f ~/.ssh/id_rsa -N <span class="hljs-string">""</span>
cat ~/.ssh/id_rsa<span class="hljs-selector-class">.pub</span> &gt;&gt; ~/.ssh/authorized_keys
chmod <span class="hljs-number">700</span> ~/<span class="hljs-selector-class">.ssh</span>
chmod <span class="hljs-number">600</span> ~/.ssh/authorized_keys
</code></pre>
<hr>
<h2 id="4-java-openjdk-17-">4. 安裝 Java（OpenJDK 17）</h2>
<pre><code class="lang-bash">sudo apt <span class="hljs-keyword">install </span>-y openjdk-17-<span class="hljs-keyword">jre-headless
</span>update-alternatives --<span class="hljs-keyword">display </span><span class="hljs-keyword">java</span>
</code></pre>
<p>記錄 JAVA_HOME 路徑（Ubuntu 24.04 通常為 <code>/usr/lib/jvm/java-17-openjdk-amd64</code>）。</p>
<hr>
<h2 id="5-hadoop-3-3-6">5. 安裝 Hadoop 3.3.6</h2>
<pre><code class="lang-bash">wget <span class="hljs-string">https:</span><span class="hljs-comment">//dlcdn.apache.org/hadoop/common/hadoop-3.3.6/hadoop-3.3.6.tar.gz</span>
sudo tar -zxvf hadoop<span class="hljs-number">-3.3</span><span class="hljs-number">.6</span>.tar.gz -C <span class="hljs-regexp">/usr/</span>local/
sudo mv <span class="hljs-regexp">/usr/</span>local<span class="hljs-regexp">/hadoop-3.3.6 /</span>usr<span class="hljs-regexp">/local/</span>hadoop
sudo chown -R <span class="hljs-string">hduser:</span>hduser <span class="hljs-regexp">/usr/</span>local/hadoop
</code></pre>
<h3 id="5-1-bashrc-">5.1 環境變數（~/.bashrc）</h3>
<p>在檔尾加入並套用：</p>
<pre><code class="lang-bash"><span class="hljs-comment"># ===== Java &amp; Hadoop =====</span>
<span class="hljs-built_in">export</span> JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
<span class="hljs-built_in">export</span> HADOOP_HOME=/usr/<span class="hljs-built_in">local</span>/hadoop
<span class="hljs-built_in">export</span> PATH=<span class="hljs-variable">$PATH</span>:<span class="hljs-variable">$JAVA_HOME</span>/bin:<span class="hljs-variable">$HADOOP_HOME</span>/bin:<span class="hljs-variable">$HADOOP_HOME</span>/sbin

<span class="hljs-comment"># Component HOMEs</span>
<span class="hljs-built_in">export</span> HADOOP_MAPRED_HOME=<span class="hljs-variable">$HADOOP_HOME</span>
<span class="hljs-built_in">export</span> HADOOP_COMMON_HOME=<span class="hljs-variable">$HADOOP_HOME</span>
<span class="hljs-built_in">export</span> HADOOP_HDFS_HOME=<span class="hljs-variable">$HADOOP_HOME</span>
<span class="hljs-built_in">export</span> YARN_HOME=<span class="hljs-variable">$HADOOP_HOME</span>

<span class="hljs-comment"># Native libs &amp; JVM opts</span>
<span class="hljs-built_in">export</span> HADOOP_COMMON_LIB_NATIVE_DIR=<span class="hljs-variable">$HADOOP_HOME</span>/lib/native
<span class="hljs-built_in">export</span> HADOOP_OPTS=<span class="hljs-string">"<span class="hljs-variable">$HADOOP_OPTS</span> -Djava.library.path=<span class="hljs-variable">$HADOOP_HOME</span>/lib"</span>
<span class="hljs-comment"># Java 9+ modules (避免反射受限)</span>
<span class="hljs-built_in">export</span> HADOOP_OPTS=<span class="hljs-string">"<span class="hljs-variable">$HADOOP_OPTS</span> --add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.nio=ALL-UNNAMED"</span>
</code></pre>
<p>套用：</p>
<pre><code class="lang-bash"><span class="hljs-built_in">source</span> ~/.bashrc
</code></pre>
<h3 id="5-2-hadoop-">5.2 Hadoop 設定檔</h3>
<ul>
<li><code>hadoop-env.sh</code>：</li>
</ul>
<pre><code class="lang-bash">sed -i <span class="hljs-string">'s|^#*\s*export JAVA_HOME=.*$|export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64|'</span> <span class="hljs-regexp">/usr/</span>local<span class="hljs-regexp">/hadoop/</span>etc<span class="hljs-regexp">/hadoop/</span>hadoop-env.sh
</code></pre>
<ul>
<li><code>core-site.xml</code>（注意屬性名已改為 fs.defaultFS，不是 fs.default.name）：</li>
</ul>
<p><code>/usr/local/hadoop/etc/hadoop/core-site.xml</code></p>
<pre><code class="lang-xml"><span class="hljs-tag">&lt;<span class="hljs-name">configuration</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">property</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">name</span>&gt;</span>fs.defaultFS<span class="hljs-tag">&lt;/<span class="hljs-name">name</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">value</span>&gt;</span>hdfs://localhost:9000<span class="hljs-tag">&lt;/<span class="hljs-name">value</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">property</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">configuration</span>&gt;</span>
</code></pre>
<ul>
<li><code>hdfs-site.xml</code>（單機初始值）：</li>
</ul>
<p><code>/usr/local/hadoop/etc/hadoop/hdfs-site.xml</code></p>
<pre><code class="lang-xml"><span class="hljs-tag">&lt;<span class="hljs-name">configuration</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">property</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">name</span>&gt;</span>dfs.replication<span class="hljs-tag">&lt;/<span class="hljs-name">name</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">value</span>&gt;</span>1<span class="hljs-tag">&lt;/<span class="hljs-name">value</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">property</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">property</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">name</span>&gt;</span>dfs.namenode.name.dir<span class="hljs-tag">&lt;/<span class="hljs-name">name</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">value</span>&gt;</span>file:/usr/local/hadoop/hadoop_data/hdfs/namenode<span class="hljs-tag">&lt;/<span class="hljs-name">value</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">property</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">property</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">name</span>&gt;</span>dfs.datanode.data.dir<span class="hljs-tag">&lt;/<span class="hljs-name">name</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">value</span>&gt;</span>file:/usr/local/hadoop/hadoop_data/hdfs/datanode<span class="hljs-tag">&lt;/<span class="hljs-name">value</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">property</span>&gt;</span>
  <span class="hljs-comment">&lt;!-- 可選：將 NameNode Web UI 從預設 9870 改回 50070（較舊教材常見） --&gt;</span>
  <span class="hljs-comment">&lt;!--
  &lt;property&gt;
    &lt;name&gt;dfs.namenode.http-address&lt;/name&gt;
    &lt;value&gt;0.0.0.0:50070&lt;/value&gt;
  &lt;/property&gt;
  --&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">configuration</span>&gt;</span>
</code></pre>
<ul>
<li><code>yarn-site.xml</code>（YARN 基本設定，用預設埠即可）：</li>
</ul>
<p><code>/usr/local/hadoop/etc/hadoop/yarn-site.xml</code></p>
<pre><code class="lang-xml"><span class="hljs-tag">&lt;<span class="hljs-name">configuration</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">property</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">name</span>&gt;</span>yarn.nodemanager.aux-services<span class="hljs-tag">&lt;/<span class="hljs-name">name</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">value</span>&gt;</span>mapreduce_shuffle<span class="hljs-tag">&lt;/<span class="hljs-name">value</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">property</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">property</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">name</span>&gt;</span>yarn.nodemanager.aux-services.mapreduce.shuffle.class<span class="hljs-tag">&lt;/<span class="hljs-name">name</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">value</span>&gt;</span>org.apache.hadoop.mapred.ShuffleHandler<span class="hljs-tag">&lt;/<span class="hljs-name">value</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">property</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">configuration</span>&gt;</span>
</code></pre>
<ul>
<li><code>mapred-site.xml</code>（MapReduce on YARN）：</li>
</ul>
<p>若檔案不存在，先從範本建立：</p>
<pre><code class="lang-bash">cp <span class="hljs-regexp">/usr/</span>local<span class="hljs-regexp">/hadoop/</span>etc<span class="hljs-regexp">/hadoop/m</span>apred-site.xml.template <span class="hljs-regexp">/usr/</span>local<span class="hljs-regexp">/hadoop/</span>etc<span class="hljs-regexp">/hadoop/m</span>apred-site.xml
</code></pre>
<p>內容：</p>
<pre><code class="lang-xml"><span class="hljs-tag">&lt;<span class="hljs-name">configuration</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">property</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">name</span>&gt;</span>mapreduce.framework.name<span class="hljs-tag">&lt;/<span class="hljs-name">name</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">value</span>&gt;</span>yarn<span class="hljs-tag">&lt;/<span class="hljs-name">value</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">property</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">configuration</span>&gt;</span>
</code></pre>
<blockquote>
<p>注意：<code>mapred.job.tracker</code> 為 MRv1（已淘汰）設定，使用 YARN 時請不要設定它。</p>
</blockquote>
<h3 id="5-3-hdfs-">5.3 建立並格式化 HDFS 目錄</h3>
<pre><code class="lang-bash">sudo mkdir -p <span class="hljs-meta-keyword">/usr/</span>local<span class="hljs-meta-keyword">/hadoop/</span>hadoop_data<span class="hljs-meta-keyword">/hdfs/</span>namenode
sudo mkdir -p <span class="hljs-meta-keyword">/usr/</span>local<span class="hljs-meta-keyword">/hadoop/</span>hadoop_data<span class="hljs-meta-keyword">/hdfs/</span>datanode
sudo chown -R hduser:hduser <span class="hljs-meta-keyword">/usr/</span>local/hadoop

<span class="hljs-meta"># 第一次格式化（使用 hdfs 子命令）</span>
hdfs namenode -format
</code></pre>
<h3 id="5-4-hadoop-">5.4 啟動/停止 Hadoop（單機）</h3>
<pre><code class="lang-bash">start-dfs.<span class="hljs-keyword">sh</span>
start-yarn.<span class="hljs-keyword">sh</span>
# 或舊的一鍵腳本（仍可用）：start-<span class="hljs-keyword">all</span>.<span class="hljs-keyword">sh</span>

# 驗證 Java 行程
jps

# 停止
<span class="hljs-keyword">stop</span>-yarn.<span class="hljs-keyword">sh</span>
<span class="hljs-keyword">stop</span>-dfs.<span class="hljs-keyword">sh</span>
# 或：<span class="hljs-keyword">stop</span>-<span class="hljs-keyword">all</span>.<span class="hljs-keyword">sh</span>
</code></pre>
<p>Web UI：</p>
<ul>
<li>NameNode：<code>http://localhost:9870/</code>（或若你改過屬性則為 <code>http://localhost:50070/</code>）</li>
<li>ResourceManager：<code>http://localhost:8088/</code></li>
</ul>
<hr>
<h2 id="6-">6. 多網卡與主機名稱設定（叢集）</h2>
<p>本節用於多節點部署（master、data1、data2、data3）。</p>
<h3 id="6-1-netplan-ubuntu-24-04-">6.1 Netplan 設定（Ubuntu 24.04）</h3>
<p>編輯 <code>/etc/netplan/01-network-manager-all.yaml</code>（需 root）：</p>
<pre><code class="lang-yaml"><span class="hljs-attr">network:</span>
<span class="hljs-attr">  version:</span> <span class="hljs-number">2</span>
<span class="hljs-attr">  renderer:</span> networkd
<span class="hljs-attr">  ethernets:</span>
    <span class="hljs-comment"># 網卡 1: NAT 對外連網</span>
<span class="hljs-attr">    enp0s3:</span>
<span class="hljs-attr">      dhcp4:</span> <span class="hljs-literal">true</span>
<span class="hljs-attr">      nameservers:</span>
<span class="hljs-attr">        addresses:</span> [<span class="hljs-number">8.8</span><span class="hljs-number">.8</span><span class="hljs-number">.8</span>, <span class="hljs-number">8.8</span><span class="hljs-number">.4</span><span class="hljs-number">.4</span>]
    <span class="hljs-comment"># 網卡 2: Host-Only / Internal（靜態 IP）</span>
<span class="hljs-attr">    enp0s8:</span>
<span class="hljs-attr">      dhcp4:</span> <span class="hljs-literal">no</span>
<span class="hljs-attr">      addresses:</span> [<span class="hljs-number">192.168</span><span class="hljs-number">.56</span><span class="hljs-number">.101</span>/<span class="hljs-number">24</span>]   <span class="hljs-comment"># master、data2/3 請改對應 IP</span>
</code></pre>
<p>套用：</p>
<pre><code class="lang-bash">sudo chmod <span class="hljs-number">600</span> /etc/netplan/<span class="hljs-number">01</span>-network-manager-all.yaml
sudo netplan apply
ip a
</code></pre>
<h3 id="6-2-hostname-hosts">6.2 Hostname 與 hosts</h3>
<ul>
<li>設定 hostname（各節點分別執行）：</li>
</ul>
<pre><code class="lang-bash"><span class="hljs-string">sudo </span><span class="hljs-string">hostnamectl </span><span class="hljs-built_in">set-hostname</span> <span class="hljs-string">master </span>  <span class="hljs-comment"># 其他節點改為 data1 / data2 / data3</span>
</code></pre>
<ul>
<li><code>/etc/hosts</code>（所有節點一致）：</li>
</ul>
<pre><code class="lang-text"># <span class="hljs-selector-tag">Masternode</span> <span class="hljs-selector-tag">and</span> <span class="hljs-selector-tag">Worker</span> <span class="hljs-selector-tag">nodes</span> <span class="hljs-selector-tag">for</span> <span class="hljs-selector-tag">Hadoop</span> <span class="hljs-selector-tag">Cluster</span>
192<span class="hljs-selector-class">.168</span><span class="hljs-selector-class">.56</span><span class="hljs-selector-class">.100</span> <span class="hljs-selector-tag">master</span>
192<span class="hljs-selector-class">.168</span><span class="hljs-selector-class">.56</span><span class="hljs-selector-class">.101</span> <span class="hljs-selector-tag">data1</span>
192<span class="hljs-selector-class">.168</span><span class="hljs-selector-class">.56</span><span class="hljs-selector-class">.102</span> <span class="hljs-selector-tag">data2</span>
192<span class="hljs-selector-class">.168</span><span class="hljs-selector-class">.56</span><span class="hljs-selector-class">.103</span> <span class="hljs-selector-tag">data3</span>
</code></pre>
<h3 id="6-3-hadoop-">6.3 Hadoop 叢集設定差異</h3>
<ul>
<li><code>core-site.xml</code> 在所有節點都改為指向 master：</li>
</ul>
<pre><code class="lang-xml"><span class="hljs-tag">&lt;<span class="hljs-name">property</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">name</span>&gt;</span>fs.defaultFS<span class="hljs-tag">&lt;/<span class="hljs-name">name</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">value</span>&gt;</span>hdfs://master:9000<span class="hljs-tag">&lt;/<span class="hljs-name">value</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">property</span>&gt;</span>
</code></pre>
<ul>
<li><code>hdfs-site.xml</code>：<ul>
<li>master 需有 <code>dfs.namenode.name.dir</code></li>
<li>workers 需有 <code>dfs.datanode.data.dir</code></li>
<li>叢集示例將 <code>dfs.replication</code> 設為 3（你有三個 DataNode 時）：</li>
</ul>
</li>
</ul>
<pre><code class="lang-xml"><span class="hljs-tag">&lt;<span class="hljs-name">property</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">name</span>&gt;</span>dfs.replication<span class="hljs-tag">&lt;/<span class="hljs-name">name</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">value</span>&gt;</span>3<span class="hljs-tag">&lt;/<span class="hljs-name">value</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">property</span>&gt;</span>
</code></pre>
<ul>
<li><code>workers</code> 檔案（Hadoop 3 預設檔名，不是 slaves）：</li>
</ul>
<p><code>/usr/local/hadoop/etc/hadoop/workers</code></p>
<pre><code class="lang-text"><span class="hljs-keyword">data</span>1
<span class="hljs-keyword">data</span>2
<span class="hljs-keyword">data</span>3
</code></pre>
<ul>
<li><p>master 節點可選擇設定 <code>/usr/local/hadoop/etc/hadoop/masters</code> 內容為 <code>master</code>（視發行版與腳本使用情境）。</p>
</li>
<li><p>若曾在單機下格式化過 HDFS，改為叢集前請在所有節點清理舊資料目錄（謹慎執行）：</p>
</li>
</ul>
<pre><code class="lang-bash">sudo rm -rf <span class="hljs-regexp">/usr/</span>local<span class="hljs-regexp">/hadoop/</span>hadoop_data/hdfs
sudo mkdir -p <span class="hljs-regexp">/usr/</span>local<span class="hljs-regexp">/hadoop/</span>hadoop_data<span class="hljs-regexp">/hdfs/</span>datanode
sudo chown -R <span class="hljs-string">hduser:</span>hduser <span class="hljs-regexp">/usr/</span>local/hadoop
</code></pre>
<ul>
<li>僅在 master 再次格式化 NameNode：</li>
</ul>
<pre><code class="lang-bash">hdfs namenode -<span class="hljs-built_in">format</span>
</code></pre>
<ul>
<li>啟動叢集（在 master）：</li>
</ul>
<pre><code class="lang-bash">start-dfs.<span class="hljs-keyword">sh
</span>start-yarn.<span class="hljs-keyword">sh
</span><span class="hljs-keyword">jps
</span>
<span class="hljs-comment"># 檢查各 worker（可用免密 SSH）：</span>
ssh data1 <span class="hljs-keyword">jps
</span>ssh data2 <span class="hljs-keyword">jps
</span>ssh data3 <span class="hljs-keyword">jps</span>
</code></pre>
<h3 id="6-4-windows-powershell-virtualbox-">6.4 從 Windows 主機以 PowerShell 控制 VirtualBox（可選）</h3>
<p>切到 VirtualBox 安裝目錄，例如：<code>C:\Program Files\Oracle\VirtualBox</code> 或你的實際安裝路徑。</p>
<pre><code class="lang-powershell"># 啟動為背景（無頭）
./VBoxManage.<span class="hljs-keyword">exe</span> startvm <span class="hljs-string">"data1"</span> --<span class="hljs-built_in">type</span> headless
./VBoxManage.<span class="hljs-keyword">exe</span> startvm <span class="hljs-string">"data2"</span> --<span class="hljs-built_in">type</span> headless
./VBoxManage.<span class="hljs-keyword">exe</span> startvm <span class="hljs-string">"data3"</span> --<span class="hljs-built_in">type</span> headless

# 查詢執行中 VM
./VBoxManage.<span class="hljs-keyword">exe</span> <span class="hljs-keyword">list</span> runningvms

# 優雅關機（ACPI 按鈕）
./VBoxManage.<span class="hljs-keyword">exe</span> controlvm <span class="hljs-string">"你的VM名稱"</span> acpipowerbutton
</code></pre>
<blockquote>
<p>PowerShell 可用 <code>.</code> 或 <code>./</code> 執行同目錄程式；若在 PATH 中可直接下 <code>VBoxManage</code>。</p>
</blockquote>
<hr>
<h2 id="7-scala-spark">7. 安裝 Scala 與 Spark</h2>
<h3 id="7-1-scala-spark-">7.1 Scala（版本需與 Spark 相容）</h3>
<pre><code class="lang-bash">wget https:<span class="hljs-comment">//www.scala-lang.org/files/archive/scala-2.13.16.tgz</span>
tar xvf <span class="hljs-keyword">scala</span>-2.13.16.tgz
sudo mv <span class="hljs-keyword">scala</span>-2.13.16 /usr/<span class="hljs-keyword">local</span>/<span class="hljs-keyword">scala</span>

# ~/.bashrc
export SCALA_HOME=/usr/<span class="hljs-keyword">local</span>/<span class="hljs-keyword">scala</span>
export PATH=<span class="hljs-variable">$PATH</span>:<span class="hljs-variable">$SCALA_HOME</span>/bin

source ~/.bashrc
<span class="hljs-keyword">scala</span> -<span class="hljs-keyword">version</span>
</code></pre>
<h3 id="7-2-spark-hadoop3-">7.2 Spark（以 hadoop3 套件為例）</h3>
<pre><code class="lang-bash">wget https://dlcdn.apache.org/spark/spark-4.0.1/spark-4.0.1-bin-hadoop3.tgz
tar zxf spark-4.0.1-bin-hadoop3.tgz
sudo mv spark-4.0.1-bin-hadoop3 /usr/<span class="hljs-built_in">local</span>/spark

<span class="hljs-comment"># ~/.bashrc</span>
<span class="hljs-built_in">export</span> SPARK_HOME=/usr/<span class="hljs-built_in">local</span>/spark
<span class="hljs-built_in">export</span> PATH=<span class="hljs-variable">$PATH</span>:<span class="hljs-variable">$SPARK_HOME</span>/bin

<span class="hljs-built_in">source</span> ~/.bashrc
</code></pre>
<ul>
<li>降噪（log4j2）：</li>
</ul>
<pre><code class="lang-bash">cp <span class="hljs-regexp">/usr/</span>local<span class="hljs-regexp">/spark/</span>conf<span class="hljs-regexp">/log4j2.properties.template /u</span>sr<span class="hljs-regexp">/local/</span>spark<span class="hljs-regexp">/conf/</span>log4j2.properties
sed -i <span class="hljs-string">'s/^rootLogger.level\s*=\s*info/rootLogger.level=warn/'</span> <span class="hljs-regexp">/usr/</span>local<span class="hljs-regexp">/spark/</span>conf<span class="hljs-regexp">/log4j2.properties</span>
</code></pre>
<hr>
<h2 id="8-hdfs-">8. HDFS 測試資料與基本操作</h2>
<pre><code class="lang-bash"><span class="hljs-meta"># 建立 HDFS 目錄</span>
hdfs dfs -mkdir -p <span class="hljs-meta-keyword">/user/</span>hduser<span class="hljs-meta-keyword">/wordcount/</span>input

<span class="hljs-meta"># 準備本機檔並上傳</span>
mkdir -p ~<span class="hljs-meta-keyword">/wordcount/</span>input
cp <span class="hljs-meta-keyword">/usr/</span>local<span class="hljs-meta-keyword">/hadoop/</span>LICENSE.txt ~<span class="hljs-meta-keyword">/wordcount/</span>input/
hdfs dfs -put -f ~<span class="hljs-meta-keyword">/wordcount/</span>input/LICENSE.txt <span class="hljs-meta-keyword">/user/</span>hduser<span class="hljs-meta-keyword">/wordcount/</span>input/

<span class="hljs-meta"># 檢查</span>
hdfs dfs -ls -R <span class="hljs-meta-keyword">/user/</span>hduser/wordcount
</code></pre>
<hr>
<h2 id="9-pyspark-">9. 執行 PySpark（三種模式）</h2>
<h3 id="9-1-">9.1 本機模式</h3>
<pre><code class="lang-bash">pyspark --<span class="hljs-keyword">master</span> <span class="hljs-title">local</span>[*]
</code></pre>
<p>在 Spark Shell 內：</p>
<pre><code class="lang-python">sc.<span class="hljs-keyword">master</span>
<span class="hljs-title">textFile</span> = sc.textFile(<span class="hljs-string">"file:/usr/local/spark/README.md"</span>)
textFile.count()
</code></pre>
<h3 id="9-2-yarn-client-">9.2 YARN（client 模式）</h3>
<pre><code class="lang-bash"><span class="hljs-attr">HADOOP_CONF_DIR=</span>/usr/local/hadoop/etc/hadoop pyspark --<span class="hljs-keyword">master</span> <span class="hljs-title">yarn</span> --deploy-mode client
</code></pre>
<p>在 Spark Shell 內：</p>
<pre><code class="lang-python">sc.<span class="hljs-keyword">master</span>
<span class="hljs-title">textFile</span> = sc.textFile(<span class="hljs-string">"hdfs://master:9000/user/hduser/wordcount/input/LICENSE.txt"</span>)
textFile.count()
</code></pre>
<p>可於 <code>http://master:8088/</code> 檢視應用狀態。</p>
<h3 id="9-3-spark-standalone-">9.3 Spark Standalone 叢集</h3>
<ul>
<li>建立 <code>spark-env.sh</code>：</li>
</ul>
<pre><code class="lang-bash">cp <span class="hljs-variable">$SPARK_HOME</span><span class="hljs-regexp">/conf/</span>spark-env.sh.template <span class="hljs-variable">$SPARK_HOME</span><span class="hljs-regexp">/conf/</span>spark-env.sh

<span class="hljs-comment"># 內容（依硬體調整）</span>
cat &gt;&gt; <span class="hljs-variable">$SPARK_HOME</span><span class="hljs-regexp">/conf/</span>spark-env.sh &lt;&lt;<span class="hljs-string">'EOF'</span>
export SPARK_MASTER_IP=master
export SPARK_WORKER_CORES=<span class="hljs-number">1</span>
export SPARK_WORKER_MEMORY=<span class="hljs-number">512</span>m
<span class="hljs-comment"># 只在 Standalone 的 dynamic allocation 相關情境有用；或留空</span>
<span class="hljs-comment"># export SPARK_EXECUTOR_INSTANCES=4</span>
EOF
</code></pre>
<ul>
<li>workers 檔案：</li>
</ul>
<pre><code class="lang-bash">cat &gt; <span class="hljs-variable">$SPARK_HOME</span>/conf/workers &lt;&lt;<span class="hljs-string">'EOF'</span>
<span class="hljs-keyword">data</span>1
<span class="hljs-keyword">data</span>2
<span class="hljs-keyword">data</span>3
EOF
</code></pre>
<ul>
<li>將 Spark 複製到各 worker（從 master 執行，需免密）：</li>
</ul>
<pre><code class="lang-bash">ssh data1 <span class="hljs-string">'sudo mkdir -p /usr/local &amp;&amp; sudo chown hduser:hduser /usr/local'</span>
scp -r /usr/local/spark hduser<span class="hljs-variable">@data1</span><span class="hljs-symbol">:/usr/local/</span>
scp -r /usr/local/spark hduser<span class="hljs-variable">@data2</span><span class="hljs-symbol">:/usr/local/</span>
scp -r /usr/local/spark hduser<span class="hljs-variable">@data3</span><span class="hljs-symbol">:/usr/local/</span>
</code></pre>
<ul>
<li>啟動/停止 Standalone 叢集（在 master）：</li>
</ul>
<pre><code class="lang-bash">/usr/local/spark/sbin/start-<span class="hljs-keyword">all</span>.<span class="hljs-keyword">sh</span>
/usr/local/spark/sbin/<span class="hljs-keyword">stop</span>-<span class="hljs-keyword">all</span>.<span class="hljs-keyword">sh</span>
</code></pre>
<ul>
<li>以 Standalone 運行 PySpark：</li>
</ul>
<pre><code class="lang-bash">pyspark --<span class="hljs-keyword">master</span> <span class="hljs-title">spark</span>://<span class="hljs-literal">master</span>:<span class="hljs-number">7077</span> \
  --num-executors <span class="hljs-number">1</span> --total-executor-cores <span class="hljs-number">3</span> \
  --executor-memory <span class="hljs-number">512m</span>

<span class="hljs-comment"># 或</span>
pyspark --<span class="hljs-keyword">master</span> <span class="hljs-title">spark</span>://<span class="hljs-literal">master</span>:<span class="hljs-number">7077</span> \
  --driver-memory <span class="hljs-number">512m</span> \
  --conf spark.executor.<span class="hljs-attr">memory=</span><span class="hljs-number">512m</span> \
  --conf spark.executor.<span class="hljs-attr">cores=</span><span class="hljs-number">1</span>
</code></pre>
<p>Shell 內測試：</p>
<pre><code class="lang-python"><span class="hljs-keyword">sc</span>.master
textFile = <span class="hljs-keyword">sc</span>.textFile(<span class="hljs-string">"file:/usr/local/spark/README.md"</span>)
textFile.<span class="hljs-keyword">count</span>()
textFile = <span class="hljs-keyword">sc</span>.textFile(<span class="hljs-string">"hdfs://master:9000/user/hduser/wordcount/input/LICENSE.txt"</span>)
textFile.<span class="hljs-keyword">count</span>()
</code></pre>
<hr>
<h2 id="10-troubleshooting-">10. 常見問題（Troubleshooting）</h2>
<ul>
<li>JAVA_HOME 錯誤：確認 <code>/usr/lib/jvm/java-17-openjdk-amd64</code>，並同步於 <code>hadoop-env.sh</code> 與 <code>~/.bashrc</code>。</li>
<li>fs.defaultFS 屬性名：請用 <code>fs.defaultFS</code>，不要再用過時的 <code>fs.default.name</code>。</li>
<li>首次改為叢集時請重新格式化 NameNode，且清理各節點舊的 datanode 目錄（資料會清除）。</li>
<li>9870 vs 50070：Hadoop 3 預設 NameNode Web UI 為 9870；如教材使用 50070，需於 <code>hdfs-site.xml</code> 額外設定。</li>
<li>YARN 埠號：通常使用預設即可（RM IPC 8032、Scheduler 8030、ResourceTracker 8031、Web UI 8088）。若手動指定，請確保未衝突且所有節點一致。</li>
<li>SSH 免密：確保各節點 <code>authorized_keys</code> 正確、檔案權限設定妥當、主機名與 /etc/hosts 解析一致。</li>
<li>權限問題：Hadoop/Spark 安裝目錄與資料目錄應由執行者（例如 hduser）擁有。</li>
<li>記憶體不足：調整 <code>SPARK_WORKER_MEMORY</code>、<code>--executor-memory</code>、<code>--driver-memory</code> 或減少 core 數。</li>
</ul>
<hr>
<h2 id="11-vm-">11. 服務關閉與 VM 管理</h2>
<ul>
<li>關閉 Spark：</li>
</ul>
<pre><code class="lang-bash">/usr/local/spark/sbin/<span class="hljs-keyword">stop</span>-<span class="hljs-keyword">all</span>.<span class="hljs-keyword">sh</span>
</code></pre>
<ul>
<li>關閉 Hadoop：</li>
</ul>
<pre><code class="lang-bash"><span class="hljs-keyword">stop</span>-yarn.<span class="hljs-keyword">sh</span>
<span class="hljs-keyword">stop</span>-dfs.<span class="hljs-keyword">sh</span>
</code></pre>
<ul>
<li>關機 VM（Ubuntu 內）：</li>
</ul>
<pre><code class="lang-bash">sudo <span class="hljs-built_in">shutdown</span> -h now
</code></pre>
<ul>
<li>Windows 主機 PowerShell（VirtualBox）：</li>
</ul>
<pre><code class="lang-powershell">./VBoxManage<span class="hljs-selector-class">.exe</span> controlvm <span class="hljs-string">"你的VM名稱"</span> acpipowerbutton
</code></pre>
<hr>
<h2 id="12-cheat-sheet-">12. 速查（Cheat Sheet）</h2>
<ul>
<li>啟動 Hadoop（叢集）：<ul>
<li>master：<code>start-dfs.sh &amp;&amp; start-yarn.sh</code></li>
</ul>
</li>
<li>檢查 Java 行程：<code>jps</code>（master、data1、data2、data3）</li>
<li>Web UI：<ul>
<li>NameNode：<code>http://master:9870/</code>（或 <code>50070</code> 若你改過）</li>
<li>YARN RM：<code>http://master:8088/</code></li>
<li>Spark Standalone Master：<code>http://master:8080/</code>（預設）</li>
</ul>
</li>
<li>PySpark：<ul>
<li>本機：<code>pyspark --master local[*]</code></li>
<li>YARN：<code>HADOOP_CONF_DIR=/usr/local/hadoop/etc/hadoop pyspark --master yarn --deploy-mode client</code></li>
<li>Standalone：<code>pyspark --master spark://master:7077</code></li>
</ul>
</li>
</ul>
<hr>
<p>附錄：請依實際環境更新版本與下載網址。若遇到套件來源鏡像問題，可以改用地區鏡像站或透過瀏覽器手動下載並上傳到 VM。</p>
`
  },
  {
    date: "01月22號,2025",
    title: "基於 AWS EC2、ECR容器 的 Web App 研究",
    content: `<div class="Box-sc-g0xbh4-0 QkQOb js-snippet-clipboard-copy-unpositioned undefined" data-hpc="true"><article class="markdown-body entry-content container-lg" itemprop="text"><div class="markdown-heading" dir="auto"><h1 tabindex="-1" class="heading-element" dir="auto">2024/12/19 基於 AWS EC2、ECR容器 的 Api 服務</h1><a id="user-content-20241219-基於-aws-ec2ecr容器-的-api-服務" class="anchor" aria-label="Permalink: 2024/12/19 基於 AWS EC2、ECR容器 的 Api 服務" href="#20241219-基於-aws-ec2ecr容器-的-api-服務"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <div class="markdown-heading" dir="auto"><h1 tabindex="-1" class="heading-element" dir="auto">ECR (<a href="https://ap-northeast-1.console.aws.amazon.com/ecr/get-started?region=ap-northeast-1" rel="nofollow"><strong>Amazon Elastic Container Registry</strong></a>) 簡介</h1><a id="user-content-ecr-amazon-elastic-container-registry-簡介" class="anchor" aria-label="Permalink: ECR (Amazon Elastic Container Registry) 簡介" href="#ecr-amazon-elastic-container-registry-簡介"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <hr>
    <p dir="auto">Amazon Elastic Container Registry （Amazon ECR） 是一種安全、可擴展且可靠的 AWS 受管容器映像登錄服務。Amazon 使用 ECR支援具有資源型許可的私有儲存庫 AWS IAM。這是為了讓指定的使用者或 Amazon EC2執行個體可以存取您的容器儲存庫和映像。您可以使用您偏好的 CLI 來推送、提取和管理 Docker 映像、Open Container Initiative （OCI） 映像和OCI相容的成品。</p>
    <p dir="auto">定價方面</p>
    <p dir="auto">作為&nbsp;<a href="https://aws.amazon.com/free/" rel="nofollow">AWS 免費方案</a>的一部分，Amazon ECR 新客戶可獲得私有儲存庫每月 500 MB 的儲存空間，為期一年。</p>
    <p dir="auto">新客戶和現有客戶的公共儲存庫每月均可獲得 50 GB 的永久免費儲存空間。您每月可以免費從公有儲存庫，以匿名方式 (不使用 AWS 帳戶) 將 500 GB 資料傳輸至網際網路。如果您註冊 AWS 帳戶，或使用現有 AWS 帳戶向 Amazon ECR 進行身份驗證，您可以每月免費從公共儲存庫向網際網路傳輸 5 TB 資料。將資料從公共儲存庫傳輸到任何 AWS 區域中的 AWS 運算資源時，您還可以免費獲得無限頻寬</p>
    <div class="markdown-heading" dir="auto"><h1 tabindex="-1" class="heading-element" dir="auto">EC2 ( Elastic Compute&nbsp;Cloud ) 簡介</h1><a id="user-content-ec2--elastic-computecloud--簡介" class="anchor" aria-label="Permalink: EC2 ( Elastic Compute&nbsp;Cloud ) 簡介" href="#ec2--elastic-computecloud--簡介"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <hr>
    <p dir="auto">EC2 (Elastic Compute&nbsp;Cloud) 是 AWS 提供的雲端運算服務，主要功能如下：</p>
    <ul dir="auto">
    <li>提供可擴展的虛擬伺服器</li>
    <li>可自由選擇作業系統(Linux, Windows等)</li>
    <li>可依需求調整運算效能</li>
    <li>按使用量計費</li>
    </ul>
    <div class="markdown-heading" dir="auto"><h2 tabindex="-1" class="heading-element" dir="auto"><strong>免費方案&nbsp;(Free Tier) 限制</strong></h2><a id="user-content-免費方案free-tier-限制" class="anchor" aria-label="Permalink: 免費方案&nbsp;(Free Tier) 限制" href="#免費方案free-tier-限制"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <p dir="auto">AWS 提供 12 個月的免費方案，主要限制如下：</p>
    <div class="markdown-heading" dir="auto"><h3 tabindex="-1" class="heading-element" dir="auto"><strong>每月免費額度</strong></h3><a id="user-content-每月免費額度" class="anchor" aria-label="Permalink: 每月免費額度" href="#每月免費額度"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <ul dir="auto">
    <li>750 小時的 t2.micro 或 t3.micro&nbsp;執行時間</li>
    <li>相當於一台機器全天候運行&nbsp;(24x31 = 744小時)</li>
    <li>或是兩台機器分時使用，總時數不超過750小時</li>
    </ul>
    <div class="markdown-heading" dir="auto"><h3 tabindex="-1" class="heading-element" dir="auto"><strong>規格限制</strong></h3><a id="user-content-規格限制" class="anchor" aria-label="Permalink: 規格限制" href="#規格限制"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <ul dir="auto">
    <li>僅限使用 t2.micro 或 t3.micro 實例</li>
    <li>1 個 vCPU</li>
    <li>1 GB&nbsp;記憶體</li>
    <li>有限的網路效能</li>
    </ul>
    <div class="markdown-heading" dir="auto"><h3 tabindex="-1" class="heading-element" dir="auto"><strong>儲存限制</strong></h3><a id="user-content-儲存限制" class="anchor" aria-label="Permalink: 儲存限制" href="#儲存限制"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <ul dir="auto">
    <li>30GB 的 EBS&nbsp;(彈性區塊儲存) 空間</li>
    <li>每月 1GB&nbsp;的資料傳輸</li>
    </ul>
    <div class="markdown-heading" dir="auto"><h1 tabindex="-1" class="heading-element" dir="auto">基於 EC2 使用 ECR 的容器化服務</h1><a id="user-content-基於-ec2-使用-ecr-的容器化服務" class="anchor" aria-label="Permalink: 基於 EC2 使用 ECR 的容器化服務" href="#基於-ec2-使用-ecr-的容器化服務"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <hr>
    <div class="markdown-heading" dir="auto"><h3 tabindex="-1" class="heading-element" dir="auto">透過EC2 與ECR可以達成的基礎應用</h3><a id="user-content-透過ec2-與ecr可以達成的基礎應用" class="anchor" aria-label="Permalink: 透過EC2 與ECR可以達成的基礎應用" href="#透過ec2-與ecr可以達成的基礎應用"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <ul dir="auto">
    <li>容器化應用部署</li>
    <li>將應用程式打包成容器</li>
    <li>統一開發和生產環境</li>
    <li>快速部署和擴展</li>
    <li>微服務架構</li>
    <li>將大型應用拆分成小型服務</li>
    <li>獨立部署和擴展</li>
    <li>更容易維護和更新</li>
    </ul>
    <div class="markdown-heading" dir="auto"><h1 tabindex="-1" class="heading-element" dir="auto">開始使用</h1><a id="user-content-開始使用" class="anchor" aria-label="Permalink: 開始使用" href="#開始使用"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <hr>
    <p dir="auto">以下先透過Root 帳號建立服務，</p>
    <div class="markdown-heading" dir="auto"><h2 tabindex="-1" class="heading-element" dir="auto">本地開發 ( 以 .NET 8 MVC 舉例 )</h2><a id="user-content-本地開發--以-net-8-mvc-舉例-" class="anchor" aria-label="Permalink: 本地開發 ( 以 .NET 8 MVC 舉例 )" href="#本地開發--以-net-8-mvc-舉例-"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image.png" alt="建立好專案，並完成 DockerFile" style="max-width: 100%;"></a></p>
    <p dir="auto">建立好專案，並完成 DockerFile</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%201.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%201.png" alt="安裝 AWS CLI" style="max-width: 100%;"></a></p>
    <p dir="auto">安裝 AWS CLI</p>
    <div class="markdown-heading" dir="auto"><h2 tabindex="-1" class="heading-element" dir="auto"><strong>設定 <a href="https://ap-northeast-1.console.aws.amazon.com/ecr/get-started?region=ap-northeast-1" rel="nofollow">Amazon Elastic Container Registry</a></strong></h2><a id="user-content-設定-amazon-elastic-container-registry" class="anchor" aria-label="Permalink: 設定 Amazon Elastic Container Registry" href="#設定-amazon-elastic-container-registry"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <ol dir="auto">
    <li>
    <p dir="auto">建立 <a href="https://ap-northeast-1.console.aws.amazon.com/ecr/get-started?region=ap-northeast-1" rel="nofollow">**Amazon Elastic Container</a> 的 Repository**</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%202.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%202.png" alt="點擊 “建立儲存庫”" style="max-width: 100%;"></a></p>
    <p dir="auto">點擊 “建立儲存庫”</p>
    </li>
    <li>
    <p dir="auto">設定 Repository名稱、可變性</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%203.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%203.png" alt="設定 repository 名稱，並使用預設可變性，選擇 &quot;Mutable”" style="max-width: 100%;"></a></p>
    <p dir="auto">設定 repository 名稱，並使用預設可變性，選擇 "Mutable”</p>
    </li>
    <li>
    <p dir="auto">加密設定</p>
    </li>
    </ol>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%204.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%204.png" alt="選擇預設的 “AES-256 ”，AES-256在此處已經足夠使用，按下建立" style="max-width: 100%;"></a></p>
    <p dir="auto">選擇預設的 “AES-256 ”，AES-256在此處已經足夠使用，按下建立</p>
    <ol dir="auto">
    <li>確認 Repo 的建立</li>
    </ol>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%205.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%205.png" alt="確認剛剛建立的 repo 已經出現在 ECR 服務的列表中" style="max-width: 100%;"></a></p>
    <p dir="auto">確認剛剛建立的 repo 已經出現在 ECR 服務的列表中</p>
    <div class="markdown-heading" dir="auto"><h2 tabindex="-1" class="heading-element" dir="auto">設定 <a href="https://us-east-1.console.aws.amazon.com/iam/home?region=ap-northeast-1#/home" rel="nofollow">**Identity and Access Management (IAM)</a>**</h2><a id="user-content-設定-identity-and-access-management-iam" class="anchor" aria-label="Permalink: 設定 **Identity and Access Management (IAM)**" href="#設定-identity-and-access-management-iam"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <ol dir="auto">
    <li>
    <p dir="auto">人員設定</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%206.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%206.png" alt="選取 &quot;人員”，選擇  “建立人員”" style="max-width: 100%;"></a></p>
    <p dir="auto">選取 "人員”，選擇  “建立人員”</p>
    </li>
    <li>
    <p dir="auto">設定人員全組</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%207.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%207.png" alt="設定人員名稱，選擇下一步" style="max-width: 100%;"></a></p>
    <p dir="auto">設定人員名稱，選擇下一步</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%208.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%208.png" alt="選擇 “在群組中新增人員”，接著選 “建立群組”" style="max-width: 100%;"></a></p>
    <p dir="auto">選擇 “在群組中新增人員”，接著選 “建立群組”</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%209.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%209.png" alt="測試或練習時使用full access，若正式環境假設於 ec2 可選擇 ecr readonly" style="max-width: 100%;"></a></p>
    <p dir="auto">測試或練習時使用full access，若正式環境假設於 ec2 可選擇 ecr readonly</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2010.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2010.png" alt="點選剛剛建立的群組並下一步建立人員" style="max-width: 100%;"></a></p>
    <p dir="auto">點選剛剛建立的群組並下一步建立人員</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2011.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2011.png" alt="於列表中點選剛剛建立的 IAM" style="max-width: 100%;"></a></p>
    <p dir="auto">於列表中點選剛剛建立的 IAM</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2012.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2012.png" alt="Tab 中選擇 “安全憑證” 並點選 “建立存取金鑰”， ** 先決條件 :  安裝 aws cli" style="max-width: 100%;"></a></p>
    <p dir="auto">Tab 中選擇 “安全憑證” 並點選 “建立存取金鑰”，
    ** 先決條件 :  安裝 <a href="https://docs.aws.amazon.com/zh_tw/cli/latest/userguide/getting-started-install.html" rel="nofollow">aws cli</a></p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2013.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2013.png" alt="此 IAM 為 full access，所以選擇 “在AWS運算服務上執行的應用程式”，點選下一步" style="max-width: 100%;"></a></p>
    <p dir="auto">此 IAM 為 full access，所以選擇 “在AWS運算服務上執行的應用程式”，點選下一步</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2014.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2014.png" alt="此處選用，可直接按下建立存取金鑰" style="max-width: 100%;"></a></p>
    <p dir="auto">此處選用，可直接按下建立存取金鑰</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2015.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2015.png" alt="下載csv檔案，並按下完成。" style="max-width: 100%;"></a></p>
    <p dir="auto">下載csv檔案，並按下完成。</p>
    </li>
    </ol>
    <div class="markdown-heading" dir="auto"><h2 tabindex="-1" class="heading-element" dir="auto">設定  Amazon Elastic Compute Cloud (Amazon EC2)</h2><a id="user-content-設定--amazon-elastic-compute-cloud-amazon-ec2" class="anchor" aria-label="Permalink: 設定  Amazon Elastic Compute Cloud (Amazon EC2)" href="#設定--amazon-elastic-compute-cloud-amazon-ec2"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2016.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2016.png" alt="點選啟動執行個體" style="max-width: 100%;"></a></p>
    <p dir="auto">點選啟動執行個體</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2017.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2017.png" alt="輸入名稱，選擇amazon linux 或 ubuntu，使用最低配置以符合免費方案" style="max-width: 100%;"></a></p>
    <p dir="auto">輸入名稱，選擇amazon linux 或 ubuntu，使用最低配置以符合免費方案</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2018.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2018.png" alt="點選 “建立新的金鑰對”，這個金鑰用於登入此裝置" style="max-width: 100%;"></a></p>
    <p dir="auto">點選 “建立新的金鑰對”，這個金鑰用於登入此裝置</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2019.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2019.png" alt="選擇 ”建立新的金鑰對”，填入金鑰名稱，選擇RSA，下載.pem格式金鑰檔" style="max-width: 100%;"></a></p>
    <p dir="auto">選擇 ”建立新的金鑰對”，填入金鑰名稱，選擇RSA，下載.pem格式金鑰檔</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2020.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2020.png" alt="設定網路，允許SSH可改為 ”我的IP”，並啟動執行個體" style="max-width: 100%;"></a></p>
    <p dir="auto">設定網路，允許SSH可改為 ”我的IP”，並啟動執行個體</p>
    <div class="markdown-heading" dir="auto"><h2 tabindex="-1" class="heading-element" dir="auto">推送 Image 至 ECR</h2><a id="user-content-推送-image-至-ecr" class="anchor" aria-label="Permalink: 推送 Image 至 ECR" href="#推送-image-至-ecr"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2021.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2021.png" alt="開啟 pw 輸入 “aws configuire”， 依序填入 ecr-full-access 之 IAM 金鑰" style="max-width: 100%;"></a></p>
    <p dir="auto">開啟 pw 輸入 “aws configuire”， 依序填入 ecr-full-access 之 IAM 金鑰</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2022.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2022.png" alt="於ECR點擊repo並點選右上角 “檢視推送命令”，可以看到 init 的 push command" style="max-width: 100%;"></a></p>
    <p dir="auto">於ECR點擊repo並點選右上角 “<strong>檢視推送命令</strong>”，可以看到 init 的 push command</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2023.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2023.png" alt="依照指令登入 透過 aws cli 登入 ecr" style="max-width: 100%;"></a></p>
    <p dir="auto">依照指令登入 透過 aws cli 登入 ecr</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2024.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2024.png" alt="於專案資料夾下透過 dockerfile 建立 image。" style="max-width: 100%;"></a></p>
    <p dir="auto">於專案資料夾下透過 dockerfile 建立 image。</p>
    <div class="highlight highlight-source-powershell notranslate position-relative overflow-auto" dir="auto"><pre><span class="pl-k">//</span> 打包專案為 image 檔案，本版為 <span class="pl-c1">1.0</span>.<span class="pl-c1">0</span>
    <span class="pl-k">&gt;</span> docker build <span class="pl-k">-</span>t lamburger<span class="pl-k">-</span>ecr<span class="pl-k">-</span>repo:<span class="pl-c1">1.0</span>.<span class="pl-c1">0</span> .
         <span class="pl-k">+</span>] Building <span class="pl-c1">0.</span>4s (<span class="pl-c1">18</span><span class="pl-k">/</span><span class="pl-c1">18</span>) FINISHED          docker:desktop<span class="pl-k">-</span>linux
         <span class="pl-k">=</span><span class="pl-k">&gt;</span> [<span class="pl-k">internal</span>] load build definition <span class="pl-k">from</span> Dockerfile        <span class="pl-c1">0.</span>0s
         ...

    <span class="pl-k">//</span> 標記映像檔案 <span class="pl-c1">1.0</span>.<span class="pl-c1">0</span> 版本
    <span class="pl-k">&gt;</span> docker tag lamburger<span class="pl-k">-</span>ecr<span class="pl-k">-</span>repo:<span class="pl-c1">1.0</span>.<span class="pl-c1">0</span> <span class="pl-c1">976193230379.</span><span class="pl-c1">dkr.ecr.ap-northeast-1.amazonaws.com</span><span class="pl-k">/</span>lamburger<span class="pl-k">-</span>ecr<span class="pl-k">-</span>repo:<span class="pl-c1">1.0</span>.<span class="pl-c1">0</span>

    <span class="pl-k">//</span> 推送至 ecr
    <span class="pl-k">&gt;</span> docker push <span class="pl-c1">976193230379.</span><span class="pl-c1">dkr.ecr.ap-northeast-1.amazonaws.com</span><span class="pl-k">/</span>lamburger<span class="pl-k">-</span>ecr<span class="pl-k">-</span>repo:<span class="pl-c1">1.0</span>.<span class="pl-c1">0</span>
        8e454629571: Pushed
        5f70bf18a086: Pushed
        ...
        <span class="pl-c1">1.0</span>.<span class="pl-c1">0</span>: digest: sha256:e1c4d8d57d4007fe..<span class="pl-k">.</span> size: <span class="pl-c1">2203</span></pre><div class="zeroclipboard-container">
        <clipboard-copy aria-label="Copy" class="ClipboardButton btn btn-invisible js-clipboard-copy m-2 p-0 d-flex flex-justify-center flex-items-center" data-copy-feedback="Copied!" data-tooltip-direction="w" value="// 打包專案為 image 檔案，本版為 1.0.0
    > docker build -t lamburger-ecr-repo:1.0.0 .
         +] Building 0.4s (18/18) FINISHED          docker:desktop-linux
         => [internal] load build definition from Dockerfile        0.0s
         ...

    // 標記映像檔案 1.0.0 版本
    > docker tag lamburger-ecr-repo:1.0.0 976193230379.dkr.ecr.ap-northeast-1.amazonaws.com/lamburger-ecr-repo:1.0.0

    // 推送至 ecr
    > docker push 976193230379.dkr.ecr.ap-northeast-1.amazonaws.com/lamburger-ecr-repo:1.0.0
        8e454629571: Pushed
        5f70bf18a086: Pushed
        ...
        1.0.0: digest: sha256:e1c4d8d57d4007fe... size: 2203" tabindex="0" role="button">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
    </svg>
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none">
        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
    </svg>
        </clipboard-copy>
      </div></div>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2025.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2025.png" alt="確認 ECR 上有剛剛推送的 image" style="max-width: 100%;"></a></p>
    <p dir="auto">確認 ECR 上有剛剛推送的 image</p>
    <div class="markdown-heading" dir="auto"><h2 tabindex="-1" class="heading-element" dir="auto">登入 EC2，並啟用服務</h2><a id="user-content-登入-ec2並啟用服務" class="anchor" aria-label="Permalink: 登入 EC2，並啟用服務" href="#登入-ec2並啟用服務"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <p dir="auto">透過以下指令登入EC2</p>
    <div class="highlight highlight-source-powershell notranslate position-relative overflow-auto" dir="auto"><pre>ssh <span class="pl-k">-</span>i <span class="pl-s"><span class="pl-pds">"</span>你的金鑰.pem<span class="pl-pds">"</span></span> ubuntu<span class="pl-smi">@你的EC2公開DNS</span></pre><div class="zeroclipboard-container">
        <clipboard-copy aria-label="Copy" class="ClipboardButton btn btn-invisible js-clipboard-copy m-2 p-0 d-flex flex-justify-center flex-items-center" data-copy-feedback="Copied!" data-tooltip-direction="w" value="ssh -i &quot;你的金鑰.pem&quot; ubuntu@你的EC2公開DNS" tabindex="0" role="button">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
    </svg>
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none">
        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
    </svg>
        </clipboard-copy>
      </div></div>
    <p dir="auto">“ubuntu” 前墜依照ec2實體OS區分</p>
    <ul dir="auto">
    <li>Amazon&nbsp;Linux AMI：使用&nbsp;ec2-user</li>
    <li>Ubuntu AMI：使用&nbsp;ubuntu</li>
    <li>RHEL AMI：使用&nbsp;ec2-user</li>
    <li>Debian AMI：使用&nbsp;admin</li>
    <li>CentOS&nbsp;AMI：使用&nbsp;centos</li>
    <li>Amazon&nbsp;Linux AMI：使用&nbsp;ec2-user</li>
    </ul>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2026.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2026.png" alt="移動至 .pem 金鑰位置並登入ec2" style="max-width: 100%;"></a></p>
    <p dir="auto">移動至 .pem 金鑰位置並登入ec2</p>
    <div class="highlight highlight-source-powershell notranslate position-relative overflow-auto" dir="auto"><pre><span class="pl-c"><span class="pl-c">#</span> 更新套件清單</span>
    sudo apt update

    <span class="pl-c"><span class="pl-c">#</span> 安裝 Docker</span>
    sudo apt install <span class="pl-k">-</span>y docker.io

    <span class="pl-c"><span class="pl-c">#</span> 啟動 Docker 服務</span>
    sudo systemctl start docker
    sudo systemctl enable docker

    <span class="pl-c"><span class="pl-c">#</span> 將 ubuntu 使用者加入 docker 群組（這樣就不用每次都輸入 sudo）</span>
    sudo usermod <span class="pl-k">-</span>aG docker ubuntu

    <span class="pl-c"><span class="pl-c">#</span> 安裝必要的套件</span>
    sudo apt update
    sudo apt install <span class="pl-k">-</span>y unzip curl

    <span class="pl-c"><span class="pl-c">#</span> 下載 AWS CLI 安裝檔</span>
    curl <span class="pl-s"><span class="pl-pds">"</span>https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip<span class="pl-pds">"</span></span> <span class="pl-k">-</span>o <span class="pl-s"><span class="pl-pds">"</span>awscliv2.zip<span class="pl-pds">"</span></span>

    <span class="pl-c"><span class="pl-c">#</span> 解壓縮安裝檔</span>
    unzip awscliv2.zip

    <span class="pl-c"><span class="pl-c">#</span> 執行安裝</span>
    sudo .<span class="pl-k">/</span>aws<span class="pl-k">/</span>install

    <span class="pl-c"><span class="pl-c">#</span> 驗證安裝</span>
    aws <span class="pl-k">--</span>version</pre><div class="zeroclipboard-container">
        <clipboard-copy aria-label="Copy" class="ClipboardButton btn btn-invisible js-clipboard-copy m-2 p-0 d-flex flex-justify-center flex-items-center" data-copy-feedback="Copied!" data-tooltip-direction="w" value="# 更新套件清單
    sudo apt update

    # 安裝 Docker
    sudo apt install -y docker.io

    # 啟動 Docker 服務
    sudo systemctl start docker
    sudo systemctl enable docker

    # 將 ubuntu 使用者加入 docker 群組（這樣就不用每次都輸入 sudo）
    sudo usermod -aG docker ubuntu

    # 安裝必要的套件
    sudo apt update
    sudo apt install -y unzip curl

    # 下載 AWS CLI 安裝檔
    curl &quot;https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip&quot; -o &quot;awscliv2.zip&quot;

    # 解壓縮安裝檔
    unzip awscliv2.zip

    # 執行安裝
    sudo ./aws/install

    # 驗證安裝
    aws --version" tabindex="0" role="button">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
    </svg>
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none">
        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
    </svg>
        </clipboard-copy>
      </div></div>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2027.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2027.png" alt="安裝完成畫面" style="max-width: 100%;"></a></p>
    <p dir="auto">安裝完成畫面</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2028.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2028.png" alt="同樣的，透過 IAM 金鑰設定 aws，並登入ecr" style="max-width: 100%;"></a></p>
    <p dir="auto">同樣的，透過 IAM 金鑰設定 aws，並登入ecr</p>
    <div class="highlight highlight-source-powershell notranslate position-relative overflow-auto" dir="auto"><pre><span class="pl-k">&gt;</span> aws ecr <span class="pl-c1">get-login</span><span class="pl-k">-</span>password <span class="pl-k">--</span>region ap<span class="pl-k">-</span>northeast<span class="pl-k">-</span><span class="pl-c1">1</span> <span class="pl-k">|</span> docker login <span class="pl-k">--</span>username AWS <span class="pl-k">--</span>password<span class="pl-k">-</span>stdin <span class="pl-c1">976193230379.</span><span class="pl-c1">dkr.ecr.ap-northeast-1.amazonaws.com</span></pre><div class="zeroclipboard-container">
        <clipboard-copy aria-label="Copy" class="ClipboardButton btn btn-invisible js-clipboard-copy m-2 p-0 d-flex flex-justify-center flex-items-center" data-copy-feedback="Copied!" data-tooltip-direction="w" value="> aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 976193230379.dkr.ecr.ap-northeast-1.amazonaws.com" tabindex="0" role="button">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
    </svg>
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none">
        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
    </svg>
        </clipboard-copy>
      </div></div>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2029.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2029.png" alt="透過以下指令pull ecr 上的 image" style="max-width: 100%;"></a></p>
    <p dir="auto">透過以下指令pull ecr 上的 image</p>
    <div class="highlight highlight-source-powershell notranslate position-relative overflow-auto" dir="auto"><pre>docker pull <span class="pl-c1">976193230379.</span><span class="pl-c1">dkr.ecr.ap-northeast-1.amazonaws.com</span><span class="pl-k">/</span>lamburger<span class="pl-k">-</span>ecr<span class="pl-k">-</span>repo:<span class="pl-c1">1.0</span>.<span class="pl-c1">0</span></pre><div class="zeroclipboard-container">
        <clipboard-copy aria-label="Copy" class="ClipboardButton btn btn-invisible js-clipboard-copy m-2 p-0 d-flex flex-justify-center flex-items-center" data-copy-feedback="Copied!" data-tooltip-direction="w" value="docker pull 976193230379.dkr.ecr.ap-northeast-1.amazonaws.com/lamburger-ecr-repo:1.0.0" tabindex="0" role="button">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
    </svg>
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none">
        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
    </svg>
        </clipboard-copy>
      </div></div>
    <p dir="auto">有可能遇到 docker 權限的問題，透過 以下指令嘗試再次 pull</p>
    <div class="highlight highlight-source-powershell notranslate position-relative overflow-auto" dir="auto"><pre><span class="pl-c"><span class="pl-c">#</span> 確保 docker 群組存在</span>
    sudo groupadd docker

    <span class="pl-c"><span class="pl-c">#</span> 將當前使用者加入 docker 群組</span>
    sudo usermod <span class="pl-k">-</span>aG docker <span class="pl-smi">$USER</span>

    <span class="pl-c"><span class="pl-c">#</span> 重新啟動 Docker 服務</span>
    sudo systemctl restart docker

    <span class="pl-c"><span class="pl-c">#</span> 重新套用群組變更（不需要登出）</span>
    newgrp docker</pre><div class="zeroclipboard-container">
        <clipboard-copy aria-label="Copy" class="ClipboardButton btn btn-invisible js-clipboard-copy m-2 p-0 d-flex flex-justify-center flex-items-center" data-copy-feedback="Copied!" data-tooltip-direction="w" value="# 確保 docker 群組存在
    sudo groupadd docker

    # 將當前使用者加入 docker 群組
    sudo usermod -aG docker $USER

    # 重新啟動 Docker 服務
    sudo systemctl restart docker

    # 重新套用群組變更（不需要登出）
    newgrp docker" tabindex="0" role="button">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
    </svg>
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none">
        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
    </svg>
        </clipboard-copy>
      </div></div>
    <p dir="auto">最後執行容器</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2030.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2030.png" alt="image.png" style="max-width: 100%;"></a></p>
    <div class="highlight highlight-source-powershell notranslate position-relative overflow-auto" dir="auto"><pre>docker run <span class="pl-k">-</span>d \
    <span class="pl-k">--</span>name my<span class="pl-k">-</span>dotnet<span class="pl-k">-</span>app \
    <span class="pl-k">-</span>p <span class="pl-c1">80</span>:<span class="pl-c1">8080</span> \
    <span class="pl-k">--</span>restart always \
    [<span class="pl-c1">976193230379.</span><span class="pl-k">dkr.ecr.ap</span><span class="pl-c1">-northeast-1.amazonaws.com</span><span class="pl-k">/</span><span class="pl-k">lamburger</span><span class="pl-k">-</span><span class="pl-k">ecr</span><span class="pl-k">-</span><span class="pl-k">repo</span>:<span class="pl-c1">1.0</span>.<span class="pl-c1">0</span>](http:<span class="pl-k">//</span><span class="pl-c1">976193230379.</span><span class="pl-c1">dkr.ecr.ap-northeast-1.amazonaws.com</span><span class="pl-k">/</span>lamburger<span class="pl-k">-</span>ecr<span class="pl-k">-</span>repo:<span class="pl-c1">1.0</span>.<span class="pl-c1">0</span>)</pre><div class="zeroclipboard-container">
        <clipboard-copy aria-label="Copy" class="ClipboardButton btn btn-invisible js-clipboard-copy m-2 p-0 d-flex flex-justify-center flex-items-center" data-copy-feedback="Copied!" data-tooltip-direction="w" value="docker run -d \
    --name my-dotnet-app \
    -p 80:8080 \
    --restart always \
    [976193230379.dkr.ecr.ap-northeast-1.amazonaws.com/lamburger-ecr-repo:1.0.0](http://976193230379.dkr.ecr.ap-northeast-1.amazonaws.com/lamburger-ecr-repo:1.0.0)" tabindex="0" role="button">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
    </svg>
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none">
        <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
    </svg>
        </clipboard-copy>
      </div></div>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2031.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2031.png" alt="回到 EC2 點擊DNS ，* 注意要確認是 http 而非 https " style="max-width: 100%;"></a></p>
    <p dir="auto">回到 EC2 點擊DNS ，* 注意要確認是 http 而非 https</p>
    <p dir="auto"><a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/garzlolz/2024-12-19-AWS-EC2-ECR/refs/heads/main/image%2032.png"><img src="/garzlolz/2024-12-19-AWS-EC2-ECR/raw/main/image%2032.png" alt="確認網站是否成功運行" style="max-width: 100%;"></a></p>
    <p dir="auto">確認網站是否成功運行</p>
    <div class="markdown-heading" dir="auto"><h2 tabindex="-1" class="heading-element" dir="auto">優化方向</h2><a id="user-content-優化方向" class="anchor" aria-label="Permalink: 優化方向" href="#優化方向"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a></div>
    <ol dir="auto">
    <li><strong>容器管理優化</strong>
    <ol dir="auto">
    <li><strong>容器資源限制</strong></li>
    <li><strong>容器重啟策略</strong></li>
    <li><strong>容器環境變數管理</strong></li>
    </ol>
    </li>
    <li><strong>GitHub&nbsp;Actions 自動化部署，下次以自動化的部分優先實作</strong></li>
    <li>還有很多</li>
    </ol>
    </article></div>`
  },
  {
    date: "10月11號,2024",
    title: "在Windows中Folder右鍵開啟Cursor",
    content: `<p>右鍵開啟cursor</p>
<pre><code class="language-plaintext">Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\*\shell\Open with Cursor]
@="Edit with Cursor"
"Icon"="C:\\{ Cursor 安裝位置 }\\cursor\\Cursor.exe,0"

[HKEY_CLASSES_ROOT\*\shell\Open with Cursor\command]
@="\"C:\\{ Cursor 安裝位置 }\\cursor\\Cursor.exe\" \"%1\""

[HKEY_CLASSES_ROOT\Directory\shell\cursor]
@="Open Folder as Cursor Project"
"Icon"="\"C:\\{ Cursor 安裝位置 }\\cursor\\Cursor.exe\",0"

[HKEY_CLASSES_ROOT\Directory\shell\cursor\command]
@="\"C:\\{ Cursor 安裝位置 }\\cursor\\Cursor.exe\" \"%1\""

[HKEY_CLASSES_ROOT\Directory\Background\shell\cursor]
@="以 Cursor 開啟"
"Icon"="\"C:\\{ Cursor 安裝位置 }\\cursor\\Cursor.exe\",0"

[HKEY_CLASSES_ROOT\Directory\Background\shell\cursor\command]
@="\"C:\\{ Cursor 安裝位置 }\\cursor\\Cursor.exe\" \"%V\""
</code></pre>`
  },
  {
    date: "10月01號,2024",
    title: "Seq Dashboard Monitor 不同GC Mode的記憶體差異",
    content: `<ul>
    <li>測試條件: 100人，20分鐘總共約 69000次 Request</li>
    <li>測試API , <code>GET</code> <a target="_blank" rel="noopener noreferrer" href="https://api/Performance/httpGet">api/Performance/httpGet</a></li>
</ul>
<pre><code class="language-plaintext">[HttpGet("httpGet")]
public async Task&lt;IActionResult&gt; HttpGet()
{
    using (HttpClient client = new HttpClient())
    {
        string getProductUrl = "&lt;https://fakestoreapi.com/products&gt;";
        HttpResponseMessage response = await client.GetAsync(getProductUrl);

        response.EnsureSuccessStatusCode();

        // 取得回應內容
        string responseBody = await response.Content.ReadAsStringAsync();
        return Ok(responseBody);
    }
}
</code></pre>
<ul>
    <li>Request Summary</li>
</ul>
<figure class="table">
    <table>
        <thead>
            <tr>
                <th>Mode</th>
                <th>Total Requests</th>
                <th>Requests Per Second</th>
                <th>Avg. Response Time</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Server GC</td>
                <td>69,120</td>
                <td>54.56</td>
                <td>628 ms</td>
            </tr>
            <tr>
                <td>Workstation GC</td>
                <td>69,158</td>
                <td>57.28</td>
                <td>603 ms</td>
            </tr>
        </tbody>
    </table>
</figure>
<h2>Server Mode、Workstation Mode GC 對比</h2>
<ul>
    <li>Server Mode 峰值約在 6.5% 左右，Workstation CPU 峰值約在2.5%左右</li>
    <li>Server Mode CPU使用率為 2%~6%，普遍居於 5%， Workstation Mode CPU使用率為 1.2%~2.5%，普遍居於 1.8%</li>
    <li>Server Mode 之 Working Set 在初期高速飆升至 380MB 後緩慢下降，約在 290MB 持平， Workstation Mode 之 Working Se 在初期高速飆升至 120MB後緩慢下降，約在 70MB 持平</li>
    <li>Server Mode 之 Allocated 約在 70MB 至 200MB左右大幅震盪 ， Workstation Mode 之 Allocated 約在 20MB 左右</li>
</ul>
<p>${AddImg(20241001, 1)}</p>`
  },
  {
    date: `04月23號,2024 ,`,
    title: "北漂",
    content: `<p><span style="font-size:20px;">早</span>安各位，好久不見</p>
    <p>身為土生土長的台中人，如今跑到台北內湖上班，</p>
    <p>在日商NEC-PTC上班了一個月。</p>
    <p><br>兩個月前在591上租了一間頂加6樓的租屋，</p>
    <p>以空間來說我認為是挺大的</p>
    <p>但可怕的是在一個月後，我發現隔音非常糟糕，在每天爬6樓的日子</p>
    <p>我不僅得健身，還得安安靜靜，</p>
    <p>就連晚上11點到家洗澡都被鄰居檢舉半夜用水吵到鄰居睡不著</p>
    <p>這樣的租屋要11500，真是令人覺得不可思議，</p>
    <p>一個人隻身上台北，又遇到這種狀況實在是令人憂愁，</p>
    <p>看了看更遠一點的租房也是大同小異。</p>
    <p>&nbsp;</p>
    <p>先不管房屋的外觀，現今台北的租屋環境實在是非常惡劣，</p>
    <p>物價、房價、生活成本都高的有點離譜</p>
    <p>再看看房價，如今社會年輕人如果要全靠自己熬上多少個年頭。</p>
    <p>&nbsp;</p>
    <p>想了想我的初心，</p>
    <p>是想要達成年薪百萬還是在有活力有熱情的小公司研究新東西、做出各式各樣的專案，</p>
    <p>還是在這些老公司寫vb專案度日呢?</p>
    <p>&nbsp;</p>
    <p>我想答案很明確了，我得開始行動</p>`,
  },
  {
    date: "01月16號,2023 ,",
    title: ".Net7 && JWT ",
    content: `2023年新的開始來試試看.Net7,一直以來公司開發都是以.Net FrameWork為主，希望未來能碰到.Net Core或.Net(打開104)，
         這次收到某公司得邀請不過得先做題目，
         題目大致上是使用 EF完成 Restful API，面試過程很開心，該公司的氣氛讓我覺得很酷，
         不過問了下那個地區的房租我真的是倒抽一口氣......

         面試雖然結束了不過趁著今天有閒(?)，來試試看JWT吧! <a href="https://github.com/garzlolz/yungching_quiz">Github</a>
        <div>
         (1)
         首先打開我們的 Power Shell，安裝微軟的 JWT!
         ${AddImg(20230117, 1)}
          > dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
        </div>
        <br><br>
        <div>
         (2)
         接下來服務中註冊他
         ${AddImg(20230117, 2)}
         </div>
         <br>
         <div>
         (3)
         接下來我們在Controller加上 Authorize屬性
         ${AddImg(20230117, "2_1")}
         </div>
         <br>
         <div>
         (4)
         透過Cli 產生Token
         ${AddImg(20230117, 3)}
          > dotnet user-jwts create
          </div>
          <br><br>
          <div>
         (5)
         我們會發現我們的Json悄悄的發生變化，這個部分聽說有些人的會跑到 appSetting.Json這就要看你怎麼設置了
         ${AddImg(20230117, 4)}
         </div>
         <br><br>
         <div>
         (6)
         好! 開始測試這邊使用的是方法 "getAll" 取得我們所有員工訊息，不過你可能會發現沒辦法用了
         ${AddImg(20230117, 5)}
         </div>
         <br>
         <div>
         (7)
         這是因為我們還沒加上Token，如果你是用 Postman在 Authorization中的 Type選擇 Bearer Token然後加上我們剛剛產出的token
         ${AddImg(20230117, 6)}
         </div>
         <br><br>
         <div>
         (8)
         最後我們在嘗試一下發一個 request試試看
         ${AddImg(20230117, 8)}
         </div>
         完成~~~
        `,
  },
  {
    date: "12月8號,2022 ,",
    title: "台中老公司以及甲骨文 ",
    content: `近期都在維護.net Framework的專案，最近因為公司要開發新版本的站台也要用新的.net Core和MVC，
         才發現新版本的Asp.net Core更新後將原本的edmx也移除掉了，原本引入用的UI也不見了，
         如果都要用code first的話有點麻煩，畢竟公司其實都會先開DB，table欄位也非常多的，所以還是用DB First指令更快一點
         Scaffold-DbContext  //使用scaffold建立DBContext
         "<ConnectionString>"
         Microsoft.EntityFrameworkCore.SqlServer
         -tables <tableName> -OutputDir <Folder> --force //如果要更新可以用force`,
  },
  {
    date: "10月19號,2022 ,",
    title: "在IIS上佈署 .Net Web",
    content: `${AddTag(
      "h5",
      `這一兩個月由於在忙台糖的團購，常常加班到自己眼睛好痛
            看了眼科好險只是過度疲勞，現在每天晚上都熱敷眼睛+各種眼睛
            的保件食品😥😥😥各位千萬要保養好自己工具阿`
    )}<br>

        今天紀錄一下自己是如何在 IIS上佈署自己的 web應用程式
        這邊我使用的環境是 Windows Server 2022
        ${AddImg(20221019, 1)}

        ${AddTag(
      "li",
      `Windows Server2022 的介面跟使用上跟windows 2019其實是大同小異的
        首先呢 我們需要先將 IIS加入到 Windows應用程式內`
    )}
        ${AddImg(20221019, 2)}

        ${AddTag("li", "Feature的部分則是要將.net的Runtime加入到windows中~")}
        ${AddImg(20221019, 3)}

        ${AddTag("li", "接下來我們就可以開啟 IIS Server")}
        ${AddImg(20221019, 4)}

        ${AddTag("li", "在Site的選項中選擇新增站台")}
        ${AddImg(20221019, 5)}

        ${AddTag(
      "li",
      `這裡我最近寫的楓康PDA的API為範例 填入應用程式名稱，實體路徑選
        擇已經打包好的資料夾，port的部分的我設定在 8081這個8081需要繫好瞜`
    )}
        ${AddImg(20221019, 6)}

        ${AddTag(
      "li",
      `好接下來打開防火牆，我們新增一個輸入輸出規則，使用連接埠的方式我
        將他選在8081上，保存後如圖`
    )}
        ${AddImg(20221019, 7)}

        ${AddTag("li", "接下來取得自己區網的ip")}
        ${AddImg(20221019, 8)}

        ${AddTag("li", "最後我們就可以在相同網域上看到自己發布的網站瞜!")}
        ${AddImg(20221019, 9)}
        `,
  },
  {
    date: "8月18號,2022 ,",
    title: "EF Core、近期工作 ",
    content: `近期都在維護.net Framework的專案，最近因為公司要開發新版本的站台也要用新的.net Core和MVC，
         才發現新版本的Asp.net Core更新後將原本的edmx也移除掉了，原本引入用的UI也不見了，
         如果都要用code first的話有點麻煩，畢竟公司其實都會先開DB，table欄位也非常多的，所以還是用DB First指令更快一點
         Scaffold-DbContext  //使用scaffold建立DBContext
         "<ConnectionString>"
         Microsoft.EntityFrameworkCore.SqlServer
         -tables <tableName> -OutputDir <Folder> --force //如果要更新可以用force`,
  },
  {
    date: "7月13號,2022 ,",
    title: "近期學習、工作概略",
    content: `OK，目前對於 .NET、MVC、以及 ADO.NET(Entity FrameWork)有大致上了解了，<br>
        這幾個月參與開發、維護公司模組專案以及幾個訂單轉出的Console App，<br>
        老實說SQL可能是我面臨大大的短板，<br>
        在習慣用EF做一些基本的select、AddorUpdate、SaveChange心想:"诶?原來這麼簡單又輕鬆"，<br>
        雖然都是使用DB first而是code first的方式但目前還沒遇到網路上說的"問題"，<br>
        此外要運用到left Join的時候一Google :"嘔天 這什麼鬼"馬上又改回sql coommand的方式，<br>
        這部分還須再加強練習。<br>
        另外我發現在Visual Studio上開發MVC真的是一件很麻煩的事情、不管怎樣都要給你重啟個幾次，<br>
        修改一個class的型別 抱歉你得重啟阿 哥，你說氣不氣人? <br>
        BTW 最近換新的設備14個core的i7-12700H 16G DDR5 滿功率的3050Ti ，<br>
        再加上2.5K以及165HZ的分辨率，<br>
        這個規格你在台灣入手肯定是4W5起跳...但!<br>
        對、但!這個配置我再京東上找到了Y7000P國際板應該是legion 5i?(不是很確定)<br>
        我從聯想官網點一點相同的配置 "$52700" <br>
        台灣的OEM廠商真的是坑殺人了，別說聯想了，<br>
        "華碩"這個'台灣'品牌不只是價格在台灣賣得比誰都貴<br>
        甚至對產品做閹割你甚至無法在台灣只到一台4W以內的滿血顯卡筆電，<br>
        最後從京東購入的Y7000P我只能說:"真香"`,
  },
  {
    date: "2月25號,2022 ,",
    title: "C#、ASP.NET ",
    content: `在國興裡面待了3個月, 目前的心得想在這上面記錄一下, 這三個月期間我認為我是學到很多, 包括.net 6 以及 MVC 架構, 從自己原本只想做前端到目前接觸到C#、webAPI、MVC網頁以及jQuery，在短短的時先內真的接觸到很多，但也了解到其實公司框架這種東西雖然真的方便快速好維護，但是真的會限制你的想法、作法。
         目前2月25號正在執行的業務是楓康外送平台的分店建檔網頁、Webhook比如說像是UBER EAT那邊的失敗成功訊息再SQL上的紀錄顯示再網頁上`,
  },
  {
    date: "12月21號,2021 ,",
    title: "C# 好像似懂非懂",
    content: `可能先前太常使用 var、const 在 C# 中卻必須要明確規範變數、參數的型別、再加上vs community 的熱鍵其實非常難用...，寫起來確實挺折磨人的，不過第一個禮拜學到了如何製作web api以及幾個簡單的winform 、使用C# 的http傳輸 post、get等方法，不得不說，好久沒有這種學到新東西的感覺了...意外的開心`,
  },
  {
    date: "12月10號,2021 ,",
    title: "New Offer C# .net工程師",
    content: `12/6號 我轉職成為winform全端工程師的職位，主要工作初步認識應該是pos機跟DB的作業，據了解客戶好像是喫茶，糖村跟多那支。今天剛好是入職的第一個禮拜五。期待接下來的各種挑戰。`,
  },
  {
    date: "10月12號,2021 ,",
    title: "Google App Script X GitHub",
    content: `<p>在Google Extend商店裡 找到 <a href="https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo">Google Apps Script GitHub Assistant</a></p>
     <p>下載後要設定GitHub Access 的 token<a href= "https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token">Creating a personal access token</a></p>
     <p>要記得將App script 的 Google Apps Script API開啟</p>
     <p>登入插件後接下來就可以在script 裡面看到 pull push跟 commit</p>
     <p>就大功告成啦!</p>`,
  },
  {
    date: "8月3號,2021 ,",
    title: "要怎麼讓能力變更好...?",
    content: `<p>很久沒更新了，目前工作3個月，我對自己越來越沒信心。</p>
      <p>最近幾次的工作任務，我都沒能很好的將長官給的任務的完成，可能真的能力太差，讓我有想進修的念頭</p>
      <p>上禮拜去聯成問了相關的補習，我想再進修我的語言能力，想把工作好好地做完。</p>
      <p>一到了聯城電腦 她告訴惡我相關的工作職缺，又講了市場缺什麼人才，但那都不是我想聽的，我只是想讓自己能進修變得更好</p>
      <p>最後他才告訴了我價錢<strong>18萬</strong>， 噢天阿，原來補一個能力需要花費我這麼金錢，對一個剛出社會的小白來說 18萬是什麼樣的天文數字</p>
      <p>回到了家，看了看我剛拿到的畢業證書，身為資訊工程系 我覺得如此丟臉羞恥</p>
      <p>到底該怎麼...讓自己變得更強，還是我根本不是寫code的料?</p>`,
  },
  {
    date: "5月5號 ,2021 ,",
    title: "Line Notify API",
    content: `
        <p>使用Line Notify 結合 GAS 串接政府的JSON 在設定好觸發條件就可以製作自己的天氣預報</p>
        <p>Step 1: 先在 <a href="https://notify-bot.line.me/zh_TW/">Line Notify</a> 登入後取得權杖(權杖一定要記得)</p>
        <p>Step 2: 在ＧＡＳ寫入：</p><br><br>
        <pre>
        var LineToken = '[剛剛取得的權杖]';             //權杖會一直保留直到你斷開連結

        /*** 接下來可以在各種開放資料取的各種想要的資料再作處理 ***/

        var LineText = data ;                         //帶入參數到function
        sendToLine(LineText);

        function sendToLine(LineText){
            var token = LineToken;
            var formData={                            //要發送的訊息
                "message":LineText,
                };
            var options = {
                "method":"post",
                "payload":formData,
                "headers":{
                "Authorization":"Bearer "+ token,
                "Content-Type" : "application/x-www-form-urlencoded"
                      }
              };
            Logger.log(options.payload)
            UrlFetchApp.fetch('https://notify-api.line.me/api/notify',options)
            Logger.log('已發布')
        </pre>
     `,
  },
  {
    date: "5月5號 ,2021 .",
    title: "Google APP Script 與微軟Teams 對接",
    content: `
        &nbsp&nbsp 
        今天任務是將GAS跟Teams對接，在頻道中發出訊息,所以使用方法是post
      <br><pre>
    var MicroSoft_token = '[權杖]';             //從MicroSoft Graph取得Token

    function toMsGraph(){
        var token = MicroSoft_toke;
        var formData={
            body: {                            //訊息要放在'body裡'
            content: '[要發出的訊息]'
            }
        };
        var options={
        "method":'post',                       //方法使用POST
        "payload":JSON.stringify(formData),    //要記得轉成json字串
        "headers":{
        "Authorization": "Bearer " + token,
        "Content-Type" : "application/json"    //使用json格式
        },
        muteHttpExceptions:true
    }

    var response =  UrlFetchApp.fetch('https://graph.microsoft.com/v1.0/teams/
                                [團隊ID]/channels/[頻道ID]/messages/',options)

    var json = JSON.parse(response.getContentText());
    Logger.log(json)
    }
        </pre>
      `,
  },
  {
    date: "4月29號 ,2021 , ",
    title: "處理 JS ARRAY TO CSV 中的 COMMA",
    content: `

            &nbsp;&nbsp;今天在上班中遇到了一個小小小問題，首先是在google sheet當中把所有的直轉為陣列
            再將陣列轉為ＣＳＶ格式，但是問題來了，某一串字串裡面有一個COMMA，所以我在stackflow上找了一堆相似的問題
            ，但不得其解;<br><br>最後菜菜的我只好向主管請求幫助，他馬上就幫我找到錯誤的地方，真的是非常慚愧。
            藉此機會紀錄一下<br><br>
            <pre>
            //定義一個空値，以及googlesheet的陣列値
            var csv = '';
            var v = 估狗sheet的値;</pre>
            //分別將每一個値賦予分號
            <pre>for(var row=0;row< v.length;row++){</pre>
                <pre>for(var col = 0; col<v[row].length;col++){</pre>
                    <pre>if(v[row][col].toString().indexOf(",")!=-1){</pre>
                    <pre>v[row][col] = '"'+ v[row][col] + '"';
                         };
                     };
               }</pre>
            <pre>
            //為字串賦予ＣＳＶ格式並儲存至變數中
            v.forEach(function(e) {
                csv += e.join(',')+'/n';
            })</pre>
            <pre>
            //帶入參數回傳CSV檔供下載
            if(page == 1){
                return ContentService.createTextOutput(csv).downloadAsFile("檔案名稱.csv").setMimeType(ContentService.MimeType.CSV);
            }
            else{
              return ContentService.createTextOutput(
               ' Parameter Error.'
              )
            }</pre>

            總之非常感謝主管救我ＱＱ
        `,
  },
  {
    date: "4月13號 ,2021 , ",
    title: "Google APP Script 新嘗試",
    content: `
             &nbsp;&nbsp;在公司擔任 IT 好像就是免不了被當工具人使用吧 Q_Q<br><br>
        主管上禮拜跟我說他們的資料主要是以 google sheet 做訂單管理,<br><br>
        希望我這個資工系出身的也要會GAS,這禮拜被牆破惡補excel函數以及GS...<br><br>
        今天下午就幫公司寫了個從excel note裡導出函數再導入到別的資料表執行,<br><br><br>
        記錄一下新學習到的能力...<br>
            取得檔案中的備註<br>
                FileNote('工作表',將上傳的column,將被取代的column)<br><br>
            定義範圍<br>
                sheet.getRange(col,row);<br><br>
            取得範圍內的值<br>
                range.getValues();<br><br>
            清除欄位內容<br>
                range.clearContent()<br><br>
            <h3>開啟google sheet按鈕的方法 <em>注意 function名稱為google定義</em></h3>
            <p>function onOpen() {<br>
                var ui = SpreadsheetApp.getUi();<br>
                ui.createMenu('頁面工具')<br>
                        .addItem('FC_RM_KeyIn -> FC_RM_WH ', 'GarZ_NotePaste')<br>
                        .addItem('Vendor_KeyIn -> Vendor ', '')<br>
                    .addToUi();<br>
              }</p>
        `,
  },
  {
    date: "4月7號 ,2021 , ",
    title: "上班及學習",
    content:
      "早上天氣不錯，上班前喝了杯咖啡，來到公司後主管要我幫他找一塊mac的液晶螢幕，不過想也知道，剛來第二天的人怎麼會知道放在哪" +
      "，找遍了所有能找的地方，主管告訴我被丟掉了<br>回到座位後我繼續看我的新進人員手冊，目前剛到職沒什麼工作，我拿起我的 ”００８天絕對看不完的 Vue.js3“，<br>就在我埋頭苦練的時候恰巧被主管看到了，本以為要被罵臭頭的時候，他告訴我說希望現在在練習的東西以後可以用上結合google script達到結合ＥＲＰ的效果，真是開明那我就繼續把我的框架能力加強吧！",
  },
  {
    date: "3月30號 ,2021 , ",
    title: "I got my offer",
    content: `今天3/30，總共面試了3家公司，拿到了2個offer，一個是網頁、系統設計；另一個則是公司的MIS工程師，但我選擇了後者；原因是因為第一家告訴我當天就會通知我結果，但他沒有這她說的一樣當天就告知我，甚至我mail他，才跟我說要在隔一個禮拜才會通知，這動作讓我有點不是很開心，馬上打給第二間說我接受他的offer，4/6就去上班。；`,
  },
  {
    date: "3月17號 ,2021 , ",
    title: "關於AJAX",
    content: `<pre>
        今天是很熱的一天，下午2點時到數唯科技面試，聽了工作內容令我有點映象深刻，
        他們的主管跟我說像我這種剛畢業的人培訓是必要的，對於我這種剛畢業只懂一點前端的，
        他們可以培訓，比如說前端的angular還有.net以及C#，這些對我來說都蠻新鮮的；
        面試結束後，騎了老遠到家想說剪個頭法，第一間面試的勁峰就打給我問我要不要上班；

            有點掙扎，因為相比這一間就是比較傳統的公司、MIS工程師實際上是在幹嘛也聽不太懂
        回到正題，昨天練習的xmlhttprequest

        //總之先請求連線
         var xhr = new XMLhttpRequest();

        //接下來請求URL
        xhr.open("post/get","url",true);

        //若沒有要傳送資料"
        xhr.send(null)

        //最後是
        xhr.onload=function(){執行動作}
        </pre>
        `,
  },
  {
    date: "3月14號 ,2021  ,  ",
    title: "找工作",
    content:
      "終於畢業了，現在正在尋找各種前端的工作機會，也順便把部落格的方式改成用陣列輸出，打工這邊也決定在26號結束了，希望接下來可以找到自己喜歡的工作...",
  },
  {
    date: "3月6號 ,2021  ,  ",
    title: "關於localStorage",
    content:
      "今天複習js，在練習todoList 的 localStorage，setitem，以及getitem的方式;<br>搭配陣列的 push.data 和 splice.data 紀錄一下<br><br>從localstorage上抓下來的話，要將array轉成String<br> JSON.parse(localStorage.getItem('listdata',Data)) <br><br>上傳則要將Array轉為String所以則是<br> <br>JSON.stringify(localStorage.setItem('listData',Data)); <br> 陣列可以分別用 push.data 和 splice.data的方式，將資料push到陣列或刪除。",
  },
  {
    date: "3月5號 ,2021 , ",
    title: "專題結束",
    content:
      "3月5號這天是我專題評審的日子，在中午和老師面談後，我在兩點的時候進行專題評審;我認為完成度很高了，有硬體、有資料庫(MySQL/Apach server)、也有網頁(html5/css3/javascript/jQuery/Boostrap)，再搭配PHP，我認為以我自己一個人做專題其實已經可以抬頭挺胸的跟老師們報告了，不過上台的時候還是有點緊張，真的是嚇死我哈哈哈哈，接下來就是找工作，在7月就可以拿到畢業證書了",
  },
  {
    date: "2月23號 ,2021 , ",
    title: "109 第二學期",
    content:
      "這個專題老師是從業界過來的，但很明顯他的名聲一點都不好，學弟也非常討厭他；第二學期開始了，找老師meeting卻被以讀，從上學期11月就跟我說準備告報、準備PTT，東西都準備好了；但老師卻不理我，真看不懂到底在幹嘛...，明天是這學期第一次meeting，住我一帆風順...",
  },
  {
    date: "2月2號 ,2021 , ",
    title: "微創動刀",
    content:
      "今天是開完刀兩天後，動完刀只能說現在醫療器材真的進步很多，仔細看傷口小到一個爆炸，甚至還有一個什麼凝膠的可以不用縫合傷口，真的厲害。<br><br>不過修復期也要1到兩個月，光是這兩天我光睡覺都被痛醒，真的是沒吃止痛藥睡不著，痛到爆阿哈哈哈，回想起當天開刀的心情，真的是講真到爆炸，先拿一根針從我脊椎旁邊戳一個洞進去，我靠!真的是我打麻醉還痛到哭出來，真的非常痛，後來痛到沒意識，在麻醉復甦室休息了3個小時才出來，真的很痛啊哈哈哈。",
  },
  {
    date: "1月29號 ,2021 , ",
    title: "開刀",
    content:
      "今天是人生第一次開刀，雖然說是開刀，但其實也不過是微創手術，但不知道為什麼就是怕怕的，想到不是全身麻醉而是只有局部，一開始還沒這個感覺，不過到了要住院還是快尿出來了= =<br><br>不管怎麼說，我只能說人生遇到什麼就要去面對，不要想太多垃圾話，做就對了，醫生告知我要開刀我二話不說就要做，不管結果怎麼樣，2021祝大家都新年快樂",
  },
  {
    date: "1月 15號, 2021 , ",
    title: "想當初那個胎死腹中的專題",
    content:
      "大三的時候, 當時做了一個APP 叫做抽爆的APP<br>" +
      "先不管當時做得怎麼樣 <strong>抽爆</strong> 是我當初和同學一起合作做出來的APP<br><br>總之 <em>抽爆</em> 是利用爬蟲的方式將所有抽獎的機會匯集成一個資料庫table裡面包含了源網址、獎品、以及官方要求的抽獎方法<br><br>這個APP我們最終是使用了安卓studio做了出來，但是畫面很陽春，現在想想真的是醜到一個爆炸，甚至沒有流失體的把它刪掉了<br><br>總之最後這個APP老師是不採用了，我有點絕望，畢竟花了1年的時間從無到有生出來一個APP也不是什麼簡單事情；反正身為學生的我有點自暴自棄，甚至身上大4也不想做任何事情",
  },
  {
    date: "11月3號, 2020 , ",
    title: "IOT空氣盒子",
    content:
      "不知不覺竟然要延畢真的是差點笑死,雖然自己本來就知道自己因為專題要延畢，不過面對事實還真的是無能為力，總而言之是想到了一個題目<strong>空氣盒子</strong> 就是一個用兩顆sensor和Arduino做硬體，然後使用網頁當UI的一個project<br><br>" +
      "最初<em>空氣盒子</em>這個東西我原本覺得應該花個1個月自己應該就可以做完.<br><br>" +
      "不過最後我發現電路雖然接好了不過電路卻不會動拿了三用電表才發現VCC跟GND的腳位我搞錯了，重新裝上新的sensor然後再和上電路卻又發現電路還是死的!原來另位一顆sensor也被我燒掉了。沒想到上大學還要一直跑電子街，傻爆眼:(",
  },
];

var list = "";
var str = "";
for (var i = 0; i < data.length; i++) {
  str +=
    '<article class="blog-post"><h2 class="blog-post-title" id="post' +
    i +
    '">' +
    data[i].title +
    "</h2>" +
    '<p class="blog-post-meta">' +
    data[i].date +
    '<a href="https://www.instagram.com/garz.1333/">施宏勳</a></p>' +
    "<div class=\"post-preview\">" +
    "<div class=\"post-preview-inner\">" +
    data[i].content +
    "</div>" +
    "<div class=\"fade-overlay\"></div>" +
    "</div>" +
    "<button class=\"read-more\" data-target=\"post" + i + "\">顯示更多</button>" +
    "</article>";
  list += '<li><a href="#post' + i + '">' + data[i].title + "</li>";

  RecentPost.innerHTML = list;
  blogPost.innerHTML = str;
}

bigDisplay_titl.innerHTML = data[0].title;
bigDisplay_date.innerHTML =
  data[0].date + "<br>" + data[0].content.slice(0, 100) + ".......";
bigDisplay_more.innerHTML =
  '<a href="#post0" class="text-white fw-bold">更多...</a>';

let paginationLeftPos = "20px";
let paginationOpacity = 0;
let checkPaginationClick = 0;

$(".pagination-page-number").click(function () {
  $(".pagination-page-number").removeClass("active");
  $(this).addClass("active");
  paginationLeftPos = $(this).prop("offsetLeft") + "px";
  paginationOpacity = 1;
  checkPaginationClick = 1;

  $(".pagination-hover-overlay").css({
    left: paginationLeftPos,
    backgroundColor: "#00178a",
    opacity: paginationOpacity,
  });
  $(this).css({
    color: "#fff",
  });
});

$(".pagination-page-number").hover(
  function () {
    paginationOpacity = 1;
    $(".pagination-hover-overlay").css({
      backgroundColor: "#00c1dd",
      left: $(this).prop("offsetLeft") + "px",
      opacity: paginationOpacity,
    });

    $(".pagination-page-number.active").css({
      color: "#333d45",
    });

    $(this).css({
      color: "#fff",
    });
  },
  function () {
    if (checkPaginationClick) {
      paginationOpacity = 1;
    } else {
      paginationOpacity = 0;
    }

    $(".pagination-hover-overlay").css({
      backgroundColor: "#00178a",
      opacity: paginationOpacity,
      left: paginationLeftPos,
    });

    $(this).css({
      color: "#333d45",
    });

    $(".pagination-page-number.active").css({
      color: "#fff",
    });
  }
);

// --- Expand / Collapse post preview behavior ---
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.read-more');
  if (!btn) return;
  var target = btn.getAttribute('data-target');
  var postId = target && target.replace(/^post/, '');
  var article = btn.closest('article');
  var preview = article && article.querySelector('.post-preview');
  if (!preview) return;

  var isExpanded = preview.classList.contains('expanded');
  if (isExpanded) {
    preview.classList.remove('expanded');
    btn.textContent = '顯示更多';
    // restore focus for accessibility
    btn.setAttribute('aria-expanded', 'false');
  } else {
    preview.classList.add('expanded');
    btn.textContent = '收合';
    btn.setAttribute('aria-expanded', 'true');
  }
  // smooth scroll to the button if expanding on small screens
  if (!isExpanded && window.innerWidth < 768) {
    setTimeout(function () {
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 240);
  }
});
