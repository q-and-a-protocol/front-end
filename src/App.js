import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useMatch,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';

import { Home } from './Home';
import { MyQuestions } from './MyQuestions';
import { MyAnswers } from './MyAnswers';
import { NotFoundScreen } from './NotFoundScreen';

import './App.css';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>,
  },
]);

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/myquestions' element={<MyQuestions />} />
      <Route path='/myanswers' element={<MyAnswers />} />
      {/* <Route path='/book/:bookId' element={<BookScreen user={user} />} /> */}
      <Route path='*' element={<NotFoundScreen />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <WagmiConfig client={client}>
        <h1>Question and Answer</h1>
        <AppRoutes />
      </WagmiConfig>
    </Router>
  );
}

export default App;
