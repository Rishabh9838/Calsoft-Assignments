import subprocess
import json


def execute_commands(commands):
   
    unique_commands = list(dict.fromkeys(commands))

    results = []

    for cmd in unique_commands:
        try:
            result = subprocess.run(
                cmd,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30
            )

            status = "success" if result.returncode == 0 else "Failed"

            output = result.stdout.strip()
            error = result.stderr.strip()

            # If command failed but stderr is empty
            if status == "Failed" and not error:
                error = f"Command '{cmd}' failed with return code {result.returncode}"

            results.append({
                cmd: {
                    "output": output,
                    "error": error,
                    "status": status
                }
            })

        except subprocess.TimeoutExpired:
            results.append({
                cmd: {
                    "output": "",
                    "error": f"Command '{cmd}' timed out after 30 seconds",
                    "status": "Failed"
                }
            })

        except Exception as e:
            results.append({
                cmd: {
                    "output": "",
                    "error": str(e),
                    "status": "Failed"
                }
            })

    return results


if __name__ == "__main__":
   
    commands = [
        "dir",
        "cd",
        "whoami",
        "hostname",
        "invalid_command",
        "echo Hello World"
    ]

    print("Executing Commands...\n")

    results = execute_commands(commands)

    print(json.dumps(results, indent=4))