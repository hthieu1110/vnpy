# VeighNa Station

## Starting the Program

### Click Icon to Start

After successful installation, double-click the VeighNa Station shortcut on the desktop:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/1.png)

You can run VeighNa Station.

### Command Line Start

Open command line tool, enter veighna and press Enter to run, you can start VeighNa Station.

## User Login

When using VeighNa Station for the first time, a VeighNa Studio disclaimer will pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/2.png)

After carefully reading and clicking [Confirm], a user login interface containing username input box, password input box, login button, and register button will pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/3.png)

Users enter their username in the username input box and password in the password input box as required, then click the [Login] button to complete login and enter the VeighNa Station main running program.

New users can click the [Register] button to register an account, and can login after registration is complete. Please note when registering:

- Please fill in your personal email address truthfully (will be used for password recovery and other forum functions later);
- Username automatically uses the [nickname] from WeChat during registration (cannot be modified);
- Please remember the password, which is also used for logging into the VeighNa community forum.

**The login interface only pops up when running VeighNa Station for the first time**. After that, VeighNa Station will automatically login when running.

## Interface Window

After login is complete, the VeighNa Station interface will automatically pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/4.png)

The interface is mainly divided into menu bar, title bar, function bar, main display area, learning and usage area, and official channel area.

### Menu Bar

The menu bar is located at the top, containing [System] and [Help] buttons.

#### Configuration

Click [System] -> [Configuration], and a system configuration window will pop up where you can modify PyPI index and pip proxy, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/5.png)

PyPI index is used to change the pypiserver address used by VeighNa Station. When left empty, it defaults to using the https://pypi.org PyPI server.

pip proxy is empty by default, users can set it themselves. After modification, you can click the [Save] button to save the configuration and exit the window.

#### Logout

Click [System] -> [Logout], and a logout window will pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/6.png)

Click [Yes] to logout the user and immediately close the program. After user logout, next time you start, you need to re-login.

#### Close

Click [System] -> [Close], and an exit window will pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/7.png)

Click [Yes] to immediately close the program.

### Main Window

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/9.png)

As shown in the figure above, the left area in the figure is the function bar, and the right area is the main display area. The function bar includes community, trading, investment research, crypto, update, etc. As different selections are made in the left function bar, the right main display area will display corresponding related content.

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/10.png)

As shown in the figure above, the bottom left corner of the VeighNa Station interface is the learning and usage area.

Click [Usage Documentation] to open a browser and jump to the official documentation https://www.vnpy.com/docs/cn/index.html, where users can query detailed usage instructions.

Click [Community Help] to open a browser and jump to the official forum https://www.vnpy.com/forum/, where users can query technical posts and post for communication.

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/11.png)

As shown in the figure above, below the learning and usage area is the official channel area.

From left to right are the official Github repository, official WeChat public account, and official Zhihu account. Click to open browser and directly jump to related pages.

## Function Usage

### Community

Click the [Community] button on the left side of VeighNa Station, and the right main display area shows the official forum content, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/4.png)

Users can browse official forum content in this area.

### Trading

Click the [Trading] button on the left side of VeighNa Station, and the right main display area shows the trading interface, application module selection area, and information output area, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/12.png)

Click the white checkbox after the trading interface or application module you need to load to select. Then click the [Start] button in the bottom left corner of the main display area to start VeighNa Trader. At this time, the output area on the right will output program running information, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/13.png)

Click the [Modify] button in the bottom right corner of the main display area to modify the running directory.

### Investment Research

Click the [Investment Research] button on the left side of VeighNa Station, and the right main display area is the jupyterlab application operation directory, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/14.png)

After clicking the [Start] button in the bottom left corner of the main display area, the jupyterlab application will run in the running directory specified in the bottom right corner, and you can perform investment research operations in the jupyterlab application, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/15.png)

### Crypto

Click the [Crypto] button on the left side of VeighNa Station, and the right main display area shows crypto-related content, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/16.png)

Users can compile selected .py files into .pyd files in this interface to encrypt strategies.

Click the [Select] button, select the path of the strategy file that needs to be encrypted in the pop-up window, and click the [Open] button. At this time, the input bar in the bottom left corner of the main display area will change to the absolute path of the file that needs to be encrypted, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/17.png)

Click the [Encrypt] button to compile the file. At this time, the central display area will output relevant information during the encryption process, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/18.png)

After the output file encryption process ends, an encrypted pyd file will be generated at the location of the encrypted file.

Please note that after encryption, you need to **remove the .cp310-win_amd64 part from the pyd file name** first, then put it into the self-built strategies folder.

### Update

Click the [Update] button on the left side of VeighNa Station, and the right main display area shows component update related content, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/19.png)

Click the [Check] button in the bottom left corner of the main display area, and it will display locally installed modules and versions, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/20.png)

Click the [Update] button in the bottom right corner of the main display area, and the background will start the update process and output relevant information, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/veighna_station/21.png)

After the update is complete, a notification window will pop up. Click [OK] and restart VeighNa Station.
