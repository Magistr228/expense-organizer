import { fireEvent, render, screen, within } from '@testing-library/react'

import App from './App'

describe('Expense organizer', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState(null, '', '/')
  })

  test('shows a compact overview and navigates to the full table', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Добрый день, Александр/ })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: /Расходы/ }))
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(window.location.pathname).toBe('/expenses')
  })

  test('navigates to monthly reports and changes the month', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: /Отчёты/ }))
    expect(screen.getByRole('heading', { name: 'Месячный отчёт' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Месяц отчёта'), { target: { value: '2020-01' } })
    expect(screen.getByText(/За этот месяц расходов нет/)).toBeInTheDocument()
  })

  test('adds, edits, and deletes an expense on the expenses page', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: /Расходы/ }))
    fireEvent.click(screen.getByRole('button', { name: /Добавить расход/ }))
    fireEvent.change(screen.getByLabelText('Сумма, ₽'), { target: { value: '750' } })
    fireEvent.change(screen.getByLabelText('Комментарий'), { target: { value: 'Новый расход' } })
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить расход' }))
    expect(screen.getByText('Новый расход')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Изменить расход: Новый расход' }))
    fireEvent.change(screen.getByLabelText('Сумма, ₽'), { target: { value: '900' } })
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить расход' }))
    expect(screen.getByText(/900 ₽/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Удалить расход: Новый расход' }))
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Удалить' }))
    expect(screen.queryByText('Новый расход')).not.toBeInTheDocument()
  })
})
