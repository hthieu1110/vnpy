# VSCode Development Guide

VSCode (Visual Studio Code) is a cross-platform free source code editor developed by Microsoft. Users can install extensions through the built-in extension store to expand its functionality. This document aims to provide users with a reference solution for developing VeighNa in VSCode.

This document is written based on Windows systems, but most of it is also applicable to Linux and Mac systems.

VeighNa supported Windows systems include:

- Windows 11
- Windows Server 2019/2022

> Other versions of Windows systems may encounter various dependency library issues during installation and are not recommended for use.

For using VeighNa on Windows systems, it is recommended to install the official [VeighNa Studio] Python distribution, **especially suitable for novice users who are new to Python development**.

## VSCode Installation

First, download the VS Code for Windows installation package from the [VSCode official website](https://code.visualstudio.com/):

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/1.png)

After downloading, double-click the installation package to enter the VSCode(User) installation wizard:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/2.png)

Select [I agree to this agreement], click [Next] to enter the target location selection page for installation directory selection:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/3.png)

Click [Next] to enter the start menu folder selection page for shortcut selection:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/4.png)

Click [Next] to enter the additional tasks selection page for additional task selection:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/5.png)

It is recommended to check all checkboxes here. The specific functions of each checkbox are as follows:

 - Check [Add "Open with Code" action to Windows Explorer file context menu] to allow users to directly open single files in VSCode through the right-click menu;
 - Check [Add "Open with Code" action to Windows Explorer directory context menu] to allow users to directly open entire folders and their contents in VSCode through the right-click menu;
 - Check [Register Code as an editor for supported file types] to set VSCode as the system's default editor for opening supported file types (such as .py, .txt, etc.);
 - Check [Add to PATH (restart required)] to add VSCode's installation directory to the PATH environment variable after installation is complete.

Click [Next] to enter the ready to install page, which will display the installation settings selected earlier:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/6.png)

Click [Install] to start installation. After installation is complete, it will jump to the installation success page:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/7.png)

If you checked the run Visual Studio Code option, VSCode will automatically open at this time.

## VeighNa Development

### Open Single File

After starting VSCode, click [Open File] in the pop-up welcome interface to open a single file, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/8.png)

In the pop-up Open File window, select the path where the file is stored, click the [Open] button to open the file in VSCode, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/9.png)

> Please note: If you open a file in restricted mode and want to temporarily close the restricted mode for that file, you can find the restricted mode prompt at the top of the window, click [Manage], and click [Trust] in the pop-up Workspace Trust page to close the restricted mode for that file.

### Open Folder

After starting VSCode, click [Open Folder] in the pop-up welcome interface to open a folder, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/10.png)

In the pop-up Open Folder window, select the path where the folder is stored, click the [Open] button to open the folder in VSCode, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/11.png)

### Save VSCode Development Project

For convenient centralized management of code resources and to avoid environment switching confusion, VSCode provides workspace support. Click [File] - [Save Workspace As...] to save the workspace to a specified path for easy access and use later.

To solve the problem of difficult project switching, workspaces also allow placing different projects in the same workspace. Click [File] - [Add Folder to Workspace...] to add folders to the workspace.

### Python Environment Selection

After installing the Python extension, open any .py file, and you can see the current Python environment information in the bottom right corner of the VSCode window, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/14.png)

Please note that the default display is the automatically searched Python environment. If there are multiple Python environments in the current system, you can click the Python environment information in the bottom right corner and select other environments from the dropdown that appears at the top of the window to switch, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/15.png)

### Running Programs

Download the VeighNa Trader [startup script file run.py](https://github.com/vnpy/vnpy/blob/master/examples/veighna_trader/run.py) from the Github code repository and open the run.py file through VSCode, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/23.png)

Click the run button in the upper right corner of VSCode and select [Run Python File] to run the run.py script:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/24.png)

At this time, you can see the program's print information during runtime in the TERMINAL terminal content output tab at the bottom of the interface:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/25.png)

At the same time, the VeighNa Trader main window will also automatically pop up and display:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/26.png)

Please note:
 - When starting the script here, it will run in the Python environment currently used by VSCode. If you need to use other Python environments, please refer to the previous steps to switch;
 - If you want to run the script directly in the terminal, you can hold Ctrl + J to open Terminal and enter commands to start VeighNa Trader;
 - The "No data service configured for use, please modify datafeed related content in global configuration" output printed in the above figure does not affect VeighNa Trader's operation; if you need to configure data services, you can configure it in VeighNa Trader main interface [Configuration] - [Global Configuration], if you don't need to configure data services, you can ignore this output.

### Breakpoint Debugging

VSCode provides powerful breakpoint debugging functionality. Here we use a VeighNa strategy historical backtesting script to demonstrate.

Click [New File], select [Python File] in the window that appears at the top, and create backtest.py in the pop-up tab:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/27.png)

Then write a strategy backtesting code in the file (you can refer to the [backtesting example](https://github.com/vnpy/vnpy/blob/master/examples/cta_backtesting/backtesting_demo.ipynb) in the Github repository), and set breakpoints at the code lines where you want to pause debugging, as shown in the figure below (red dot on the left):

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/28.png)

Click the downward button in the upper right corner of VSCode and select [Python Debugger: Debug Python File] to start debugging the script:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/29.png)

Click the Run and Debug icon in the left menu bar ![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/30.png) or press F5 directly to start debugging.

After starting debugging, you can see that the RUN AND DEBUG area on the left side of the window starts outputting program running information, and the program pauses at the first breakpoint. The left side respectively displays variable information, watch information, call stack information, and breakpoint information. Click variables to see detailed information, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/31.png)

Click the play-like [Continue] or press F5 to continue running debugging until the next breakpoint where it pauses again, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/32.png)

At this time, you can see that the variables in the current context have changed in the VARIABLES area on the bottom left:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/33.png)

Subsequently repeat the above steps, click [Continue] until debugging ends, and you can see the corresponding output in Terminal:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/34.png)

During debugging:

- Click [Step Into] to enter the interior of sub-functions to view detailed states at runtime;
- Click [Step Out] to jump out of the current function and view the state of the outer call stack;
- Click [Step Over] to skip sub-functions (sub-functions will execute);
- Click [Restart] to restart the debugging task;
- Click [Stop] to directly stop the current debugging task.

In the VARIABLES area, select the variable name you want to monitor and right-click to select [Add to Watch], and you can observe variable changes in the WATCH monitoring area, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/35.png)

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/36.png)

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/37.png)

The DEBUG CONSOLE at the bottom of the window provides interactive debugging functionality support, allowing you to run any commands during debugging, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/38.png)

## Extension Installation

VSCode provides extremely rich extension plugin functionality that can significantly improve user development efficiency and convenience.

### Required Extensions

#### Python

Click the Extensions icon in the left menu bar of VSCode, search for [Python], click [install] to install the Python extension, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/13.png)

When installing the Python extension, Pylance (providing type checking, code completion, reference jumping, and code diagnostic support) and Python Debugger (providing breakpoint debugging functionality) extensions will be automatically installed.

After installing the Python extension, you can see three extensions: Python, Pylance, and Python Debugger in VSCode's Extension bar, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/16.png)

After installing the Pylance extension, in the opened script, move the mouse cursor over the code, and the corresponding documentation information will automatically pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/17.png)

If you hold Ctrl while left-clicking the code with the mouse, it will jump to the code declaration part, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/18.png)

#### Jupyter

Click the Extensions icon in the left menu bar of VSCode, search for [Jupyter], click [install] to install the Jupyter extension, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/19.png)

The Jupyter extension integrates Jupyter Notebook functionality into VSCode, allowing users to open, edit, and run Notebooks in VSCode.

When installing the Jupyter extension, the following will be automatically installed:

- Jupyter Cell Tags (providing support for adding tags in cells);
- Jupyter Keymap (providing shortcut key support);
- Jupyter Notebook Renderers (providing rendering and parsing support for different content types);
- Jupyter Slide Show (providing slide support) extensions.

After installing the Jupyter extension, you can see five extensions: Jupyter, Jupyter Cell Tags, Jupyter Keymap, Jupyter Notebook Renderers, and Jupyter Slide Show in VSCode's Extension column, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/20.png)

#### Flake8

Click the Extensions icon in the left menu bar of VSCode, search for [Flake8], click [install] to install the Flake8 extension, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/21.png)

The Flake8 extension can check whether Python code conforms to PEP 8 code style specifications, including errors in code, overly complex constructions, and places that do not conform to PEP8 style guidelines.

When the Flake8 extension detects non-standard or erroneous code, it will display red wavy lines below the code as warnings, helping users quickly locate problems, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/vscode/22.png)

The Flake8 extension will also display all detected errors in the entire workspace in the [PROBLEMS] tab at the bottom of the window, as shown in the figure above.

### Optional Extensions

#### Chinese Language

Function: Translate VSCode's interface and menus into Chinese, suitable for users who are not familiar with English.

#### Excel Viewer

Function: Allows users to directly view and edit CSV files in VSCode, supporting basic cell editing, filtering, and sorting functions.

#### One Monokai Theme

Function: Provides code highlighting themes, making code easier to read and understand by changing code colors, fonts, and backgrounds.

#### Material Icon Theme

Function: Replaces file and directory icons in VSCode with Material Design style icons, making files and directories easier to distinguish and identify in the sidebar.

#### Github Copilot

Function: An artificial intelligence code assistance tool jointly developed by GitHub and OpenAI, improving code portability and consistency.

#### C/C++ and C/C++ Extension Pack

Function: Provides C/C++ language support, code debugging, code formatting, code completion, header file inclusion and other functional support.
