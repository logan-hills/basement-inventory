export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="stack">
      <div className="page-head"><div><span className="eyebrow">Coming next</span><h1>{title}</h1></div></div>
      <div className="empty card"><b>This screen is being built</b><span className="muted">It will match the rest of the app when it's ready.</span></div>
    </div>
  )
}
