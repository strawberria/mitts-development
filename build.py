import subprocess

print("Building Mitts-Development for distribution")
subprocess.check_call('wails build -debug -o "mitts-development_debug.exe"', stdout=subprocess.DEVNULL)
subprocess.check_call('wails build -o "mitts-development.exe"', stdout=subprocess.DEVNULL)
print("Build process finished!")