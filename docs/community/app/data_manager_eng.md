# DataManager - Historical Data Management Module

## Feature Introduction

DataManager is a functional module for **historical data management**. Users can easily complete tasks such as data download, data viewing, data import, and data export through its UI interface operations.

## Loading and Startup

### VeighNa Station Loading

After starting and logging into VeighNa Station, click the [Trading] button, and check [DataManager] in the [Application Modules] column of the configuration dialog.

### Script Loading

Add the following code in the startup script:

```python3
# Write at the top
from vnpy_datamanager import DataManagerApp

# Write after creating the main_engine object
main_engine.add_app(DataManagerApp)
```

## Starting the Module

After starting VeighNa Trader, click [Function] -> [Data Manager] in the menu bar, or click the icon in the left button bar:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/00.png)

You can enter the historical data management UI interface, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/1.png)

## Download Data

The DataManager module provides one-click historical data download functionality. Click the [Download Data] button in the upper right corner, and a download historical data window will pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/2.png)

You need to fill in four field information: code, exchange, period, and start date:

- Code
  - Code format is contract variety
  - Such as IF888, rb2105
- Exchange
  - Exchange where the contract is traded (click the arrow button on the right side of the window to select from the list of exchanges supported by VeighNa)
- Period
  - MINUTE (1-minute K-line)
  - HOUR (1-hour K-line)
  - DAILY (daily K-line)
  - WEEKLY (weekly K-line)
  - TICK (one Tick)
- Start Date
  - Format is yy/mm/dd
  - Such as 2018/2/25

After filling in, click the [Download] button at the bottom to start the download program. Successful download is shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/3.png)

Note that the downloaded historical data will be saved in the local database and can be used directly for subsequent backtesting or live trading without needing to download repeatedly each time.

### Data Source: Data Services (Futures, Stocks, Options)

Taking RQData as an example, [RQData](https://www.ricequant.com/welcome/purchase?utm_source=vnpy) provides domestic futures, stocks, and options historical data. Before use, ensure that the data service has been correctly configured (configuration method can be found in the global configuration section of basic usage).

### Data Source: IB (Overseas Futures, Stocks, Spot, etc.)

Interactive Brokers (IB) provides rich overseas market historical data download (including stocks, futures, options, spot, etc.). Note that before downloading, you need to first start the IB TWS trading software, connect the IB interface in the VeighNa Trader main interface, and subscribe to the required contract market data.

## Import Data

If you have already obtained CSV format data files from other channels, you can quickly import them into the VeighNa database through DataManager's data import functionality. Click the [Import Data] button in the upper right corner, and a dialog box will pop up as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/21.png)

Click the [Select File] button at the top, and a window will pop up to select the CSV file path to import, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/5.png)

Then configure the relevant details for data import:

- Contract Information
  - Format details can be found in the [Download Data](#jump) section introduction;
  - Please note that the imported contract code (symbol) and exchange (exchange) fields combined constitute the local code (vt_symbol) used in CTA backtesting and other modules;
  - If the contract code is **IF2003** and the exchange is **CFFEX** (China Financial Futures Exchange), then the local code used in CtaBacktester backtesting should be **IF2003.CFFEX**;
  - You can select the timezone for timestamps;
- Header Information
  - You can view the header information of the CSV file and input the corresponding header string in the header information;
  - For fields that do not exist in the CSV file (such as stock data not having [Open Interest] field), please leave blank;
- Format Information
  - Uses Python's built-in datetime module's time format definition to parse timestamp strings;
  - Default time format is "%Y-%m-%d %H:%M:%S", corresponding to "2017-1-3 0:00:00";
  - If the timestamp is "2017-1-3  0:00", then the time format should be "%Y-%m-%d %H:%M".

After filling in, it looks like the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/22.png)

Click the [OK] button to start importing data from the CSV file to the database. During the import process, the interface will be semi-frozen. The larger the CSV file (the more data), the longer the freeze time will be. After successful loading, a window will pop up showing successful loading, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/20.png)

## View Data

Currently, there are three ways to obtain data in VeighNa Trader:

- Download through data services or trading interfaces
- Import from CSV files
- Record using DataRecorder module

Regardless of which method is used to obtain data, click the [Refresh] button in the upper left corner to see the statistical situation of existing data in the current database (except Tick data). During the refresh process, the interface may occasionally freeze. Usually, the more data there is, the longer the freeze time will be. After successful refresh, it looks like the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/7.png)

Click the [View] button, and a dialog box will pop up to select the data interval to view, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/10.png)

After selecting the data range to display, click the [OK] button to see specific data fields at each time point in the right table:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/11.png)

Under the premise that the database already has data, clicking the small arrow before the data frequency in the [Data] column at the leftmost side of the table can expand or collapse the contract information display under that data frequency.

If the right area of the table is not fully displayed, you can drag the horizontal scroll bar at the bottom of the interface to adjust.

## Export Data

If you want to export data from the database to local CSV files, you can select the contract to export, click the [Export] button on the right side of the row where the contract is located, and a dialog box will pop up to select the data interval, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/8.png)

Select the data interval range to export, click [OK], and a dialog box will pop up again to select the output file location, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/9.png)

After selecting the directory where the export file should be placed and filling in the CSV file name, click the [Save] button to complete the CSV file export.

## Delete Data

If you want to delete specific contract data, you can select the contract to delete, click the [Delete] button on the right side of the contract row data, and a dialog box will pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/12.png)

Click the [OK] button to delete the contract data and pop up a successful deletion window, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/13.png)

At this time, click the [Refresh] button again, and the interface no longer shows information for that contract, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/14.png)

## Update Data

In cases where users **have configured data services** or **trading interfaces (connected) provide sufficient historical data**, clicking the [Update Data] button in the upper right corner can execute one-click automatic download and update based on all contract data displayed on the graphical interface.

The interface display before update is shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/17.png)

Click the [Update Data] button, and an update progress information prompt dialog box will pop up, as shown in the figure below:

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/19.png)

At this time, DataManager will automatically **download data from the end date of existing data in the database to the current latest date** and update it to the database.

If there is less data to update, the update task may be completed instantly. In this case, not observing the update dialog box is also normal.

After the update is complete, click the [Refresh] button in the upper left corner to see that the contract data has been updated to the current latest date.

![](https://vnpy-doc.oss-cn-shanghai.aliyuncs.com/data_manager/18.png)

## Data Range

Please note that although the interface displays the start and end times of existing data in the database, **it does not mean that the database stores all data from the start time to the end time**.

If relying on trading interfaces to provide historical data, if the time span between start time and end time exceeds the data range that the interface can provide, it may lead to data gaps. Therefore, it is recommended to click the [View] button after updating data to check whether the contract data is continuous.
