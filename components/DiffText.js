// Word-level redline: additions in green highlighter, deletions struck in red pen.
export default function DiffText({ parts }) {
  return parts.map((p, i) => {
    if (p.added) return <ins key={i} className="ins-mark">{p.value}</ins>;
    if (p.removed) return <del key={i} className="del-pen">{p.value}</del>;
    return <span key={i}>{p.value}</span>;
  });
}
