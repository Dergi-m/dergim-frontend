'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowUp, Bug, CheckCircle2, Clock, MessageSquare, Paperclip } from 'lucide-react';

import type { BoardData } from '@/lib/schema/board';
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar';
import { Badge } from '@/modules/ui/badge';
import { Card, CardContent } from '@/modules/ui/card';

interface TaskCardProps {
  task: BoardData;
}

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return <Bug className="h-4 w-4 text-red-500" />;
      case 'task':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'feature':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'highest':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'high':
        return <ArrowUp className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <ArrowUp className="h-4 w-4 rotate-90 text-yellow-500" />;
      case 'low':
        return <ArrowUp className="h-4 w-4 rotate-180 text-green-500" />;
      default:
        return null;
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const getUserColor = (userId: string) => {
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
    const index = Number.parseInt(userId.replace('user-', '')) % colors.length;
    return colors[index];
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab border shadow-sm hover:shadow-md"
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {getTypeIcon(task.type)}
              <span className="text-muted-foreground text-xs">{task.key}</span>
            </div>
            {getPriorityIcon(task.priority)}
          </div>
          <h4 className="text-sm font-medium">{task.title}</h4>
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <Badge
                key={label}
                variant="outline"
                className="text-xs"
              >
                {label}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={`/placeholder.svg?height=24&width=24`}
                  alt={task.assignee}
                />
                <AvatarFallback className={getUserColor(task.assigneeId)}>
                  {getUserInitials(task.assignee)}
                </AvatarFallback>
              </Avatar>
              {task.dueDate && (
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{task.dueDate}</span>
                </div>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              {task.attachments > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="h-3 w-3" />
                  <span>{task.attachments}</span>
                </div>
              )}
              {task.comments > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{task.comments}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
