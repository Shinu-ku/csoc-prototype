from .utils import calculate_preemptive_metrics

def srtf(jobs):
    if not jobs:
        return {'gantt': [], 'average_waiting': 0, 'average_turnaround': 0}
        
    left = {j['id']: j['burst'] for j in jobs}
    t = 0
    slices = [] # (job_id, start, end)
    completed = set()
    current_job = None
    slice_start = 0
    
    while len(completed) < len(jobs):
        ready = [j for j in jobs if j.get('arrival', 0) <= t and left[j['id']] > 0]
        
        if not ready:
            if current_job is not None:
                slices.append((current_job, slice_start, t))
                current_job = None
            t = min(j.get('arrival', 0) for j in jobs if left[j['id']] > 0)
            continue
            
        j = min(ready, key=lambda x: (left[x['id']], x.get('arrival', 0), x['id']))
        
        if current_job != j['id']:
            if current_job is not None:
                slices.append((current_job, slice_start, t))
            current_job = j['id']
            slice_start = t
            
        left[j['id']] -= 1
        t += 1
        
        if left[j['id']] == 0:
            completed.add(j['id'])
            slices.append((current_job, slice_start, t))
            current_job = None
            
    # merge adjacent slices
    merged = []
    for s in slices:
        if merged and merged[-1][0] == s[0] and merged[-1][2] == s[1]:
            merged[-1] = (merged[-1][0], merged[-1][1], s[2])
        else:
            merged.append(s)
            
    return calculate_preemptive_metrics(merged, jobs)
