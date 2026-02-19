export interface IGoal {
  goalId: number
  goalName: string
  description: string
  startDate: string
  endDate: string
  isAchieved: boolean
  userId: number
  milestones: IMilestone[]
}

export interface IMilestone {
  milestoneId: number
  milestoneName: string
  description: string
  targetDate: string
  isCompleted: boolean
}