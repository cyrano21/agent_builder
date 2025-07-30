'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  Settings, 
  Search, 
  Mail, 
  UserPlus, 
  Crown,
  Shield,
  User,
  Eye,
  Calendar,
  Activity,
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import { TeamService, type Team, type CreateTeamData } from '@/lib/team-service';
import { teamService } from '@/lib/team-service';
import { TeamRole } from '@prisma/client';

interface TeamManagementProps {
  userId: string;
  userRole: string;
}

export function TeamManagement({ userId, userRole }: TeamManagementProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [newTeam, setNewTeam] = useState<CreateTeamData>({
    name: '',
    description: '',
    maxMembers: 10,
    isPublic: false
  });
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'MEMBER' as TeamRole
  });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const userTeams = await teamService.getUserTeams(userId);
      setTeams(userTeams);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) return;

    try {
      setActionLoading(true);
      const createdTeam = await teamService.createTeam(newTeam, userId);
      setTeams([createdTeam, ...teams]);
      setIsCreateDialogOpen(false);
      setNewTeam({
        name: '',
        description: '',
        maxMembers: 10,
        isPublic: false
      });
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Failed to create team');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!selectedTeam || !inviteData.email.trim()) return;

    try {
      setActionLoading(true);
      await teamService.inviteMember(selectedTeam.id, userId, inviteData);
      setIsInviteDialogOpen(false);
      setInviteData({ email: '', role: 'MEMBER' });
      
      // Reload team data
      const updatedTeam = await teamService.getTeamById(selectedTeam.id, userId);
      if (updatedTeam) {
        setSelectedTeam(updatedTeam);
        setTeams(teams.map(t => t.id === selectedTeam.id ? updatedTeam : t));
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
      alert(error instanceof Error ? error.message : 'Failed to invite member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: TeamRole) => {
    if (!selectedTeam) return;

    try {
      setActionLoading(true);
      await teamService.updateMemberRole(selectedTeam.id, memberId, newRole, userId);
      
      // Reload team data
      const updatedTeam = await teamService.getTeamById(selectedTeam.id, userId);
      if (updatedTeam) {
        setSelectedTeam(updatedTeam);
        setTeams(teams.map(t => t.id === selectedTeam.id ? updatedTeam : t));
      }
    } catch (error) {
      console.error('Failed to update member role:', error);
      alert(error instanceof Error ? error.message : 'Failed to update member role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedTeam) return;

    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      setActionLoading(true);
      await teamService.removeMember(selectedTeam.id, memberId, userId);
      
      // Reload team data
      const updatedTeam = await teamService.getTeamById(selectedTeam.id, userId);
      if (updatedTeam) {
        setSelectedTeam(updatedTeam);
        setTeams(teams.map(t => t.id === selectedTeam.id ? updatedTeam : t));
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      alert(error instanceof Error ? error.message : 'Failed to remove member');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleIcon = (role: TeamRole) => {
    switch (role) {
      case 'OWNER': return <Crown className="h-4 w-4" />;
      case 'ADMIN': return <Shield className="h-4 w-4" />;
      case 'MEMBER': return <User className="h-4 w-4" />;
      case 'VIEWER': return <Eye className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: TeamRole) => {
    switch (role) {
      case 'OWNER': return 'bg-yellow-100 text-yellow-800';
      case 'ADMIN': return 'bg-blue-100 text-blue-800';
      case 'MEMBER': return 'bg-green-100 text-green-800';
      case 'VIEWER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-gray-600">Manage your teams and collaborate with others</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a new team to collaborate on projects together
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter team description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="max-members">Max Members</Label>
                <Select 
                  value={newTeam.maxMembers?.toString()} 
                  onValueChange={(value) => setNewTeam(prev => ({ ...prev, maxMembers: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 members</SelectItem>
                    <SelectItem value="10">10 members</SelectItem>
                    <SelectItem value="25">25 members</SelectItem>
                    <SelectItem value="50">50 members</SelectItem>
                    <SelectItem value="100">100 members</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="public-team"
                  checked={newTeam.isPublic}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, isPublic: e.target.checked }))}
                />
                <Label htmlFor="public-team">Make team public</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam} disabled={actionLoading || !newTeam.name.trim()}>
                  {actionLoading ? 'Creating...' : 'Create Team'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="text-center py-8">Loading teams...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card 
              key={team.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTeam?.id === team.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedTeam(team)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  {team.isPublic && <Badge variant="secondary">Public</Badge>}
                </div>
                {team.description && (
                  <CardDescription>{team.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{team._count.members} members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>{team._count.projects} projects</span>
                  </div>
                </div>
                
                <div className="flex -space-x-2">
                  {team.members.slice(0, 5).map((member) => (
                    <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                      <AvatarImage src={member.user.avatar} />
                      <AvatarFallback>
                        {member.user.name?.charAt(0) || member.user.email.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {team.members.length > 5 && (
                    <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                      +{team.members.length - 5}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Badge className={getRoleColor(team.members.find(m => m.userId === userId)?.role || 'VIEWER')}>
                    {team.members.find(m => m.userId === userId)?.role || 'VIEWER'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTeams.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No teams found. Create your first team to get started!
        </div>
      )}

      {/* Team Details */}
      {selectedTeam && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>{selectedTeam.name}</span>
                  {selectedTeam.isPublic && <Badge variant="secondary">Public</Badge>}
                </CardTitle>
                {selectedTeam.description && (
                  <CardDescription>{selectedTeam.description}</CardDescription>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Member</DialogTitle>
                      <DialogDescription>
                        Invite a new member to join {selectedTeam.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="invite-email">Email Address</Label>
                        <Input
                          id="invite-email"
                          type="email"
                          value={inviteData.email}
                          onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="invite-role">Role</Label>
                        <Select 
                          value={inviteData.role} 
                          onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value as TeamRole }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VIEWER">Viewer</SelectItem>
                            <SelectItem value="MEMBER">Member</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleInviteMember} disabled={actionLoading || !inviteData.email.trim()}>
                          {actionLoading ? 'Inviting...' : 'Send Invite'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Team Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{selectedTeam._count.members}</div>
                <div className="text-sm text-gray-600">Members</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{selectedTeam._count.projects}</div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{selectedTeam.maxMembers}</div>
                <div className="text-sm text-gray-600">Max Members</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">
                  {selectedTeam.projects.filter(p => p.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>
              <div className="space-y-3">
                {selectedTeam.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.user.avatar} />
                        <AvatarFallback>
                          {member.user.name?.charAt(0) || member.user.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.user.name || member.user.email}</div>
                        <div className="text-sm text-gray-600">{member.user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(member.role)}>
                        {getRoleIcon(member.role)}
                        <span className="ml-1">{member.role}</span>
                      </Badge>
                      {selectedTeam.ownerId === userId && member.userId !== userId && (
                        <div className="flex items-center space-x-1">
                          <Select 
                            value={member.role} 
                            onValueChange={(value) => handleUpdateMemberRole(member.id, value as TeamRole)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="VIEWER">Viewer</SelectItem>
                              <SelectItem value="MEMBER">Member</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={actionLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Projects */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Team Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTeam.projects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-gray-600">{project.description}</div>
                        </div>
                        <Badge>{project.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {selectedTeam.projects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No projects yet. Create your first team project!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}