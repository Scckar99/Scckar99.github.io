---
title: Linux 常用操作命令大全
publishDate: 2025-10-17
description: '一篇覆盖 Linux 常用命令的速查文档，包含系统操作、目录文件管理、权限控制和打包解压，适合入门与日常运维。'
tags:
  - Linux
  - Shell
  - 运维入门
heroImage: { src: './thumbnail.jpg', color: '#64574D' }
language: '中文'
---

## 一、基础知识

### 1.1 Linux 系统常见目录结构

```text
/bin        二进制文件，系统常规命令
/boot       系统启动相关文件
/dev        设备文件
/etc        系统与服务配置文件
/home       普通用户家目录
/lib        32 位函数库
/lib64      64 位函数库
/media      可移动设备挂载点
/mnt        临时挂载点
/opt        第三方软件安装位置
/proc       进程信息及硬件信息（虚拟文件系统）
/root       root 用户家目录
/sbin       系统管理命令
/srv        服务相关数据
/var        经常变化的数据（日志、缓存等）
/sys        内核与设备相关信息（虚拟文件系统）
/tmp        临时文件
/usr        用户程序与共享资源
```

### 1.2 Linux 命令行提示符含义

```bash
root@app00:~#
```

- `root`：用户名（`root` 为超级用户）
- `@`：分隔符
- `app00`：主机名
- `~`：当前目录（用户家目录）
- `#`：超级用户提示符；普通用户通常是 `$`

### 1.3 命令的组成

```text
命令 [选项] [参数]
```

## 二、基础操作

### 2.1 关闭系统

```bash
# 立刻关机
shutdown -h now
# 或
poweroff

# 两分钟后关机
shutdown -h 2
```

### 2.2 重启系统

```bash
# 立刻重启
shutdown -r now
# 或
reboot

# 两分钟后重启
shutdown -r 2
```

### 2.3 帮助命令

```bash
ifconfig --help   # 查看 ifconfig 命令用法
```

### 2.4 命令说明书（man）

```bash
man shutdown       # 查看 shutdown 手册，按 q 退出
```

### 2.5 切换用户（su）

```bash
su - yao            # 切换为用户 yao（会加载该用户环境）
exit                # 退出当前用户会话
```

## 三、目录操作

### 3.1 切换目录（cd）

```bash
cd /                  # 切换到根目录
cd /bin               # 切换到 /bin 目录
cd ..                 # 切换到上一级目录
cd ~                  # 切换到用户家目录
cd -                  # 切换到上一次访问目录
cd xx                 # 切换到当前目录下的 xx 目录
cd /xxx/xx/x          # 使用绝对路径切换目录（可用 Tab 补全）
```

### 3.2 查看目录（ls）

```bash
ls                    # 查看当前目录文件
ls -a                 # 显示全部文件（含隐藏文件）
ls -l                 # 详细列表显示（常见别名 ll）
ls /bin               # 查看指定目录内容
```

### 3.3 创建目录（mkdir）

```bash
mkdir tools           # 在当前目录创建 tools
mkdir /bin/tools      # 在指定目录创建 tools
```

### 3.4 删除目录与文件（rm）

```bash
rm 文件名             # 删除当前目录文件
rm -f 文件名          # 强制删除文件（不询问）
rm -r 文件夹名        # 递归删除目录
rm -rf 文件夹名       # 强制递归删除目录（危险）
rm -rf *              # 删除当前目录全部内容（危险）
rm -rf /*             # 删除根目录全部内容（极危险，严禁误用）
```

### 3.5 移动/重命名（mv）

```bash
mv 旧名称 新名称               # 重命名（文件和目录都适用）
mv /usr/tmp/tool /opt          # 将 tool 移动到 /opt
```

### 3.6 拷贝目录/文件（cp）

```bash
cp /usr/tmp/file.txt /opt           # 复制文件
cp -r /usr/tmp/tool /opt            # 递归复制目录
```

### 3.7 搜索文件（find）

```bash
find /bin -name 'a*'          # 查找 /bin 下以 a 开头的文件或目录
```

### 3.8 查看当前目录（pwd）

```bash
pwd                           # 显示当前路径
```

## 四、文件操作

### 4.1 新增文件（touch）

```bash
touch a.txt                    # 文件不存在则创建；存在则更新时间戳
```

### 4.2 删除文件（rm）

```bash
rm 文件名                      # 删除文件
rm -f 文件名                   # 强制删除（不询问）
```

### 4.3 编辑文件（vi、vim）

```bash
vi 文件名
```

进入 `vi/vim` 后常见三种模式：

- 命令模式（默认进入）
  - `dd`：删除当前行
  - `/关键词`：搜索
  - `i`：在光标前插入
  - `a`：在光标后插入
  - `o`：在当前行下方新起一行
  - `:`：进入底行模式
- 插入模式
  - 可编辑文本，按 `ESC` 返回命令模式
- 底行模式（先按 `:` 进入）
  - `:q` 退出
  - `:q!` 强制退出不保存
  - `:wq` 保存并退出

补充：

```bash
vim +10 filename.txt          # 打开文件并跳到第 10 行
vim -R /etc/passwd            # 只读模式打开文件
```

### 4.4 查看文件

```bash
cat a.txt                # 查看文件全部内容
less a.txt               # 分页查看，q 退出
more a.txt               # 分页查看（旧工具）
tail -100 a.txt          # 查看文件最后 100 行
tail -f a.txt            # 实时追踪文件新增内容
```

## 五、文件权限

### 5.1 权限说明

```text
r = 可读（4）
w = 可写（2）
x = 可执行（1）
```

示例：`-rwxrw-r--`

- 第一位：`-` 表示普通文件，`d` 表示目录
- 第一组三位：文件拥有者权限
- 第二组三位：所属组权限
- 第三组三位：其他用户权限

### 5.2 文件权限设置（chmod）

```bash
chmod +x a.txt         # 增加执行权限
chmod 777 a.txt        # 8421 法：7=4+2+1（读写执行）
```

## 六、打包与解压

### 6.1 常见压缩格式

```text
.zip、.rar      Windows 常见压缩格式
.tar            Linux 打包格式（仅打包）
.gz             Linux 压缩格式（gzip）
.tar.gz         Linux 打包并压缩格式
```

### 6.2 打包文件

```bash
tar -zcvf 打包压缩后的文件名.tar.gz 要打包的文件

# 参数说明
# z: 调用 gzip 压缩
# c: 创建归档文件
# v: 显示过程
# f: 指定输出文件名

tar -zcvf a.tar.gz file1 file2         # 多文件打包压缩
```

### 6.3 解压文件

```bash
tar -zxvf a.tar.gz                    # 解压到当前目录
tar -zxvf a.tar.gz -C /usr/local      # 解压到指定目录
unzip test.zip                        # 解压 zip 文件
unzip -l test.zip                     # 查看 zip 内容
```

## 七、其他常用命令

### 7.1 find

```bash
find . -name "*.c"                              # 在当前目录及子目录查找 .c 文件
find . -type f                                  # 查找普通文件
find . -ctime -20                               # 查找最近 20 天内变更过的文件
find /var/log -type f -mtime +7 -ok rm {} \;   # 删除 7 天前日志（删除前确认）
find . -type f -perm 644 -exec ls -l {} \;     # 查找权限为 644 的文件
find / -type f -size 0 -exec ls -l {} \;       # 查找空文件并列出
```

### 7.2 whereis

```bash
whereis ls               # 查找 ls 相关文件（可执行文件、源码、man）
```

### 7.3 which

```bash
which bash               # 在 PATH 中查找 bash 的可执行文件路径
```

### 7.4 sudo

```bash
sudo -l                                # 列出当前账户可用 sudo 权限
sudo -u yao vi /home/www/index.html    # 以 yao 用户身份编辑文件
```

### 7.5 grep

```bash
grep -i "the" demo_file                # 忽略大小写查找
grep -A 3 -i "example" demo_text       # 输出匹配行及其后 3 行
grep -r "ramesh" *                     # 递归查找包含指定字符串的文件
```

### 7.6 service

```bash
service ssh status        # 查看服务状态
service --status-all      # 查看所有服务状态
service ssh restart       # 重启服务
```

### 7.7 free

```bash
free -g              # 以 GB 查看内存
free -m              # 以 MB 查看内存
free -t              # 查看内存汇总
```

### 7.8 top

```bash
top                  # 查看实时进程资源占用（Shift + M 按内存排序）
```

### 7.9 df

```bash
df -h                # 以可读方式显示磁盘使用情况
```

### 7.10 mount

```bash
mount /dev/sdb1 /u01                # 挂载文件系统到 /u01（目录需提前创建）
# /etc/fstab 示例（开机自动挂载）
/dev/sdb1 /u01 ext4 defaults 0 2
```

### 7.11 uname

```bash
uname -a              # 查看内核、主机名、系统架构等信息
```

### 7.12 yum

```bash
yum install httpd       # 安装 Apache
yum update httpd        # 更新 Apache
yum remove httpd        # 卸载 Apache
```

### 7.13 rpm

```bash
rpm -ivh httpd-2.2.3-22.0.1.el5.i386.rpm   # 安装 rpm 包
rpm -uvh httpd-2.2.3-22.0.1.el5.i386.rpm   # 更新 rpm 包
rpm -ev httpd                               # 卸载 rpm 包
```

### 7.14 date

```bash
date -s "01/31/2010 23:59:53"     # 设置系统时间
```

### 7.15 wget

```bash
wget http://prdownloads.sourceforge.net/sourceforge/nagios/nagios-3.2.1.tar.gz
wget -O nagios.tar.gz http://prdownloads.sourceforge.net/sourceforge/nagios/nagios-3.2.1.tar.gz
```

### 7.16 ftp

```bash
ftp IP/hostname       # 访问 FTP 服务器
mls *.html -          # 显示远程主机文件列表
```

### 7.17 scp

```bash
scp /opt/data.txt 192.168.1.101:/opt/    # 复制本地文件到远程服务器
```

## 八、系统管理

### 8.1 防火墙操作

```bash
# CentOS 6（iptables）
service iptables status
service iptables start
service iptables stop
service iptables restart
chkconfig iptables off
chkconfig iptables on

# CentOS 7+（firewalld）
systemctl status firewalld
systemctl stop firewalld
systemctl disable firewalld
```

### 8.2 修改主机名（CentOS 7）

```bash
hostnamectl set-hostname 主机名
```

### 8.3 查看网络

```bash
ifconfig
# 或
ip addr
```

### 8.4 修改IP

```text
配置文件示例：/etc/sysconfig/network-scripts/ifcfg-ens33
```

```ini
TYPE=Ethernet
BOOTPROTO=static
DEVICE=ens33
IPADDR=192.168.1.100
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
DNS1=192.168.1.1
DNS2=8.8.8.8
ONBOOT=yes
```

```bash
service network restart        # 或 systemctl restart network
```

### 8.5 配置映射

```bash
vi /etc/hosts
```

```text
192.168.1.101 node1
192.168.1.102 node2
192.168.1.103 node3
```

```bash
ping node1
```

### 8.6 查看进程

```bash
ps -ef            # 查看所有进程
```

### 8.7 结束进程

```bash
kill PID          # 结束进程
kill -9 PID       # 强制结束进程
```

### 8.8 查看连接

```bash
ping IP                    # 查看与目标 IP 的连通性
netstat -an                # 查看系统端口连接信息
netstat -an | grep 8080    # 查看指定端口
```

### 8.9 快速清屏

```text
Ctrl + L        # 清屏（滚动仍可查看历史）
```

### 8.10 远程主机

```bash
ssh 用户名@IP   # 远程登录主机
```
