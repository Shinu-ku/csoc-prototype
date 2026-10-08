#!/bin/bash
echo "=== System Monitor ==="
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime -p)"
echo ""

echo "=== CPU Info ==="
top -bn1 | grep "Cpu(s)"
echo ""

echo "=== Memory Info ==="
free -m
echo ""

echo "=== Disk Info ==="
df -h /
echo ""

echo "=== Top Processes ==="
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu | head -n 10
