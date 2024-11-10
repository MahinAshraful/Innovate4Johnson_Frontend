import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/loginRecruiter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/home');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav Bar */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="text-red-600 text-xl font-bold">HackHire</div>
        <div className="space x-6"></div>
        <a href="/" className="text-black">HOME</a>
        <a href="/candidate" className="text-black">CANDIDATES</a>
        <a href="/innovation-challenge" className="text-black">INNOVATION CHALLENGE</a>
        <a href="/" className="text-black">LOGIN</a>
      </nav>

    {/* login component */}
    <div className="flex items-center justify-center px-4 rounded-lg">
      <div className="w-full h-fit bg-red-600 rounded-lg p-8 text-white rounded-xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          WELCOME TO HackHire
        </h1>

        <div className="space-y-6">

          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
            <div className="space-y-2 text-black w-2/3">
              <label className="block font-bold">Email</label>
              <Input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 bg-white text-black outline outline-1 rounded pl-2"
                required
                >
              </Input>
            </div>

            <div className="space-y-2 text-black w-2/3">
              <label className="block font-bold">Password</label>
              <Input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className="w-full h-10 bg-white text-black outline outline-1 rounded pl-2"
                required
                >
              </Input>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
            type="submit"
            className="w-500 bg-white text-red-600 hover:bg-gray-100 rounded"
            disabled={loading}
            >
              {loading ? 'Logging in...': 'Login'}
            </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;