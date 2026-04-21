import apiClient from '@/lib/apiClient'
import { ApiResponse } from '@/types'

// ── Types ────────────────────────────────────────────────────

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT' | 'FREELANCE'
export type WorkMode = 'REMOTE' | 'ON_SITE' | 'HYBRID'
export type ExperienceLevel = 'FRESHER' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD'
export type JobStatus = 'ACTIVE' | 'CLOSED' | 'DRAFT' | 'EXPIRED'
export type ApplicationStatus =
  | 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED'
  | 'OFFERED' | 'HIRED' | 'REJECTED' | 'WITHDRAWN'

export interface Job {
  id: number
  title: string
  description: string
  company: string
  location?: string
  jobType: JobType
  workMode: WorkMode
  experienceLevel: ExperienceLevel
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  requiredSkills: string[]
  minCgpa?: number
  graduationYearRequired?: number
  applyDeadline?: string
  openings: number
  status: JobStatus
  postedById: number
  postedByName: string
  postedByCompany?: string
  applicationCount: number
  alreadyApplied: boolean
  createdAt: string
  updatedAt: string
  externalApplyUrl?: string
}

export interface JobApplication {
  id: number
  jobId: number
  jobTitle: string
  company: string
  applicantId: number
  applicantName: string
  applicantEmail: string
  coverLetter?: string
  resumeUrl?: string
  status: ApplicationStatus
  recruiterNotes?: string
  appliedAt: string
  updatedAt: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface JobSearchParams {
  keyword?: string
  location?: string
  jobType?: JobType
  workMode?: WorkMode
  experienceLevel?: ExperienceLevel
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
}

// ── Jobs Service ─────────────────────────────────────────────

export const jobsService = {
  async searchJobs(params: JobSearchParams): Promise<ApiResponse<PageResponse<Job>>> {
    const { data } = await apiClient.get('/jobs', { params })
    return data
  },

  async getJob(id: number): Promise<ApiResponse<Job>> {
    const { data } = await apiClient.get(`/jobs/${id}`)
    return data
  },

  async createJob(payload: Partial<Job>): Promise<ApiResponse<Job>> {
    const { data } = await apiClient.post('/jobs', payload)
    return data
  },

  async updateJob(id: number, payload: Partial<Job>): Promise<ApiResponse<Job>> {
    const { data } = await apiClient.put(`/jobs/${id}`, payload)
    return data
  },

  async closeJob(id: number): Promise<ApiResponse<void>> {
    const { data } = await apiClient.patch(`/jobs/${id}/close`)
    return data
  },

  async getMyPostedJobs(page = 0): Promise<ApiResponse<PageResponse<Job>>> {
    const { data } = await apiClient.get('/jobs/my-posted', { params: { page } })
    return data
  },

  async applyToJob(jobId: number, payload: { coverLetter?: string; resumeUrl?: string  }): Promise<ApiResponse<JobApplication>> {
    const { data } = await apiClient.post(`/jobs/${jobId}/apply`, payload)
    return data
  },

  async getMyApplications(page = 0): Promise<ApiResponse<PageResponse<JobApplication>>> {
    const { data } = await apiClient.get('/jobs/my-applications', { params: { page } })
    return data
  },

  async getJobApplications(jobId: number, page = 0): Promise<ApiResponse<PageResponse<JobApplication>>> {
    const { data } = await apiClient.get(`/jobs/${jobId}/applications`, { params: { page } })
    return data
  },

  async updateApplicationStatus(
    appId: number,
    status: ApplicationStatus,
    recruiterNotes?: string
  ): Promise<ApiResponse<JobApplication>> {
    const { data } = await apiClient.patch(`/jobs/applications/${appId}/status`, { status, recruiterNotes })
    return data
  },

  async withdrawApplication(appId: number): Promise<ApiResponse<void>> {
    const { data } = await apiClient.delete(`/jobs/applications/${appId}/withdraw`)
    return data
  },
}

// ── Quiz Service ──────────────────────────────────────────────

export interface QuizQuestion {
  id: string
  topic: string
  subtopic?: string
  question: string
  options: string[]
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  tags?: string[]
}

export interface QuizResultResponse {
  id: string
  userId: number
  topic: string
  score: number
  totalQuestions: number
  percentage: number
  timeTakenSeconds: number
  badge: string
  answerReview?: AnswerReview[]
  completedAt: string
}

export interface AnswerReview {
  questionId: string
  question?: string
  options?: string[]
  selectedIndex: number
  correctIndex?: number
  explanation?: string
  correct: boolean
}

export const quizService = {
  async getTopics(): Promise<ApiResponse<string[]>> {
    const { data } = await apiClient.get('/quiz/topics')
    return data
  },

  async getQuestions(topic: string, difficulty?: string, limit = 10): Promise<ApiResponse<QuizQuestion[]>> {
    const { data } = await apiClient.get('/quiz/questions', { params: { topic, difficulty, limit } })
    return data
  },

  async submitQuiz(payload: {
    topic: string
    answers: { questionId: string; selectedIndex: number }[]
    timeTakenSeconds: number
  }): Promise<ApiResponse<QuizResultResponse>> {
    const { data } = await apiClient.post('/quiz/submit', payload)
    return data
  },

  async getMyResults(): Promise<ApiResponse<QuizResultResponse[]>> {
    const { data } = await apiClient.get('/quiz/results/my')
    return data
  },

  async getBestResult(topic: string): Promise<ApiResponse<QuizResultResponse>> {
    const { data } = await apiClient.get('/quiz/results/my/best', { params: { topic } })
    return data
  },
}