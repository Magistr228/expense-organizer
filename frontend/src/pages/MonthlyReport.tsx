import { useState } from 'react'
import type { CSSProperties } from 'react'

import type { Expense } from '@my-app/ui-library'

interface MonthlyReportProps {
  expenses: Expense[]
}

export function MonthlyReport({ expenses }: MonthlyReportProps) {
  const [month, setMonth] = useState<string>(() => {
    const today = new Date()

    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  })
  const monthlyExpenses = expenses.filter((expense) => expense.date.startsWith(month))
  const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totals = Object.entries(monthlyExpenses.reduce<Record<string, number>>((result, expense) => {
    result[expense.category] = (result[expense.category] ?? 0) + expense.amount

    return result
  }, {})).sort((left, right) => right[1] - left[1])
  const label = new Date(`${month}-01T00:00:00`).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })

  return (
    <section className="report-page">
      <div className="route-heading">
        <div><p className="eyebrow">АНАЛИТИКА</p><h1>Месячный отчёт</h1><p>Вся картина расходов за выбранный месяц.</p></div>
        <label className="month-picker">Месяц <input aria-label="Месяц отчёта" type="month" value={month} onChange={(event) => setMonth(event.target.value)} /></label>
      </div>
      <div className="report-stat-grid">
        <article className="report-stat"><span>Потрачено</span><strong>{total.toLocaleString('ru-RU')} ₽</strong><small>{label}</small></article>
        <article className="report-stat"><span>Операций</span><strong>{monthlyExpenses.length}</strong><small>За выбранный месяц</small></article>
        <article className="report-stat"><span>Средний расход</span><strong>{(monthlyExpenses.length ? Math.round(total / monthlyExpenses.length) : 0).toLocaleString('ru-RU')} ₽</strong><small>На одну операцию</small></article>
      </div>
      <div className="report-charts">
        <article className="panel report-chart"><p className="eyebrow">СТРУКТУРА</p><h2>По категориям</h2>
          {totals.length ? totals.map(([category, amount]) => <div className="chart-row" key={category}><div><strong>{category}</strong><span>{amount.toLocaleString('ru-RU')} ₽</span></div><div className="chart-track"><span style={{ width: `${amount / total * 100}%` }} /></div></div>) : <p className="empty-note">За этот месяц расходов нет. Добавьте запись в разделе «Расходы».</p>}
        </article>
        <article className="panel report-chart"><p className="eyebrow">ИТОГ МЕСЯЦА</p><h2>На что ушли деньги</h2><div className="donut" style={{ '--share': `${totals.length ? totals[0][1] / total * 100 : 0}%` } as CSSProperties}><div><strong>{totals.length ? Math.round(totals[0][1] / total * 100) : 0}%</strong><small>крупнейшая категория</small></div></div><p className="chart-caption">{totals.length ? `Больше всего — ${totals[0][0].toLowerCase()}` : 'Данные появятся после добавления расходов'}</p></article>
      </div>
    </section>
  )
}
