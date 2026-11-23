import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

type Toast = { id: number; text: string; undo?: () => void | Promise<void>; kind?: 'ok' | 'bad' }
type Show = (text: string, opts?: { undo?: Toast['undo']; kind?: Toast['kind'] }) => void

const ToastContext = createContext<Show>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const next = useRef(1)

  const show = useCallback<Show>((text, opts) => {
    const id = next.current++
    setToasts(t => [...t.slice(-2), { id, text, ...opts }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), opts?.undo ? 5000 : 3000)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.kind ?? ''}`}>
            <span>{t.text}</span>
            {t.undo && (
              <button onClick={async () => { setToasts(x => x.filter(y => y.id !== t.id)); await t.undo?.() }}>Undo</button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
