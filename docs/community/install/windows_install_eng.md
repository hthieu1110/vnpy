# Windows Installation Guide

The installation steps in this document are applicable to the following Windows systems:

- Windows 10/11
- Windows Server 2019

> Other versions of Windows systems may encounter various dependency library issues during installation and are not recommended.

For installing VeighNa on Windows systems, it is recommended to use the official [VeighNa Studio Python distribution], **especially for programming novices who are new to Python**.

As a one-stop quantitative investment research and trading Python environment, VeighNa Studio integrates:

- Python 3.10 64-bit (Python official version)
- VeighNa and other related dependency libraries
- VeighNa Station (graphical management tool for VeighNa framework)

For users who already have rich programming experience or need to use specific Python distributions (such as Anaconda), they can also adopt manual installation solutions.

## VeighNa Studio Solution

### Download and Install

You can download the VeighNa Studio installation package from the [VeighNa official website](https://www.vnpy.com/).

After downloading, double-click the installation package to enter the VeighNa Studio installation wizard (it is recommended to right-click and select [Run as administrator] for installation). Use default settings and click the [Quick Install] button to proceed with VeighNa Studio installation, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/21.png)

> It is recommended to install VeighNa Studio in the default path C:\veighna_studio. Other VeighNa documentation and tutorials use this directory as the VeighNa installation directory for explanation.

If you want to perform personalized installation, you can click [Custom Install] to enter the advanced options page, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/24.png)

After installation is complete, it will switch to the installation success page, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/26.png)

At this time, a VeighNa Station icon will appear on the desktop. Double-click the icon to run VeighNa Station.

### Usage

After successful installation, start the command line tool to directly use the VeighNa Studio Python distribution.

Enter python to enter the Python interactive environment, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/29.png)

At this time, entering Python code in the command line will execute immediately. If you want to run pyqtgraph's built-in examples, you can enter the following code in sequence:

```python3
from pyqtgraph import examples
examples.run()
```

At this time, the Examples running window will pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/30.png)

Click Basic Plotting on the left to pop up the example graphical interface, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/31.png)

If you want to open jupyter lab for investment research work, you can open cmd and enter jupyter lab to start successfully, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/32.png)

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/38.png)

### Modification

If you want to add or remove certain functions after installation, you can double-click the VeighNa Studio installation package to enter the VeighNa Studio installation interface, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/33.png)

Click [Modify] to enter the modification page, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/35.png)

After selecting optional functions, click [Next] to enter the advanced options page, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/37.png)

After selection is complete, you can reinstall.

### Repair

If there are incomplete installations or other situations that need repair after installation, you can double-click the VeighNa Studio installation package to enter the VeighNa Studio installation interface, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/33.png)

Click [Repair] to enter the repair interface, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/34.png)

After repair is complete, it will switch to the repair success page, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/15.png)

### Uninstall

If you want to uninstall VeighNa Studio, you can double-click the VeighNa Studio installation package to enter the VeighNa Studio installation interface, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/33.png)

Click [Uninstall] to enter the uninstall interface, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/27.png)

After uninstallation is complete, it will switch to the uninstall success page, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/28.png)

## Manual Installation Solution

### Prepare Python Environment

First, please prepare a Python 3.10 64-bit environment on your computer (**note that it must be a 64-bit version**). It is recommended to use the Python official distribution, or you can use distributions such as Anaconda, Miniconda, Canopy, etc.

Here we take the Python official distribution as an example. First, download the installation file from the [Python official website](https://www.python.org/downloads/windows/), select [Windows installer (64-bit)], as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/22.png)

After downloading, double-click the file to enter the Python installation wizard. Check the [Add Python3.10 to PATH] option, then click [Install Now] to proceed with installation. It is recommended to use default settings and click [Next] all the way until installation is complete:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/23.png)

### Download and Install VeighNa

Download VeighNa source code (Windows systems please choose zip format):

- [VeighNa Github Download Address](https://github.com/vnpy/vnpy/releases)
- [VeighNa Gitee Download Address](https://gitee.com/mirrors/vn-py/releases)

After downloading, extract the file, then start the command line tool (CMD or PowerShell), enter the directory where the source code is located (i.e., the directory where the install.bat file is located), and enter the following command to run the script for one-click installation:

```
install.bat
```

The one-click installation process is divided into 3 steps overall:

1. Download and install ta-lib library;
2. Install VeighNa itself.

If an error occurs during any step of the installation process, please capture and save the error information in the command line (**note to prioritize saving the error content at the bottom**), and go to the VeighNa community forum to post questions seeking help.

### Start VeighNa Trader

Start the command line tool, enter the directory where VeighNa source code is extracted, and find the run.py file in the examples/veighna_trader folder.

Enter the following command to start VeighNa Trader:

```
python run.py 
```

Please note that run.py contains many startup loading items (trading interfaces and application modules). Please modify and adjust usage according to your operating system and actual trading needs (if you need to load interfaces, just remove the comment symbols before the interfaces).

Interface connection introduction can be found in the Trading Interface section.

> If there are library version incompatibility issues during startup, you can reinstall these libraries with pip according to the prompts.
