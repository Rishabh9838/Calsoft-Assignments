from host_info import WindowsHost, LinuxHost
import platform


def main():
    os_type = platform.system()
    if os_type == "Windows":
        host = WindowsHost()
    elif os_type == "Linux":
        host = LinuxHost()
    else:
        print("Unsupported OS")
        return

    try:
        host.get_hardware_info()
        host.display_hardware_info()
    except Exception as exc:
        print(f"Error fetching hardware info: {exc}")


if __name__ == "__main__":
    main()