'use client';

import React from 'react';
import { useEventStore } from '@/hooks/useEventStore';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ClipboardList, Award, UserCheck, CheckCircle2, Play, CircleDot } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { TaskStatus } from '@aegis/types';

export function VolunteerDashboard() {
  const { tasks, updateTaskStatus } = useEventStore();
  const { addToast } = useToast();

  const handleUpdateStatus = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status);
    addToast({
      type: 'success',
      title: 'Task Status Updated',
      description: `Task has been marked as ${status}.`,
    });
  };

  const getPriorityStyle = (priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') => {
    switch (priority) {
      case 'URGENT':
        return 'bg-danger/10 text-danger border-danger/10';
      case 'HIGH':
        return 'bg-warning/10 text-warning border-warning/10';
      case 'MEDIUM':
        return 'bg-primary/10 text-primary border-primary/10';
      default:
        return 'bg-foreground/5 text-muted border-card-border/40';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="My Active Tasks"
          value={tasks.filter((t) => t.status !== 'Completed' && t.status !== 'Cancelled').length}
          icon={<ClipboardList className="w-5 h-5 text-primary" />}
          trend={{ value: 'Active list', direction: 'neutral' }}
          aiSummary="Report to accessibility ramp Sect. B immediately."
        />

        <StatCard
          title="Tasks Completed"
          value={tasks.filter((t) => t.status === 'Completed').length}
          icon={<Award className="w-5 h-5 text-success" />}
          trend={{ value: 'Perfect Rating', direction: 'neutral' }}
          aiSummary="Halftime bags distributed successfully."
        />

        <StatCard
          title="Availability Status"
          value="ON DUTY"
          icon={<UserCheck className="w-5 h-5 text-accent" />}
          trend={{ value: 'Assigned Gate A', direction: 'neutral' }}
          aiSummary="Check in at Main Supervisor tent on checkout."
        />
      </div>

      {/* Volunteer Jobs List */}
      <Card animate={true}>
        <CardHeader>
          <CardTitle>My Volunteer Console Tasks</CardTitle>
          <CardDescription>Assigned operational tasks requiring action.</CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-4">
          {tasks.length === 0 ? (
            <p className="text-xs text-muted text-center py-6 select-none">All clear! No tasks assigned currently.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col md:flex-row justify-between md:items-center bg-foreground/[0.01] border border-card-border/40 p-4 rounded-xl gap-4 hover:bg-foreground/[0.02] transition-colors"
                >
                  <div className="flex flex-col gap-1.5 max-w-lg">
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className="text-xs font-bold text-foreground">{task.title}</span>
                      <span className={`px-2 py-0.5 border text-[9px] font-extrabold rounded-md uppercase tracking-wider ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed font-semibold">
                      {task.description}
                    </p>
                    <span className="text-[10px] text-primary/70 font-semibold uppercase">
                      Location: {task.location}
                    </span>
                  </div>

                  <div className="flex gap-2 shrink-0 items-center justify-end">
                    {task.status === 'Assigned' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(task.id, 'Accepted')}
                        leftIcon={<CircleDot className="w-3.5 h-3.5" />}
                        className="py-1 h-8 text-xs bg-primary"
                      >
                        Accept
                      </Button>
                    )}
                    {task.status === 'Accepted' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUpdateStatus(task.id, 'InProgress')}
                        leftIcon={<Play className="w-3.5 h-3.5" />}
                        className="py-1 h-8 text-xs bg-secondary"
                      >
                        Start Task
                      </Button>
                    )}
                    {task.status === 'InProgress' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleUpdateStatus(task.id, 'Completed')}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        className="py-1 h-8 text-xs bg-success"
                      >
                        Complete Task
                      </Button>
                    )}
                    {task.status === 'Completed' && (
                      <span className="text-xs font-bold text-success pr-2 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
