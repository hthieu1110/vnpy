# PyCharm Development Guide

PyCharm is an IDE launched by JetBrains specifically for Python language. It has a complete set of tools that can help users improve efficiency when developing with Python language. This document is intended to provide users with a solution for developing and using VeighNa through PyCharm for reference.

The content in this document is written based on Windows systems, but most of it is also applicable to Linux/Mac systems.

VeighNa applicable Windows systems include:

- Windows 10/11
- Windows Server 2019/2022

> Other versions of Windows systems may encounter various dependency library issues during installation and are not recommended for use.

For using VeighNa on Windows systems, it is recommended to install the official [VeighNa Studio] Python distribution, **especially for novice users who are new to Python development**.

## PyCharm Installation

First, download the PyCharm Community installation package from the [PyCharm official website](https://www.jetbrains.com/pycharm/download/?section=windows#section=windows):

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/1.png)

After downloading, double-click the installation package to enter the PyCharm installation wizard:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/2.png)

If you want to set installation options, you can check related options on the PyCharm Community Edition Setup page:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/3.png)

After installation is complete, it will jump to the installation success page:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/4.png)

If you checked the Create Desktop Shortcut option earlier to create a desktop shortcut, a PyCharm icon will appear on the desktop at this time. Double-click the icon to run PyCharm.

## VeighNa Development

### Creating Projects

After starting PyCharm, click [New Project] in the pop-up welcome interface to create a new project, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/6.png)

In the pop-up new project window, first select the folder path [Location] where the project is stored, then check the [Previously configured interpreter] option in the Python interpreter options (i.e., the Python environment already installed in the current system):

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/7.png)

Click [Add Local Interpreter] in the Add Interpreter dropdown on the right, click [System Interpreter] tab on the left in the pop-up dialog, and select the path where the VeighNa Studio built-in Python interpreter is located from the dropdown that appears on the right:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/8.png)

Click the [OK] button at the bottom to save the interpreter configuration, return to the new project window, and click the [Create] button in the bottom right to complete the new project creation:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/9.png)

The successfully created project window is shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/10.png)

At this time, click [External Libraries] in the upper left to see the external libraries that can be called in the project:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/11.png)

Click the site_packages folder, scroll down to find the vnpy core framework package and vnpy_ prefixed plugin module packages in VeighNa Studio. At this time, you can click the corresponding icon to view the source code files in each package, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/13.png)

Move the mouse cursor over the code, and the corresponding code documentation information will automatically pop up:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/14.png)

If you hold Ctrl while left-clicking the code with the mouse, it will jump to the code declaration part:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/15.png)

Click the [Python 3.10] button in the bottom right corner of the window to pop up the [Settings] project configuration window, where you can see the package names, local version numbers, and latest version numbers installed in the current interpreter environment. Packages with upgrade symbols (upward arrows) indicate that the current version is not the latest. Click the upgrade symbol to automatically upgrade.

> Please note: Due to VeighNa's strict version requirements for some dependency libraries, it is not recommended for users to manually upgrade installed packages to the latest version, as version conflicts may occur.

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/49.png)

### Running Programs

Download the [VeighNa Trader startup script file run.py](https://github.com/vnpy/vnpy/blob/master/examples/veighna_trader/run.py) from the Github code repository and place it in the trader folder. You can see the run.py file in the project navigation bar on the left side of the window:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/16.png)

If you can see green wavy lines below some code (variable name English word checking), you can click the main menu button to the left of the project name - [File] - [Settings] - [Editor] - [Inspections] - [Proofreading], uncheck [Typo] and click [OK] to confirm. Then return to the main window, and you can find that the green wavy lines have disappeared:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/17.png)

Right-click the mouse and select [Run 'run'] to start running the run.py script:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/21.png)

At this time, you can see the program's print information during runtime in the terminal content output area at the bottom of the interface:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/19.png)

At the same time, the VeighNa Trader main window will also automatically pop up and display:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/20.png)

Return to PyCharm, you can see that the run script's running record is already in the upper right corner of the project interface. You can also run the script directly by clicking the triangle run button later, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/18.png)

### Breakpoint Debugging

PyCharm's breakpoint debugging function is very powerful. Here we use a VeighNa strategy historical backtesting script to demonstrate.

Right-click in the left project navigation bar and select [New] - [File]. In the pop-up dialog, create backtest.py:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/25.png)

Then write a strategy backtesting code in the file (you can refer to the [backtesting example](https://github.com/vnpy/vnpy/blob/master/examples/cta_backtesting/backtesting_demo.ipynb) in the Github repository), and set breakpoints where you want to debug, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/26.png)

Right-click and select [Debug 'backtest'] to start debugging the script:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/27.png)

At this time, you can see the running record of backtest.py in the upper right corner of the project interface. You can also start the debugging task directly by clicking the button here later:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/28.png)

After starting debugging, you can see that the Debug window at the bottom of the main interface starts outputting program running information, and the program pauses at the first breakpoint. The left side shows thread information, and the right side shows variable information in the current context:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/29.png)

Click the play-like [Resume Program] to continue running the debugging until the next breakpoint where it pauses again:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/30.png)

At this time, you can see that the variables in the current context have changed in the monitoring window on the bottom right:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/31.png)

Subsequently repeat the above steps, click [Resume Program] until debugging ends, and you can see the corresponding output in the Debug window:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/32.png)

After debugging, click [Rerun 'backtest'] to re-debug:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/33.png)

During debugging, click [Step Into] to enter the function's interior to view the detailed state at runtime:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/34.png)

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/35.png)

Click [Step Out] to jump out of the current function and view the state of the outer call stack:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/37.png)

Click [Step Over] to skip sub-functions (sub-functions will execute):

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/36.png)

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/38.png)

Click [Stop 'backtest'] to directly stop the current program:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/39.png)

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/pycharm/40.png)

## Comparison with VS Code

1. In PyCharm, each project needs to configure the Python environment. In VS Code, the global Python environment is selected by default through the Python interpreter in the bottom right corner of the window (for all open files);

2. PyCharm Community edition only provides read-only support for Jupyter, and you need Professional edition to edit and run. VS Code only needs to install functional plugins to use all Jupyter-related functions (including reading, editing, and running).
