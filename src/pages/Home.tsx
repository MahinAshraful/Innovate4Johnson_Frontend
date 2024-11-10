import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome Home!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">You've successfully logged in.</p>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;