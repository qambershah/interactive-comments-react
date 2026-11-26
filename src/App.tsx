import './App.css';
import { CommentForm } from './components/CommentForm';
import { CommentList } from './components/CommentList';
import { useComments } from './hooks/useComments';

function App() {
  const { comments, addComment, updateComment, deleteComment, voteComment, loading, error } = useComments();

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="wordmark" href="./" aria-label="Qamber Abbas home">QA</a>
        <a className="source-link" href="https://github.com/qambershah/interactive-comments-react" target="_blank" rel="noreferrer">
          View source <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="page-intro" aria-labelledby="page-title">
        <p className="eyebrow">FULL-STACK DEMO · REACT + .NET</p>
        <h1 id="page-title">Interactive comments</h1>
        <p className="intro-copy">
          Post a comment, reply in a thread, or vote. Scores update in place so a comment stays where you are reading it.
        </p>
        <p className="demo-notice">
          This is a public demo. Comments use in-memory storage and may reset when the API restarts. Actions are shown as the demo user, Yoda.
        </p>
      </section>

      <section className="discussion" aria-labelledby="discussion-title" aria-busy={loading}>
        <div className="discussion-heading">
          <div>
            <h2 id="discussion-title">Discussion</h2>
            <p>Share a thought or join an existing thread.</p>
          </div>
          <span className="comment-count" aria-label={`${comments.length} comments`}>
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </div>

        {loading && <p className="status-message" role="status">Loading comments…</p>}
        {error && <p className="error-message" role="alert">{error}</p>}

        {!loading && (
          <CommentList
            comments={comments}
            onReply={addComment}
            onEdit={updateComment}
            onDelete={deleteComment}
            onVote={voteComment}
          />
        )}

        <div className="new-comment">
          <h3>Add to the discussion</h3>
          <CommentForm onAdd={addComment} />
        </div>
      </section>

      <footer className="site-footer">
        <span>React · TypeScript · ASP.NET Core · AWS</span>
        <a href="https://qambershah.github.io/portfolio/">Portfolio</a>
      </footer>
    </main>
  );
}

export default App;
