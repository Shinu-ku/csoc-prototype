#!/bin/bash
echo "=== Security Check ==="

echo "[1] Checking for high CPU processes (>80%)"
ps -eo pid,user,%cpu,comm | awk '$3 > 80.0 { print "HIGH CPU:", $0 }'

echo ""
echo "[2] Checking for high memory usage"
MEM_FREE=$(free | awk '/Mem/{printf("%.2f"), $3/$2*100}')
if (( $(echo "$MEM_FREE > 85.0" | bc -l) )); then
    echo "WARNING: High memory usage: $MEM_FREE%"
else
    echo "Memory usage OK: $MEM_FREE%"
fi

echo ""
echo "[3] Checking disk space"
df -h / | awk 'NR==2 {print $5 " used on " $6}'
