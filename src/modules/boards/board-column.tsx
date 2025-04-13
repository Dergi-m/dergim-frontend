'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

import type { BoardData } from '@/lib/schema/board';
import { Button } from '@/modules/ui/button';
import { TaskCard } from '@/modules/boards/task-card';

interface ColumnProps {
  id: string;
  title: string;
  tasks: BoardData[];
}

export function BoardColumn({ id, title, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'To Do':
        return 'bg-slate-100';
      case 'In Progress':
        return 'bg-blue-50';
      case 'In Review':
        return 'bg-purple-50';
      case 'Done':
        return 'bg-green-50';
      default:
        return 'bg-slate-100';
    }
  };

  const getTaskCount = (count: number) => {
    return count === 1 ? '1 issue' : `${count} issues`;
  };

  return (
    <div className={`flex h-full w-72 flex-shrink-0 flex-col rounded-lg ${getColumnColor(title)}`}>
      <div className="flex items-center justify-between p-3">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-muted-foreground text-xs">{getTaskCount(tasks.length)}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-2"
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
