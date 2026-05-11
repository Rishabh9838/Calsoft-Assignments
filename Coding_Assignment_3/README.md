# Coding Assignment 3

This folder contains three coding assignments with working solutions and instructions to run each one.

## Q1 - Log File Parsing (Java)

### Files
- `LogParser.java`
- `LogParser.class`
- `Log_19_10_17_11_42_01 (1).log`
- `output.txt`
- `question.txt`

### Description
Parses a log file and prints the most recent log lines matching given log types. The default behavior is:
- `numLines`: 10
- `types`: `error`

### How to compile and run
Open PowerShell in this folder and run:

```powershell
javac LogParser.java
java LogParser "Log_19_10_17_11_42_01 (1).log"
```

To run with custom parameters:

```powershell
java LogParser "Log_19_10_17_11_42_01 (1).log" 5 "info,debug"
```

To save output to a file:

```powershell
java LogParser "Log_19_10_17_11_42_01 (1).log" | Out-File -Encoding UTF8 output.txt
```

## Q2 - Filter Inventory Data (C++)

### Files
- `InventoryFilter.cpp`
- `InventoryFilter.exe`
- `inventory.json`
- `json.hpp`
- `output_memory.txt`
- `question.txt`

### Description
Filters inventory JSON data based on one of the following criteria:
- `memory` → host with maximum memory
- `cpu` → host with maximum CPU
- `linux` → all Linux hosts
- `windows` → all Windows hosts

### How to compile and run
Open PowerShell in this folder and run:

```powershell
g++ InventoryFilter.cpp -o InventoryFilter.exe
.\InventoryFilter.exe inventory.json memory
```

Example commands:

```powershell
g++ InventoryFilter.cpp -o InventoryFilter.exe
.\InventoryFilter.exe inventory.json cpu
.\InventoryFilter.exe inventory.json linux
.\InventoryFilter.exe inventory.json windows
```

To save output for screenshot:

```powershell
.\InventoryFilter.exe inventory.json memory | Out-File -Encoding UTF8 output_memory.txt
```

## Q3 - Get Hardware Info (Python)

### Files
- `host_info.py`
- `main.py`
- `hardware_info.json`
- `question.txt`

### Description
Detects the current OS and retrieves hardware information using OS-level commands.
- Uses `hostname`, `ipconfig` / `hostname -I`, `systeminfo` / `lshw`, and disk query commands.
- Outputs `hostname`, `memory`, `cpu`, `ip`, and `disk_size` in JSON format.

### How to run
Open PowerShell in this folder and run:

```powershell
python main.py
```

To save the JSON output to a file:

```powershell
python main.py | Out-File -Encoding UTF8 hardware_info.json
```

### Notes
- On Windows, the code uses `systeminfo`, `ipconfig`, and PowerShell/WMIC fallbacks for CPU and disk size.
- On Linux, it prefers `lshw` and falls back to `/proc/meminfo` and `df -h` if needed.

---

## General Notes
- Each question folder includes the `question.txt` file containing the assignment description.
- Output files shown in the folders are examples of captured program results.
- For Windows PowerShell, use `Out-File -Encoding UTF8` to save output cleanly.

## Screenshots
- Screenshots are available in the repository root under `screenshot-Output/`.
- Example screenshot files:
  - `Screenshot 2026-05-04 223905.png`
  - `Screenshot 2026-05-04 224009.png`
  - `Screenshot 2026-05-04 224237.png`
  - `Screenshot 2026-05-04 224417.png`
  - `Screenshot 2026-05-04 224818.png`
  - `Screenshot 2026-05-04 224938.png`

### Screenshot preview
![Sample output](../screenshot-Output/Screenshot%202026-05-04%20223905.png)
