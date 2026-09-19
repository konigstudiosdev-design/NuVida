import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'

const INCOME_DATA = [
  { mes: 'Mar', ingresos: 18200, consultas: 28 },
  { mes: 'Abr', ingresos: 22400, consultas: 34 },
  { mes: 'May', ingresos: 19800, consultas: 30 },
  { mes: 'Jun', ingresos: 25100, consultas: 38 },
  { mes: 'Jul', ingresos: 23400, consultas: 36 },
  { mes: 'Ago', ingresos: 27000, consultas: 41 },
  { mes: 'Sep', ingresos: 28450, consultas: 47 },
]

const GOAL_DATA = [
  { name: 'Pérdida de peso', value: 48, color: '#14432C' },
  { name: 'Masa muscular', value: 22, color: '#28845A' },
  { name: 'Control clínico', value: 18, color: '#D4882A' },
  { name: 'Rendimiento', value: 12, color: '#A8C4B4' },
]

const AGE_DATA = [
  { rango: '18–24', pacientes: 14 },
  { rango: '25–34', pacientes: 38 },
  { rango: '35–44', pacientes: 29 },
  { rango: '45–54', pacientes: 22 },
  { rango: '55–64', pacientes: 13 },
  { rango: '65+', pacientes: 8 },
]

const ADHERENCIA_DATA = [
  { mes: 'Mar', tasa: 72 },
  { mes: 'Abr', tasa: 75 },
  { mes: 'May', tasa: 71 },
  { mes: 'Jun', tasa: 79 },
  { mes: 'Jul', tasa: 82 },
  { mes: 'Ago', tasa: 84 },
  { mes: 'Sep', tasa: 87 },
]

const KPIS = [
  { label: 'Pacientes totales', value: '124', delta: '+14 este año', positive: true },
  { label: 'Tasa de retención', value: '84%', delta: '+6% vs año anterior', positive: true },
  { label: 'Ingreso promedio/consulta', value: '$605', delta: '+8% vs año anterior', positive: true },
  { label: 'NPS (satisfacción)', value: '9.2', delta: 'Escala 1–10', positive: true },
]

export default function Reportes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>Reportes y analítica</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Período: Mar – Sep 2026</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--card)', fontSize: 13, fontFamily: 'var(--font-jakarta)', color: 'var(--foreground)', outline: 'none', cursor: 'pointer' }}>
            {['Últimos 7 meses', 'Último año', 'Este año'].map(o => <option key={o}>{o}</option>)}
          </select>
          <button style={{ padding: '8px 16px', background: 'var(--primary)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-jakarta)', color: '#fff' }}>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {KPIS.map(k => (
          <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 11.5, color: 'var(--muted-foreground)', fontWeight: 500, marginBottom: 10 }}>{k.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--foreground)', fontFamily: 'var(--font-instrument)', lineHeight: 1, marginBottom: 6 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: k.positive ? 'var(--accent)' : '#E85C45', fontWeight: 500 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Row 1: income + adherence */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Ingresos y consultas</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 20 }}>Evolución mensual combinada</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={INCOME_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14432C" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#14432C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#7C7870', fontFamily: 'var(--font-jakarta)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#7C7870', fontFamily: 'var(--font-jetbrains)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#7C7870', fontFamily: 'var(--font-jetbrains)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-jakarta)' }} />
              <Area yAxisId="left" type="monotone" dataKey="ingresos" stroke="#14432C" strokeWidth={2} fill="url(#repGrad)" dot={false} name="Ingresos ($)" />
              <Area yAxisId="right" type="monotone" dataKey="consultas" stroke="#28845A" strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 2" name="Consultas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Adherencia al plan</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 20 }}>Tasa promedio mensual</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ADHERENCIA_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -30 }}>
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#7C7870', fontFamily: 'var(--font-jakarta)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#7C7870', fontFamily: 'var(--font-jetbrains)' }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-jakarta)' }} formatter={(v: number) => [`${v}%`, 'Adherencia']} />
              <Bar dataKey="tasa" fill="#28845A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: goals + age */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 20 }}>Distribución por objetivo</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={GOAL_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={2} stroke="var(--card)">
                  {GOAL_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {GOAL_DATA.map(g => (
                <div key={g.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--foreground)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: g.color, flexShrink: 0 }} />
                      {g.name}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-jetbrains)' }}>{g.value}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--muted)', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${g.value}%`, background: g.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Distribución por edad</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 20 }}>Pacientes activos por rango etario</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={AGE_DATA} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#7C7870', fontFamily: 'var(--font-jetbrains)' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="rango" tick={{ fontSize: 12, fill: '#7C7870', fontFamily: 'var(--font-jakarta)' }} axisLine={false} tickLine={false} width={44} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-jakarta)' }} formatter={(v: number) => [v, 'Pacientes']} />
              <Bar dataKey="pacientes" fill="#14432C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
