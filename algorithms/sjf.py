from .utils import calculate_metrics

def sjf(jobs):
    if not jobs:
        return {'gantt': [], 'average_waiting': 0, 'average_turnaround': 0}
        
    remaining = jobs[:]
    t = 0
    order = []
    
    while remaining:
        ready = [j for j in remaining if j.get('arrival', 0) <= t]
        if not ready:
            t = min(j.get('arrival', 0) for j in remaining)
            continue
            
        j = min(ready, key=lambda x: (x['burst'], x.get('arrival', 0), x['id']))
        order.append(j['id'])
        t += j['burst']
        remaining.remove(j)
        
    return calculate_metrics(order, jobs)
