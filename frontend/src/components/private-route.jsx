import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { isAuthenticated } from '../api/auth';

const PrivateRoute = ({ component: Component }) => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/auth');
    }
  }, []);

  return isAuthenticated() ? <Component /> : null;
};

export default PrivateRoute;
