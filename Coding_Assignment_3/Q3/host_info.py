import json
import re
import subprocess
from abc import ABC, abstractmethod

class HostInfo(ABC):
    def __init__(self):
        self.hostname = ""
        self.memory = ""
        self.cpu = ""
        self.ip = ""
        self.disk_size = ""

    def run_command(self, command):
        completed = subprocess.run(command, shell=True, capture_output=True, text=True)
        if completed.returncode != 0:
            raise RuntimeError(f"Command failed: {command}\n{completed.stderr.strip()}")
        return completed.stdout

    @abstractmethod
    def get_hardware_info(self):
        pass

    def display_hardware_info(self):
        info = {
            "hostname": self.hostname,
            "memory": self.memory,
            "cpu": self.cpu,
            "ip": self.ip,
            "disk_size": self.disk_size
        }
        print(json.dumps(info, indent=4))

class WindowsHost(HostInfo):
    def get_hardware_info(self):
        self.hostname = self.run_command("hostname").strip()
        self.ip = self._parse_windows_ip(self.run_command("ipconfig"))
        self.memory = self._parse_windows_memory(self.run_command("systeminfo"))
        self.cpu = self._parse_windows_cpu()
        self.disk_size = self._parse_windows_disk()

    def _parse_windows_ip(self, output):
        for line in output.splitlines():
            match = re.search(r"IPv4 Address[\. ]*:\s*([0-9]+(?:\.[0-9]+){3})", line)
            if match:
                ip = match.group(1)
                if not ip.startswith("127."):
                    return ip
        return "Unavailable"

    def _parse_windows_memory(self, output):
        for line in output.splitlines():
            if "Total Physical Memory" in line:
                value = line.split(":", 1)[1].strip()
                value = value.replace("MB", "").replace(",", "").strip()
                if value.isdigit():
                    return f"{int(value) // 1024} GB"
        return "Unavailable"

    def _parse_windows_cpu(self):
        try:
            output = self.run_command("wmic cpu get NumberOfCores /value")
            for line in output.splitlines():
                if line.strip().startswith("NumberOfCores="):
                    return f"{line.split('=', 1)[1].strip()} cores"
        except RuntimeError:
            pass

        try:
            output = self.run_command("powershell -NoProfile -Command \"(Get-CimInstance Win32_Processor).NumberOfCores\"")
            lines = [line.strip() for line in output.splitlines() if line.strip()]
            if lines and lines[0].isdigit():
                return f"{lines[0]} cores"
        except RuntimeError:
            pass

        return "Unavailable"

    def _parse_windows_disk(self):
        try:
            output = self.run_command("wmic logicaldisk where \"DeviceID='C:'\" get Size /value")
            for line in output.splitlines():
                if line.strip().startswith("Size="):
                    size = line.split('=', 1)[1].strip()
                    if size.isdigit():
                        return f"{int(size) // (1024 ** 3)} GB"
        except RuntimeError:
            pass

        try:
            output = self.run_command("powershell -NoProfile -Command \"(Get-CimInstance Win32_LogicalDisk | Where-Object DeviceID -eq 'C:').Size\"")
            lines = [line.strip() for line in output.splitlines() if line.strip()]
            if lines and lines[0].isdigit():
                return f"{int(lines[0]) // (1024 ** 3)} GB"
        except RuntimeError:
            pass

        return "Unavailable"

class LinuxHost(HostInfo):
    def get_hardware_info(self):
        self.hostname = self.run_command("hostname").strip()
        self.ip = self._parse_linux_ip(self.run_command("hostname -I || true"))
        self.memory = self._parse_linux_memory()
        self.cpu = self._parse_linux_cpu()
        self.disk_size = self._parse_linux_disk()

    def _parse_linux_ip(self, output):
        parts = output.strip().split()
        return parts[0] if parts else "Unavailable"

    def _parse_linux_memory(self):
        try:
            output = self.run_command("lshw -short -class memory")
            for line in output.splitlines():
                if "System memory" in line.lower():
                    parts = line.split()
                    if parts:
                        return parts[-1]
        except RuntimeError:
            pass

        output = self.run_command("grep MemTotal /proc/meminfo")
        match = re.search(r"MemTotal:\s+(\d+) kB", output)
        if match:
            return f"{int(match.group(1)) // 1024 // 1024} GB"
        return "Unavailable"

    def _parse_linux_cpu(self):
        try:
            output = self.run_command("lshw -short -class processor")
            for line in output.splitlines():
                if "processor" in line.lower() and "cpu" in line.lower():
                    parts = line.split()
                    if len(parts) > 3:
                        return " ".join(parts[3:])
        except RuntimeError:
            pass

        output = self.run_command("nproc").strip()
        return f"{output} cores" if output.isdigit() else "Unavailable"

    def _parse_linux_disk(self):
        try:
            output = self.run_command("lshw -short -class disk")
            for line in output.splitlines():
                if "disk" in line.lower() and line.strip().endswith("GB"):
                    parts = line.split()
                    if parts:
                        return parts[-1]
        except RuntimeError:
            pass

        output = self.run_command("df -h / | tail -1")
        parts = output.split()
        if len(parts) >= 2:
            return parts[1]
        return "Unavailable"