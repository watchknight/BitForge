export interface RoadmapTopicRef {
  id: string;
  title: string;
  isFlagship: boolean;
  estimatedMinutes: number;
}

export interface RoadmapCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
  topics: RoadmapTopicRef[];
}

export type TopicStatus = 'not-started' | 'practicing' | 'mastered';

export interface UserTopicProgress {
  topicId: string;
  status: TopicStatus;
  completed: boolean;
  simulationViewed: boolean;
  quizScore?: number; // e.g. 3 out of 3
  quizPassed?: boolean;
  lastVisitedAt: string;
}

export interface UserProgressState {
  completedTopics: Record<string, UserTopicProgress>;
  xp: number;
  streakDays: number;
}
