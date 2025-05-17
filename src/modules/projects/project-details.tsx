'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, Mail, Save, UserPlus, Users, X, XCircle } from 'lucide-react';

import { formatLocalizedTimestamp } from '@/lib/fotmatters';
import type { Project } from '@/lib/schema/project';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/contexts/session-context';
import { trpc } from '@/server/api/react';
import { Avatar, AvatarFallback } from '@/modules/ui/avatar';
import { Badge } from '@/modules/ui/badge';
import { Button } from '@/modules/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/modules/ui/card';
import { Input } from '@/modules/ui/input';
import { Label } from '@/modules/ui/label';
import { SpinAnim } from '@/modules/ui/spin-anim';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/modules/ui/tabs';
import { Textarea } from '@/modules/ui/textarea';

type ProjectDetailsProps = {
  project: Project;
};

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  const [editedDescription, setEditedDescription] = useState(project.description);
  const [members, setMembers] = useState(project.members || []);
  const [inviteUserName, setInviteUserName] = useState('');
  const { sessionUser } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const isCereator = sessionUser.id === project.creatorId;

  const inviteMutation = trpc.page.projects.inviteUser.useMutation();
  const removeMemberMutation = trpc.page.projects.removeMember.useMutation();
  const updateProjectMutation = trpc.page.projects.updateProject.useMutation();

  const updatedAt = formatLocalizedTimestamp(project.updatedAt);
  const createdAt = formatLocalizedTimestamp(project.createdAt);

  const handleSaveChanges = async () => {
    try {
      const res = await updateProjectMutation.mutateAsync({
        id: project.id,
        name: editedName,
        description: editedDescription,
      });
      if (res.success) {
        router.refresh();
        setIsEditing(false);
      } else {
        toast({
          title: 'Update failed',
          description: 'Someting went wrong while updating the project details.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update project details.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedName(project.name);
    setEditedDescription(project.description);
    setIsEditing(false);
  };
  async function handleInviteUser() {
    try {
      if (!inviteUserName.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter a valid username.',
          variant: 'destructive',
        });
        return;
      }

      const invitation = await inviteMutation.mutateAsync({
        projectId: project.id,
        targetUserName: inviteUserName,
        message: `You have been invited to join the project ${project.name}`,
      });

      if (!invitation.success && invitation.status === 200) {
        setInviteUserName('');
        toast({
          title: 'Invitation sent',
          description: `Invitation has been sent to ${inviteUserName}.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Invitation failed',
          description: invitation.message,
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send invitation.',
        variant: 'destructive',
      });
    }
  }

  async function handleRemoveMember(memberId: string) {
    const res = await removeMemberMutation.mutateAsync({
      projectId: project.id,
      userId: memberId,
    });

    setMembers((prev) => prev.filter((member) => member.id !== memberId));

    if (res.success) {
      toast({
        title: 'Member removed',
        description: 'The member has been removed from the project.',
      });
    } else {
      toast({
        title: 'Removal failed',
        description: 'Failed to remove',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="max-w-md"
                />
              </div>
            ) : (
              <CardTitle className="text-2xl">{project.name}</CardTitle>
            )}
            <CardDescription>
              Created on {createdAt}
              {project.createdAt !== project.updatedAt && ` • Updated on ${updatedAt}`}
            </CardDescription>
          </div>
          <div>
            {isEditing ? (
              <div className="flex space-x-2">
                <Button
                  disabled={updateProjectMutation.isPending}
                  onClick={handleSaveChanges}
                  size="sm"
                >
                  {updateProjectMutation.isPending ? (
                    <SpinAnim />
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  size="sm"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Project
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={4}
              />
            </div>
          ) : (
            <p className="text-muted-foreground">{project.description}</p>
          )}
        </CardContent>
      </Card>

      <Tabs
        defaultValue="members"
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            Members ({project.members?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="invite">
            <Mail className="mr-2 h-4 w-4" />
            Invite People
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="members"
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Project Members</CardTitle>
              <CardDescription>People with access to this project</CardDescription>
            </CardHeader>
            <CardContent>
              {members && members.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {member.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                            {member.id === project.creatorId && (
                              <Badge
                                variant="outline"
                                className="ml-2"
                              >
                                Creator
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>@{member.userName}</TableCell>
                        <TableCell className="text-right">
                          {isCereator && member.id !== project.creatorId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                              disabled={removeMemberMutation.isPending}
                              className="text-destructive hover:text-destructive"
                            >
                              {removeMemberMutation.isPending ? (
                                <SpinAnim />
                              ) : (
                                <>
                                  <XCircle className="mr-1 h-4 w-4" />
                                  Remove
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No members found in this project.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="invite"
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Invite New Members</CardTitle>
              <CardDescription>Send invitations to collaborate on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex space-x-2">
                <Input
                  placeholder="Enter username"
                  value={inviteUserName}
                  onChange={(e) => setInviteUserName(e.target.value)}
                  className="max-w-md"
                />
                <Button
                  disabled={inviteMutation.isPending}
                  onClick={handleInviteUser}
                >
                  {inviteMutation.isPending ? (
                    <SpinAnim />
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> Invite
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
