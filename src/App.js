import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';

import { Header } from './Header';
import { Home } from './Home';
import { MyQuestions } from './MyQuestions';
import { MyAnswers } from './MyAnswers';
import { Profile } from './Profile';
import { MyProfile } from './MyProfile';
import { NotFoundScreen } from './NotFoundScreen';
import { Help } from './Help';
import { Utilities } from './Utilities';
import { Question } from './Question';

import './App.css';
import '@rainbow-me/rainbowkit/styles.css';

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/myquestions' element={<MyQuestions />} />
      <Route path='/myanswers' element={<MyAnswers />} />
      <Route path='/profile/:address' element={<Profile />} />
      <Route path='/myprofile' element={<MyProfile />} />
      <Route path='/help' element={<Help />} />
      <Route path='/utilities' element={<Utilities />} />
      <Route path='/question/:questioner/:answerer/:index' element={<Question />} />
      <Route path='/notfound' element={<NotFoundScreen />} />
      <Route path='*' element={<NotFoundScreen />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <AppRoutes />
    </Router>
  );
}

export default App;
