#!/bin/bash
# CSOC Review 1 - basic Linux system monitoring
echo "===== CSOC SYSTEM MONITOR ====="
echo "Timestamp: $(date)"
echo "Hostname: $(hostname)"
echo
echo "--- Uptime ---"
uptime
echo
echo "--- Memory ---"
free -h
echo
echo "--- Disk ---"
df -h /
echo
echo "--- Top Processes ---"
ps -eo pid,comm,%cpu,%mem,state --sort=-%cpu | head -n 8
echo
echo "===== MONITORING COMPLETE ====="
