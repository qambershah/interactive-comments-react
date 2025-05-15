import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useComments } from './hooks/useComments'
import { CommentForm } from './components/CommentForm'
import { CommentList } from './components/CommentList'

function App() {
  const { comments, addComment, loading, error } = useComments();


  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
    <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h1>💬 Interactive Comments</h1>

      <CommentForm onAdd={addComment} />

      {loading && <p>Loading comments...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <CommentList comments={comments} onReply={addComment} />
    </main>
  )
}

export default App
