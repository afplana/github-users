import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user } = useAuth0()
  console.log(isAuthenticated)
  console.log(user)
  // console.log(children)
  const isUser = isAuthenticated && user
  return isUser ? children : <Navigate replace to="/login" />;
};

export default PrivateRoute;
