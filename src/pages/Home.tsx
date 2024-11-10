import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';

interface Team {
  id: number;
  projectName: string;
  descriptionOfProject: string;
  figmaLink: string;
  github_link: string;
  user_emails: string;
  user_ids: string;
  user_names: string;
  innovation_challenge_id: number;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async (): Promise<void> => {
    try {
      const response = await fetch('http://127.0.0.1:5000/getAllTeams');
      const data: Team[] = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleTeamClick = (teamId: number): void => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Innovation Challenge Teams</CardTitle>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              Logout
            </Button>
          </CardHeader>
        </Card>

        {teams.map((team) => (
          <Card key={team.id} className="transition-all duration-200 hover:shadow-lg">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => handleTeamClick(team.id)}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
                <CardTitle className="text-lg">{team.projectName}</CardTitle>
              </div>
              {expandedTeam === team.id ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </CardHeader>

            {expandedTeam === team.id && (
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    {team.descriptionOfProject}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">Team Members:</h3>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {team.user_names.split(',').map((name, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-md bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            {name.split(' ')[0][0]}
                            {name.split(' ')[1][0]}
                          </div>
                          <span className="text-sm">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <a 
                      href={team.github_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      GitHub Repository
                    </a>
                    <a 
                      href={team.figmaLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Figma Design
                    </a>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;