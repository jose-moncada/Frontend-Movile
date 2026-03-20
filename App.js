import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import TaskScreen from './src/screens/TaskScreen'

const AppContent = () => {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) return null;

  return userToken ? <TaskScreen/> : <LoginScreen/>;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}