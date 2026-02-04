import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import {
  Cpu,
  Link2,
  LogOut,
  Moon,
  PlugZap,
  Shield,
  Sun,
  Timer,
} from 'lucide-react'
import {
  connections,
  crons,
  missingTools,
  projects,
  skills,
  subAgents,
  systemHealth,
  usage,
} from './mock'

const PASSWORD = 'IWThalassa4!'

type Theme = 'dark' | 'light'

function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = (localStorage.getItem('mc_theme') as Theme | null) ?? 'dark'
    setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('mc_theme', theme)
  }, [theme])

  return { theme, setTheme }
}

function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 rounded-full border border-border/10 bg-card/40 px-3 py-2 text-sm text-fg hover:opacity-90 transition"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}

function Dot({ tone }: { tone: 'good' | 'warn' | 'bad' | 'neutral' }) {
  return (
    <span
      className={clsx(
        'h-2 w-2 rounded-full',
        tone === 'good' && 'bg-good',
        tone === 'warn' && 'bg-warn',
        tone === 'bad' && 'bg-bad',
        tone === 'neutral' && 'bg-fg/30'
      )}
    />
  )
}

function HudCard({ title, icon, children, className }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={clsx('hud rounded-3xl border border-border/10 bg-card/30 p-5 backdrop-blur-xl', className)}>
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border/10 bg-card/40">
            {icon}
          </span>
          <h2 className="text-sm font-semibold tracking-wide text-fg">{title}</h2>
        </div>
      </header>
      {children}
    </section>
  )
}

function Login({ onOk }: { onOk: () => void }) {
  const { theme, setTheme } = useTheme()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 stars" />
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-xs tracking-[0.30em] text-muted/70">MISSION CONTROL</div>
            <h1 className="mt-2 text-2xl font-semibold">Docking</h1>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        <div className="hud rounded-3xl border border-border/10 bg-card/30 p-6 backdrop-blur-xl">
          <p className="text-sm text-muted/70">Enter passphrase to access the HUD.</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (password === PASSWORD) {
                localStorage.setItem('mc_auth', '1')
                onOk()
              } else {
                setError('Mot de passe incorrect.')
              }
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              className="w-full rounded-2xl border border-border/10 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Passphrase"
              autoFocus
            />
            {error ? <div className="rounded-2xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm">{error}</div> : null}
            <button className="w-full rounded-2xl bg-fg px-4 py-3 text-sm font-semibold text-bg hover:opacity-90">Engage</button>
          </form>
        </div>

        <div className="mt-5 text-center text-xs text-muted/60">v5 • Space HUD layout</div>
      </div>
    </div>
  )
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 stars" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs tracking-[0.35em] text-muted/70">MISSION CONTROL</div>
            <h1 className="mt-2 text-3xl font-semibold">Orbital HUD</h1>
            <p className="mt-2 max-w-xl text-sm text-muted/70">A cockpit-inspired layout with a central core.</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <button
              className="inline-flex items-center gap-2 rounded-full border border-border/10 bg-card/40 px-3 py-2 text-sm hover:opacity-90"
              onClick={onLogout}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-4">
            <HudCard title="Skills" icon={<Cpu size={16} />}>
              <div className="space-y-2">
                {skills.slice(0, 5).map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-2xl border border-border/10 bg-card/30 px-3 py-2 text-sm">
                    <span className="text-fg">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <Dot tone={s.status === 'ok' ? 'good' : s.status === 'warn' ? 'warn' : 'bad'} />
                      <span className="text-xs text-muted/70">{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted/60">+ {Math.max(0, skills.length - 5)} more</div>
            </HudCard>

            <HudCard title="Manques" icon={<PlugZap size={16} />}>
              <div className="grid gap-2">
                {missingTools.map((m) => (
                  <div key={m.name} className="rounded-2xl border border-border/10 bg-card/30 px-3 py-3">
                    <div className="text-sm font-semibold">{m.name}</div>
                    <div className="mt-1 text-xs text-muted/70">{m.why}</div>
                  </div>
                ))}
              </div>
            </HudCard>
          </div>

          <div className="lg:col-span-4">
            <div className="hud orb relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[42px] border border-border/10 bg-card/20 p-6 backdrop-blur-xl">
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.16), transparent 55%), radial-gradient(circle at 45% 55%, rgba(255,255,255,0.08), transparent 45%)',
              }} />
              <div className="relative">
                <div className="text-xs tracking-[0.35em] text-muted/70">CORE</div>
                <div className="mt-2 text-2xl font-semibold">System Pulse</div>
                <div className="mt-2 text-sm text-muted/70">Uptime {systemHealth.uptime} • Errors {systemHealth.recentErrors}</div>
              </div>

              <div className="relative grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-border/10 bg-card/30 p-4">
                  <div className="text-xs text-muted/70">Tokens (24h)</div>
                  <div className="mt-1 text-xl font-semibold">{usage.tokens24h.toLocaleString()}</div>
                </div>
                <div className="rounded-3xl border border-border/10 bg-card/30 p-4">
                  <div className="text-xs text-muted/70">Cost (24h)</div>
                  <div className="mt-1 text-xl font-semibold">${usage.cost24h.toFixed(2)}</div>
                </div>
                <div className="col-span-2 rounded-3xl border border-border/10 bg-card/30 p-4">
                  <div className="text-xs text-muted/70">API status</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {systemHealth.apiStatus.map((a) => (
                      <div key={a.name} className="flex items-center justify-between rounded-2xl border border-border/10 bg-card/20 px-3 py-2 text-sm">
                        <span className="text-muted/70">{a.name}</span>
                        <span className={clsx('text-xs font-semibold', a.status === 'ok' ? 'text-good' : 'text-warn')}>
                          {a.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative text-xs text-muted/60">v5 • HUD core module</div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <HudCard title="Connexions" icon={<Link2 size={16} />}>
              <div className="space-y-2">
                {connections.map((c) => (
                  <div key={c.name} className="rounded-2xl border border-border/10 bg-card/30 px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{c.name}</div>
                        <div className="mt-1 text-xs text-muted/70">{c.note}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dot tone={c.status === 'connected' ? 'good' : c.status === 'degraded' ? 'warn' : 'bad'} />
                        <span className="text-xs text-muted/70">{c.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </HudCard>

            <HudCard title="Work & Agents" icon={<Shield size={16} />}>
              <div className="space-y-2">
                {projects.map((p) => (
                  <div key={p.name} className="rounded-2xl border border-border/10 bg-card/30 px-3 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">{p.name}</div>
                        <div className="mt-1 text-xs text-muted/70">Updated {p.updated}</div>
                      </div>
                      <Dot tone={p.status === 'done' ? 'good' : p.status === 'blocked' ? 'bad' : 'neutral'} />
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-border/10 bg-card/30 px-3 py-3">
                  <div className="text-xs text-muted/70">Sub-agents</div>
                  <div className="mt-2 space-y-2">
                    {subAgents.map((a) => (
                      <div key={a.id} className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{a.task}</div>
                          <div className="mt-0.5 text-xs text-muted/70">{a.result}</div>
                        </div>
                        <span className="text-xs text-muted/70">{a.when}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </HudCard>

            <HudCard title="Crons" icon={<Timer size={16} />}>
              <div className="space-y-2">
                {crons.map((c) => (
                  <div key={c.name} className="flex items-start justify-between rounded-2xl border border-border/10 bg-card/30 px-3 py-3">
                    <div>
                      <div className="text-sm font-semibold">{c.name}</div>
                      <div className="mt-1 text-xs text-muted/70">{c.schedule}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-muted/60">next</div>
                      <div className="text-sm font-medium">{c.next}</div>
                    </div>
                  </div>
                ))}
              </div>
            </HudCard>
          </div>
        </div>

        <footer className="mt-10 text-xs text-muted/60">v5 • Space HUD / orbital core</footer>
      </div>
    </div>
  )
}

function App() {
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    setAuthed(localStorage.getItem('mc_auth') === '1')
  }, [])

  const view = useMemo(() => {
    if (!authed) return <Login onOk={() => setAuthed(true)} />
    return (
      <Dashboard
        onLogout={() => {
          localStorage.removeItem('mc_auth')
          setAuthed(false)
        }}
      />
    )
  }, [authed])

  return view
}

export default App
