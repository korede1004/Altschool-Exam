import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useParams,
} from "react-router-dom";
import ErrorBoundary from "./components/Navbar/Errorboundary";
import PageNotFound from "./pages/404page";

function RepoList() {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);

  const fetchRepos = async () => {
    const response = await fetch(
      `https://api.github.com/users/korede1004/repos?page=${page}&per_page=100`
    );
    const data = await response.json();
    setRepos((prevRepos) => [...prevRepos, ...data]);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <div>
      <h1>Korede GitHub Repositories</h1>
      {repos.map((repo) => (
        <p key={repo.id}>
          <Link to={`/repo/${repo.name}`}>{repo.name}</Link>
        </p>
      ))}
      <button onClick={fetchRepos}>Load more</button>
    </div>
  );
}

function Repo() {
  const { repoName } = useParams();
  const [repo, setRepo] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/korede1004/${repoName}`)
      .then((response) => response.json())
      .then((data) => setRepo(data))
      .catch((error) => console.error("Error:", error));
  }, [repoName]);

  if (!repo) return <div>Loading...</div>;

  return (
    <ErrorBoundary fallback="Error">
      <div>
        <h1>{repo.name}</h1>
        <p>{repo.description}</p>
        <a href={repo.html_url}>View on GitHub</a>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/repo/:repoName" element={<Repo />}></Route>
        <Route path="/" element={<RepoList />}></Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;