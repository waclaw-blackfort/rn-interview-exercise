import { StatusBar } from 'expo-status-bar';

import { HomeScreen } from './src/home/HomeScreen';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <HomeScreen />
    </>
  );
}
