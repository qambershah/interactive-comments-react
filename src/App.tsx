import reactLogo from './assets/react.svg'
import typescriptLogo from '/typescript.png'
import dotnetLogo from '/dotnet_logo.png'
import awsLogo from '/aws_logo.png'
import './App.css'
import { useComments } from './hooks/useComments'
import { CommentForm } from './components/CommentForm'
import { CommentList } from './components/CommentList'

function App() {
  const { comments, addComment, updateComment, deleteComment, voteComment, loading, error } = useComments();

  return (
    <main style={{ maxWidth: 640, margin: '2rem auto', padding: '0 1rem' }}>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
          <img src={typescriptLogo} className="logo typescript" alt="Typescript logo" />
        </a>
        <a href="https://dotnet.microsoft.com/en-us/" target="_blank">
          <img src={dotnetLogo} className="logo dotnet" alt=".NET logo" />
        </a>
        <a href="https://aws.amazon.com/" target="_blank">
          <img src={awsLogo} className="logo aws" alt="AWS logo" />
        </a>
      </div>
      <h1>React + TS + .NET + AWS</h1>
      <h1>💬 Interactive Comments</h1>

      <CommentForm onAdd={addComment} />

      {loading && <p>Loading comments...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <CommentList
        comments={comments}
        onReply={addComment}
        onEdit={updateComment}
        onDelete={deleteComment}
        onVote={voteComment}
      />
    </main>
  )
}

export default App
