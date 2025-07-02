
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="header-gradient text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Attendance Manager</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <a href="/dashboard" className="hover:text-green-200 transition-colors">
                  Dashboard
                </a>
                {user.role === 'admin' && (
                  <>
                    <a href="/students" className="hover:text-green-200 transition-colors">
                      Students
                    </a>
                    <a href="/absences" className="hover:text-green-200 transition-colors">
                      Absences
                    </a>
                  </>
                )}
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 bg-green-800">
                    <AvatarFallback>{user.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-green-800 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-green-800 transition-colors"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-green-700">
            {user ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  <Avatar className="h-8 w-8 bg-green-800">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </div>
                <a
                  href="/dashboard"
                  className="block py-2 hover:bg-green-700 px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </a>
                {user.role === 'admin' && (
                  <>
                    <a
                      href="/students"
                      className="block py-2 hover:bg-green-700 px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Students
                    </a>
                    <a
                      href="/absences"
                      className="block py-2 hover:bg-green-700 px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Absences
                    </a>
                  </>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 py-2 hover:bg-green-700 px-2 rounded w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <a
                  href="/"
                  className="block py-2 hover:bg-green-700 px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="block py-2 hover:bg-green-700 px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
