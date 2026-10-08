from .utils import calculate_metrics

def fcfs(jobs):
    if not jobs:
        return {'gantt': [], 'average_waiting': 0, 'average_turnaround': 0}
        
    sorted_jobs = sorted(jobs, key=lambda x: (x.get('arrival', 0), x['id']))
    order = [j['id'] for j in sorted_jobs]
    return calculate_metrics(order, jobs)
