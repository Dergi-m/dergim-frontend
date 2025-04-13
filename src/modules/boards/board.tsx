'use client';

import { useId, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import type { BoardData } from '@/lib/schema/board';
import { BoardColumn } from '@/modules/boards/board-column';
import { TaskCard } from '@/modules/boards/task-card';

const mockTasks: BoardData[] = [
  {
    id: 'task-1',
    key: 'PA-101',
    title: 'Fix login page authentication bug',
    type: 'bug',
    status: 'In Progress',
    priority: 'highest',
    assignee: 'Sarah Johnson',
    assigneeId: 'user-1',
    labels: ['frontend', 'security'],
    dueDate: 'Apr 15',
    attachments: 2,
    comments: 5,
  },
  {
    id: 'task-2',
    key: 'PA-102',
    title: 'Implement user profile settings page',
    type: 'feature',
    status: 'To Do',
    priority: 'high',
    assignee: 'Michael Chen',
    assigneeId: 'user-2',
    labels: ['frontend', 'UX'],
    dueDate: 'Apr 20',
    attachments: 1,
    comments: 3,
  },
  {
    id: 'task-3',
    key: 'PA-103',
    title: 'Optimize database queries for dashboard',
    type: 'task',
    status: 'In Review',
    priority: 'medium',
    assignee: 'Emily Rodriguez',
    assigneeId: 'user-3',
    labels: ['backend', 'performance'],
    dueDate: 'Apr 18',
    attachments: 0,
    comments: 7,
  },
  {
    id: 'task-4',
    key: 'PA-104',
    title: 'Add export to CSV functionality',
    type: 'feature',
    status: 'To Do',
    priority: 'medium',
    assignee: 'David Kim',
    assigneeId: 'user-4',
    labels: ['backend', 'data'],
    dueDate: undefined,
    attachments: 0,
    comments: 2,
  },
  {
    id: 'task-5',
    key: 'PA-105',
    title: 'Fix responsive layout on mobile devices',
    type: 'bug',
    status: 'In Progress',
    priority: 'high',
    assignee: 'Sarah Johnson',
    assigneeId: 'user-1',
    labels: ['frontend', 'mobile'],
    dueDate: 'Apr 14',
    attachments: 3,
    comments: 4,
  },
  {
    id: 'task-6',
    key: 'PA-106',
    title: 'Implement email notification system',
    type: 'feature',
    status: 'To Do',
    priority: 'low',
    assignee: 'Lisa Patel',
    assigneeId: 'user-5',
    labels: ['backend', 'notifications'],
    dueDate: 'Apr 25',
    attachments: 1,
    comments: 0,
  },
  {
    id: 'task-7',
    key: 'PA-107',
    title: 'Update API documentation',
    type: 'task',
    status: 'Done',
    priority: 'low',
    assignee: 'Michael Chen',
    assigneeId: 'user-2',
    labels: ['documentation'],
    dueDate: undefined,
    attachments: 2,
    comments: 1,
  },
  {
    id: 'task-8',
    key: 'PA-108',
    title: 'Fix payment processing error',
    type: 'bug',
    status: 'In Review',
    priority: 'highest',
    assignee: 'David Kim',
    assigneeId: 'user-4',
    labels: ['backend', 'payments'],
    dueDate: 'Apr 13',
    attachments: 0,
    comments: 8,
  },
  {
    id: 'task-9',
    key: 'PA-109',
    title: 'Add dark mode theme support',
    type: 'feature',
    status: 'In Progress',
    priority: 'medium',
    assignee: 'Emily Rodriguez',
    assigneeId: 'user-3',
    labels: ['frontend', 'UX'],
    dueDate: 'Apr 22',
    attachments: 1,
    comments: 3,
  },
  {
    id: 'task-10',
    key: 'PA-110',
    title: 'Implement user role permissions',
    type: 'feature',
    status: 'To Do',
    priority: 'high',
    assignee: 'Lisa Patel',
    assigneeId: 'user-5',
    labels: ['backend', 'security'],
    dueDate: 'Apr 28',
    attachments: 0,
    comments: 2,
  },
  {
    id: 'task-11',
    key: 'PA-111',
    title: 'Fix broken links in documentation',
    type: 'bug',
    status: 'Done',
    priority: 'low',
    assignee: 'Michael Chen',
    assigneeId: 'user-2',
    labels: ['documentation'],
    dueDate: undefined,
    attachments: 0,
    comments: 1,
  },
  {
    id: 'task-12',
    key: 'PA-112',
    title: 'Optimize image loading performance',
    type: 'task',
    status: 'In Progress',
    priority: 'medium',
    assignee: 'Sarah Johnson',
    assigneeId: 'user-1',
    labels: ['frontend', 'performance'],
    dueDate: 'Apr 17',
    attachments: 4,
    comments: 2,
  },
  {
    id: 'task-13',
    key: 'PA-113',
    title: 'Add multi-factor authentication',
    type: 'feature',
    status: 'To Do',
    priority: 'high',
    assignee: 'David Kim',
    assigneeId: 'user-4',
    labels: ['backend', 'security'],
    dueDate: 'Apr 30',
    attachments: 1,
    comments: 0,
  },
  {
    id: 'task-14',
    key: 'PA-114',
    title: 'Fix search functionality',
    type: 'bug',
    status: 'In Review',
    priority: 'high',
    assignee: 'Emily Rodriguez',
    assigneeId: 'user-3',
    labels: ['backend', 'search'],
    dueDate: 'Apr 16',
    attachments: 0,
    comments: 5,
  },
  {
    id: 'task-15',
    key: 'PA-115',
    title: 'Create onboarding tutorial',
    type: 'task',
    status: 'Done',
    priority: 'medium',
    assignee: 'Lisa Patel',
    assigneeId: 'user-5',
    labels: ['documentation', 'UX'],
    dueDate: undefined,
    attachments: 2,
    comments: 3,
  },
];

export default function Board() {
  const [tasks, setTasks] = useState<BoardData[]>(mockTasks);
  const [activeTask, setActiveTask] = useState<BoardData | null>(null);

  const id = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const statuses = ['To Do', 'In Progress', 'In Review', 'Done'];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active;
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((task) => task.id === activeId);
    const overTask = tasks.find((task) => task.id === overId);

    if (!activeTask || !overTask) return;

    // If the task is dragged over a column
    if (overId.toString().includes('column')) {
      const newStatus = overId.toString().replace('column-', '');

      setTasks(tasks.map((task) => (task.id === activeId ? { ...task, status: newStatus } : task)));
      return;
    }

    // If the task is dragged over another task
    if (activeTask.status !== overTask.status) {
      setTasks(
        tasks.map((task) => (task.id === activeId ? { ...task, status: overTask.status } : task))
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeIndex = tasks.findIndex((task) => task.id === activeId);
    const overIndex = tasks.findIndex((task) => task.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      setTasks(arrayMove(tasks, activeIndex, overIndex));
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      id={id}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <BoardColumn
            key={status}
            id={`column-${status}`}
            title={status}
            tasks={getTasksByStatus(status)}
          />
        ))}
      </div>
      <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
    </DndContext>
  );
}
