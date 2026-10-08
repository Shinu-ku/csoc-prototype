#!/bin/bash
echo "=== Process Monitor ==="
echo "PID   USER    %CPU  %MEM  STATE  COMMAND"
ps -eo pid,user,%cpu,%mem,stat,comm --sort=-%cpu | head -n 20
