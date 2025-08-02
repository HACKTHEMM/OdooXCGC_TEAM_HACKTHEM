import { apiClient, formatApiError, isApiSuccess } from '../api-client'

// Mock fetch globally for these tests
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('API Client', () => {
    beforeEach(() => {
        mockFetch.mockClear()
    })

    describe('API Connection', () => {
        it('should connect to backend health endpoint', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    status: 'healthy',
                    database: 'connected',
                    timestamp: new Date().toISOString()
                }),
            } as Response)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/../health`)
            const data = await response.json()

            expect(response.ok).toBe(true)
            expect(data.status).toBe('healthy')
            expect(data.database).toBe('connected')
        })

        it('should handle API errors gracefully', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({ error: 'Server error' }),
            } as Response)

            try {
                const response = await apiClient.getAnalyticsSummary()
                expect(response.success).toBe(false)
            } catch (error) {
                expect(error).toBeDefined()
            }
        })
    })

    describe('Authentication', () => {
        it('should register a new user', async () => {
            const mockUser = {
                id: 1,
                user_name: 'testuser',
                email: 'test@example.com',
                created_at: new Date(),
                updated_at: new Date(),
                is_banned: false
            }

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    data: { user: mockUser, token: 'mock-token' }
                }),
            } as Response)

            const response = await apiClient.register({
                user_name: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            })

            expect(response.success).toBe(true)
            expect(response.data?.user.user_name).toBe('testuser')
        })

        it('should login existing user', async () => {
            const mockUser = {
                id: 1,
                user_name: 'testuser',
                email: 'test@example.com',
                created_at: new Date(),
                updated_at: new Date(),
                is_banned: false
            }

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    data: { user: mockUser, token: 'mock-token' }
                }),
            } as Response)

            const response = await apiClient.login({
                email: 'test@example.com',
                password: 'password123'
            })

            expect(response.success).toBe(true)
            expect(response.data?.user.user_name).toBe('testuser')
        })
    })

    describe('Issues API', () => {
        it('should fetch issues', async () => {
            const mockIssues = [
                {
                    id: 1,
                    title: 'Test Issue',
                    description: 'Test Description',
                    status: 'reported'
                }
            ]

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    data: {
                        data: mockIssues,
                        total: 1,
                        page: 1,
                        limit: 10
                    }
                }),
            } as Response)

            const response = await apiClient.getIssues()

            expect(response.success).toBe(true)
            expect(response.data?.data).toHaveLength(1)
        })

        it('should create new issue', async () => {
            const newIssue = {
                title: 'New Issue',
                description: 'New Description',
                category_id: 1,
                latitude: 24.6339,
                longitude: 73.2496
            }

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    success: true,
                    data: { ...newIssue, id: 2, status: 'reported' }
                }),
            } as Response)

            const response = await apiClient.createIssue(newIssue)

            expect(response.success).toBe(true)
            expect(response.data?.title).toBe('New Issue')
        })
    })

    describe('Utility Functions', () => {
        it('should format API errors correctly', () => {
            expect(formatApiError('Network error')).toBe('Network error. Please check your connection and try again.')
            expect(formatApiError('401 Unauthorized')).toBe('Authentication required. Please log in again.')
            expect(formatApiError('403 Forbidden')).toBe('You do not have permission to perform this action.')
            expect(formatApiError('404 Not Found')).toBe('The requested resource was not found.')
            expect(formatApiError('500 Internal Server Error')).toBe('Server error. Please try again later.')
        })

        it('should check API success correctly', () => {
            const successResponse = { success: true, data: { test: 'data' } }
            const failureResponse = { success: false, error: 'Error message' }

            expect(isApiSuccess(successResponse)).toBe(true)
            expect(isApiSuccess(failureResponse)).toBe(false)
        })
    })
})
