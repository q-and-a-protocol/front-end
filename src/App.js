import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useMatch,
} from 'react-router-dom';
import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';

import { Header } from './Header';
import { Home } from './Home';
import { MyQuestions } from './MyQuestions';
import { MyAnswers } from './MyAnswers';
import { NotFoundScreen } from './NotFoundScreen';

import './App.css';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

function NavLink(props) {
  const match = useMatch(props.to);
  // TODO: IF match give different colour to the below element!
  return <RouterLink {...props} />;
}

function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/myquestions'>My Questions</NavLink>
        </li>
        <li>
          <NavLink to='/myanswers'>My Answers</NavLink>
        </li>
      </ul>
    </nav>
  );
}

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
        <Header />
        <Nav />
        <AppRoutes />
      </WagmiConfig>
    </Router>
  );
}

export default App;
