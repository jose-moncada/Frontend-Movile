import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import TaskScreen from './src/screens/TaskScreen';
import UserDataScreen from './src/screens/UserDataScreen';

const AppContent = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const [screen, setScreen] = React.useState("tasks");

  if (isLoading) return null;

  if (!userToken) return <LoginScreen />;

  if (screen === "user") {
    return <UserDataScreen setScreen={setScreen} />;
  }

  if (screen === "tasks") {
    return <TaskScreen setScreen={setScreen} />;
  }

  return null;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}