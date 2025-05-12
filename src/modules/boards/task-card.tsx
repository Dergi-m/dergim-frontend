import { Edit2Icon, MoreHorizontalIcon } from 'lucide-react';

import { Task } from '@/lib/schema/task';
import { Avatar, AvatarFallback } from '@/modules/ui/avatar';
import { Badge } from '@/modules/ui/badge';
import { Button } from '@/modules/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/modules/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/ui/dropdown-menu';

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) {
  return (
    <Card className="bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="line-clamp-2 text-sm font-medium">{task.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit2Icon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(task.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="mb-2 line-clamp-3 text-sm text-muted-foreground">{task.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        {task.assignedToUser ? (
          <div className="flex items-center">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {task.assignedToUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="ml-2 max-w-[100px] truncate text-xs">{task.assignedToUser.name}</span>
          </div>
        ) : (
          <Badge
            variant="outline"
            className="text-xs"
          >
            Unassigned
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
