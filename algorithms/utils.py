def calculate_metrics(order, jobs):
    # order is a list of job IDs in execution order
    # jobs is a list of dictionaries with 'id', 'arrival', 'burst', etc.
    by_id = {j['id']: j for j in jobs}
    t = 0
    rows = []
    total_wait = 0
    total_turn = 0
    
    for jid in order:
        j = by_id[jid]
        start = max(t, j.get('arrival', 0))
        finish = start + j['burst']
        turn = finish - j.get('arrival', 0)
        wait = turn - j['burst']
        
        rows.append({
            'id': jid,
            'start': start,
            'finish': finish,
            'waiting': wait,
            'turnaround': turn
        })
        
        total_wait += wait
        total_turn += turn
        t = finish
        
    return {
        'gantt': rows,
        'average_waiting': round(total_wait / len(jobs), 2) if jobs else 0,
        'average_turnaround': round(total_turn / len(jobs), 2) if jobs else 0
    }

def calculate_preemptive_metrics(execution_slices, jobs):
    # execution_slices is a list of (job_id, start_time, end_time)
    by_id = {j['id']: j for j in jobs}
    completion_times = {}
    total_wait = 0
    total_turn = 0
    
    # Calculate completion times
    for jid, start, end in execution_slices:
        completion_times[jid] = max(completion_times.get(jid, 0), end)
        
    for j in jobs:
        turn = completion_times[j['id']] - j.get('arrival', 0)
        wait = turn - j['burst']
        total_wait += wait
        total_turn += turn
        
    gantt = [{'id': jid, 'start': start, 'finish': end} for jid, start, end in execution_slices]
    
    return {
        'gantt': gantt,
        'average_waiting': round(total_wait / len(jobs), 2) if jobs else 0,
        'average_turnaround': round(total_turn / len(jobs), 2) if jobs else 0
    }
