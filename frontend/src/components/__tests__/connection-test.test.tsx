import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConnectionTest from '../connection-test'

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('ConnectionTest Component', () => {
    beforeEach(() => {
        mockFetch.mockClear()
    })

    it('shows checking status initially', () => {
        render(<ConnectionTest />)

        expect(screen.getByText('System Status')).toBeInTheDocument()
        expect(screen.getByText('Backend API')).toBeInTheDocument()
        expect(screen.getByText('Database')).toBeInTheDocument()
    })

    it('shows connected status when backend is healthy', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                status: 'healthy',
                database: 'connected',
                timestamp: new Date().toISOString()
            }),
        } as Response)

        render(<ConnectionTest />)

        await waitFor(() => {
            expect(screen.getByText('Connected')).toBeInTheDocument()
        })
    })

    it('shows failed status when backend is down', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'))

        render(<ConnectionTest />)

        await waitFor(() => {
            expect(screen.getByText('Failed')).toBeInTheDocument()
        })
    })

    it('allows manual refresh of connection status', async () => {
        const user = userEvent.setup()

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                status: 'healthy',
                database: 'connected'
            }),
        } as Response)

        render(<ConnectionTest />)

        const refreshButton = screen.getByText('Refresh')
        await user.click(refreshButton)

        expect(mockFetch).toHaveBeenCalled()
    })

    it('displays response time when available', async () => {
        mockFetch.mockImplementationOnce(() =>
            new Promise(resolve =>
                setTimeout(() => resolve({
                    ok: true,
                    json: async () => ({
                        status: 'healthy',
                        database: 'connected'
                    }),
                } as Response), 100)
            )
        )

        render(<ConnectionTest />)

        await waitFor(() => {
            expect(screen.getByText('Response Time')).toBeInTheDocument()
        })
    })
})
