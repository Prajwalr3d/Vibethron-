// Rewrite text with preserved facts circled.
export default function FactText({ text, marks }) {
  const out = [];
  let at = 0;
  marks.forEach((m, i) => {
    if (m.start > at) out.push(text.slice(at, m.start));
    out.push(
      <span key={i} className="fact-mark" title={`Preserved ${m.type}`}>
        {text.slice(m.start, m.end)}
      </span>
    );
    at = m.end;
  });
  out.push(text.slice(at));
  return out;
}
