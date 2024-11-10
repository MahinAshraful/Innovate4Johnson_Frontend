import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown, ChevronUp, Github, Linkedin, GraduationCap } from 'lucide-react';

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

interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gradDate: string;
  location: string;
  linkedIn: string;
  github: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, User>>({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/getAllTeams');
      const data: Team[] = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    if (userDetails[userId]) return;
    
    setLoadingUsers(prev => ({ ...prev, [userId]: true }));
    try {
      const response = await fetch(`http://localhost:5000/getAllUsers/${userId}`);
      const data: User = await response.json();
      setUserDetails(prev => ({ ...prev, [userId]: data }));
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoadingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleUserExpanded = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
      if (!userDetails[userId]) {
        fetchUserDetails(userId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-red-500">HackHire</div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-900">HOME</a>
              <a href="#" className="text-gray-900">CANDIDATES</a>
              <a href="#" className="text-gray-900 border-b-2 border-black">INNOVATION CHALLENGE</a>
              <a href="#" onClick={handleLogout} className="text-gray-900">SIGNOUT</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex gap-8 px-4 py-8 mx-auto max-w-7xl">
        <div className="w-1/4">
          <div className="p-8 rounded-2xl bg-[#FFF1F1]">
            <h2 className="mb-8 text-3xl font-bold">Schedule</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 mt-2 transform rotate-45 bg-[#EF4444]" />
                <div>
                  <div className="text-lg font-semibold">Hackathon Intro + Kick-Off</div>
                  <div className="text-lg">5:00PM</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 mt-2 transform rotate-45 bg-[#EF4444]" />
                <div>
                  <div className="text-lg font-semibold">Dinner</div>
                  <div className="text-lg">6:00PM</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 mt-2 transform rotate-45 bg-[#EF4444]" />
                <div>
                  <div className="text-lg font-semibold">Fast-Start Workshop</div>
                  <div className="text-lg">7:15PM</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 mt-2 transform rotate-45 bg-[#EF4444]" />
                <div>
                  <div className="text-lg font-semibold">Day Concludes</div>
                  <div className="text-lg">9:15PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2">
          {selectedTeam && (
            <div className="p-8 bg-[#EF4444] rounded-3xl">
              <div className="p-8 bg-white rounded-3xl">
                <h2 className="mb-8 text-3xl font-bold">Team members</h2>
                <div className="grid gap-4 mb-8">
                  {selectedTeam.user_names.split(',').map((name, index) => {
                    const userId = selectedTeam.user_ids.split(';')[index];
                    const user = userDetails[userId];
                    const isExpanded = expandedUser === userId;
                    const initials = name.split(' ').map(n => n[0]).join('');

                    return (
                      <div key={userId} className="relative">
                        <div 
                          className="flex items-center gap-4 p-4 transition-colors cursor-pointer hover:bg-gray-50 rounded-xl"
                          onClick={() => toggleUserExpanded(userId)}
                        >
                          <div className="flex items-center justify-center w-14 h-14 text-xl text-white bg-[#EF4444] rounded-full">
                            {initials}
                          </div>
                          <span className="flex-1 text-xl">{name.trim()}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        
                        {isExpanded && user && (
                          <div className="p-6 mt-2 bg-gray-50 rounded-xl">
                            <div className="flex flex-col items-center">
                              <div className="mb-4">
                                <GraduationCap className="w-8 h-8 mb-2 text-[#3B82F6]" />
                                <span className="text-gray-600">Class of {user.gradDate}</span>
                              </div>
                              <div className="flex gap-8">
                                <a
                                  href={user.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-[#3B82F6]"
                                >
                                  <Github className="w-5 h-5" />
                                  <span>GitHub</span>
                                </a>
                                <a
                                  href={user.linkedIn}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-[#3B82F6]"
                                >
                                  <Linkedin className="w-5 h-5" />
                                  <span>LinkedIn</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <h3 className="mb-6 text-3xl font-bold">Project</h3>
                <div className="flex gap-8">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <p className="mb-4 text-gray-800">{selectedTeam.descriptionOfProject}</p>
                    <div className="inline-block px-4 py-2 border border-[#EF4444] rounded-lg">
                      <div className="text-sm text-gray-600">Track:</div>
                      <div className="font-semibold text-gray-900">Improve Hiring</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-1/4">
          <div className="p-6 bg-[#EF4444] rounded-2xl">
            <h2 className="mb-6 text-2xl font-semibold text-white">Teams</h2>
            <div className="space-y-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-4 rounded-xl cursor-pointer transition-colors ${
                    selectedTeam?.id === team.id ? 'bg-[rgba(255,255,255,0.2)]' : ''
                  } hover:bg-[rgba(255,255,255,0.1)]`}
                  onClick={() => setSelectedTeam(team)}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-white" />
                    <span className="text-lg text-white">{team.projectName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;