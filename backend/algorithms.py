def metrics(order, jobs):
    by={j['id']:j for j in jobs}; t=0; rows=[]; total_wait=total_turn=0
    for jid in order:
        j=by[jid]; start=max(t,j.get('arrival',0)); finish=start+j['burst']; turn=finish-j.get('arrival',0); wait=turn-j['burst'];
        rows.append({'id':jid,'start':start,'finish':finish,'waiting':wait,'turnaround':turn}); total_wait+=wait; total_turn+=turn; t=finish
    return {'gantt':rows,'average_waiting':round(total_wait/len(jobs),2),'average_turnaround':round(total_turn/len(jobs),2)}

def fcfs(jobs): return metrics([j['id'] for j in sorted(jobs,key=lambda x:(x.get('arrival',0),x['id']))],jobs)
def sjf(jobs):
    remaining=jobs[:]; t=0; order=[]
    while remaining:
        ready=[j for j in remaining if j.get('arrival',0)<=t]
        if not ready: t=min(j.get('arrival',0) for j in remaining); continue
        j=min(ready,key=lambda x:(x['burst'],x.get('arrival',0),x['id'])); order.append(j['id']); t+=j['burst']; remaining.remove(j)
    return metrics(order,jobs)
def srtf(jobs):
    # event-based preemption, returns execution slices
    left={j['id']:j['burst'] for j in jobs}; t=0; order=[]; completed=set()
    while len(completed)<len(jobs):
        ready=[j for j in jobs if j.get('arrival',0)<=t and left[j['id']]>0]
        if not ready: t=min(j.get('arrival',0) for j in jobs if left[j['id']]>0); continue
        j=min(ready,key=lambda x:(left[x['id']],x.get('arrival',0),x['id'])); order.append(j['id']); left[j['id']]-=1; t+=1
        if left[j['id']]==0: completed.add(j['id'])
    # collapse consecutive slices for display
    collapsed=[]
    for x in order:
        if collapsed and collapsed[-1]==x: continue
        collapsed.append(x)
    return metrics(collapsed,jobs)
def priority(jobs, preemptive=False):
    if not preemptive:
        remaining=jobs[:]; t=0; order=[]
        while remaining:
            ready=[j for j in remaining if j.get('arrival',0)<=t]
            if not ready: t=min(j.get('arrival',0) for j in remaining); continue
            j=min(ready,key=lambda x:(x.get('priority',999),x.get('arrival',0),x['id'])); order.append(j['id']); t+=j['burst']; remaining.remove(j)
        return metrics(order,jobs)
    return srtf([{**j,'burst':j['burst'],'priority':j.get('priority',999)} for j in jobs])
