# Ubuntu Installation Guide

## Check Python

Check local Python version, need version 3.7 or above, you can run python command in command line to check.

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/40.png)

## Install VeighNa

### Download Source Code

Download VeighNa source code (Ubuntu systems please choose tar.gz format):

- [VeighNa Github Download Address](https://github.com/vnpy/vnpy/releases)
- [VeighNa Gitee Download Address](https://gitee.com/mirrors/vn-py/releases)

After downloading, use tar command to extract the file, as shown in the figure below.

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/41.png)

### Execute One-Click Installation

Before installing VeighNa, you need to install gcc compiler first, used for compiling C++ interface files. Run the following commands in terminal:

```
sudo apt-get update
sudo apt-get install build-essential
```

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/39.png)

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/43.png)

Then enter the previously extracted VeighNa source code directory (containing install.sh file)

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/install/42.png)

Open terminal and run the following command to execute one-click installation:

```
sudo bash install.sh
```

Please note, if the python soft link name is not python, such as python3 or python3.10, please execute the following command:

```
sudo bash install.sh your_python_soft_link
```

The one-click installation process is divided into 3 steps overall:

1. Download and install ta-lib library and numpy;
2. Install VeighNa itself.

> If running on a virtual machine, please adjust memory to 4G or above, otherwise it will report memory insufficient error.

## Start VeighNa Trader

Enter the directory where VeighNa source code is extracted, and find the run.py file in the examples/veighna_trader folder.

Right-click to open terminal, enter the following command to start VeighNa Trader:

```
python run.py 
```

Please note that run.py contains many startup loading items (trading interfaces and application modules). Please modify and adjust usage according to your operating system and actual trading needs (if you need to load interfaces, just remove the comment symbols before the interfaces).

Please note that some interfaces do not support Ubuntu systems, please do not load them. Interface connection introduction can be found in the Trading Interface section (you can check the operating systems supported by interfaces).

> If there are library version incompatibility issues during startup, you can reinstall these libraries with pip according to the prompts.

## Common Issues

### Python Development Environment Issue Handling

If errors occur during installation due to missing header files "command 'gcc' failed with exit status 1", it may be caused by not properly installing Python development environment. You can try running the following command in terminal to solve:

```
sudo apt-get install your_python_soft_link-dev
```

### Graphics Driver Issue Handling

When starting on Ubuntu systems with graphical interface, if errors like "qt.qpa.plugin: Could not load the Qt platform plugin "xcb" in "" even though it was found" occur, you can run the following command in terminal to install libxcb-xinerama0, try to solve graphics driver dependency issues:

```
sudo apt-get install libxcb-xinerama0
```

### Chinese Encoding Issue Handling

If Ubuntu system language is English, when connecting to CTP interfaces that use Chinese language, the following errors may occur:

terminate called after throwing an instance of 'std::runtime_error'
what(): locale::facet::_S_create_c_locale name not valid

You can use locale-gen to install Chinese encoding to try to solve:

```
sudo locale-gen zh_CN.GB18030
```
