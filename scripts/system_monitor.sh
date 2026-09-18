#!/usr/bin/env bash
set -e
printf '\n===== CSOC SYSTEM MONITOR =====\n'
printf 'Hostname      : '; hostname
printf 'Uptime        : '; uptime -p
printf 'CPU Load      : '; awk '{print $1}' /proc/loadavg
printf 'Memory        : '; free -h | awk '/Mem:/ {print $3 " used / " $2}'
printf 'Disk (/)      : '; df -h / | awk 'NR==2 {print $3 " used / " $2 " (" $5 ")"}'
printf 'Processes     : '; ps -e --no-headers | wc -l
printf '\nTop CPU processes:\n'
ps -eo pid,comm,%cpu,%mem,state --sort=-%cpu | head -n 8
