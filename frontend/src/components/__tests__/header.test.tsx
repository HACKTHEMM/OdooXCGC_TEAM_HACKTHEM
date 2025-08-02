import { render, screen } from '@testing-library/react'
import Header from '../../components/header'

describe('Header Component', () => {
    it('renders navigation links', () => {
        render(<Header />)

        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Issues')).toBeInTheDocument()
        expect(screen.getByText('Report')).toBeInTheDocument()
        expect(screen.getByText('Admin')).toBeInTheDocument()
        expect(screen.getByText('Login')).toBeInTheDocument()
    })

    it('has proper navigation structure', () => {
        render(<Header />)

        const homeLink = screen.getByRole('link', { name: /home/i })
        const issuesLink = screen.getByRole('link', { name: /issues/i })
        const reportLink = screen.getByRole('link', { name: /report/i })

        expect(homeLink).toHaveAttribute('href', '/home')
        expect(issuesLink).toHaveAttribute('href', '/issues')
        expect(reportLink).toHaveAttribute('href', '/report')
    })

    it('renders theme toggle component', () => {
        render(<Header />)

        // Look for theme toggle button
        const themeToggle = screen.getByRole('button')
        expect(themeToggle).toBeInTheDocument()
    })
})
