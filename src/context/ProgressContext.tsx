import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProgressState, UserTopicProgress, TopicStatus } from '../types/roadmap';

interface ProgressContextType {
  progress: UserProgressState;
  setTopicStatus: (topicId: string, status: TopicStatus) => void;
  getTopicStatus: (topicId: string) => TopicStatus;
  markSimulationViewed: (topicId: string) => void;
  recordQuizScore: (topicId: string, score: number, totalQuestions: number) => void;
  isTopicCompleted: (topicId: string) => boolean;
  getTopicProgress: (topicId: string) => UserTopicProgress | undefined;
  getStatusCounts: () => { notStarted: number; practicing: number; mastered: number };
  addXp: (amount: number) => void;
  resetAllProgress: () => void;
}

const STORAGE_KEY = 'bitforge_user_progress_v2';

const defaultState: UserProgressState = {
  completedTopics: {},
  xp: 120, // default welcome bonus XP
  streakDays: 1,
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  const setTopicStatus = (topicId: string, status: TopicStatus) => {
    setProgress((prev) => {
      const existing = prev.completedTopics[topicId];
      const prevStatus = existing?.status || 'not-started';
      let xpBonus = 0;
      if (status === 'mastered' && prevStatus !== 'mastered') xpBonus = 50;
      else if (status === 'practicing' && prevStatus === 'not-started') xpBonus = 25;

      return {
        ...prev,
        xp: prev.xp + xpBonus,
        completedTopics: {
          ...prev.completedTopics,
          [topicId]: {
            topicId,
            status,
            completed: status === 'mastered',
            simulationViewed: existing?.simulationViewed || status !== 'not-started',
            quizScore: existing?.quizScore,
            quizPassed: existing?.quizPassed || status === 'mastered',
            lastVisitedAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const getTopicStatus = (topicId: string): TopicStatus => {
    const existing = progress.completedTopics[topicId];
    if (existing?.status) return existing.status;
    if (existing?.quizPassed || existing?.completed) return 'mastered';
    if (existing?.simulationViewed) return 'practicing';
    return 'not-started';
  };

  const markSimulationViewed = (topicId: string) => {
    setProgress((prev) => {
      const existing = prev.completedTopics[topicId];
      if (existing?.simulationViewed) return prev;

      const currentStatus = existing?.status || 'not-started';
      const newStatus = currentStatus === 'not-started' ? 'practicing' : currentStatus;

      return {
        ...prev,
        xp: prev.xp + 25,
        completedTopics: {
          ...prev.completedTopics,
          [topicId]: {
            topicId,
            status: newStatus,
            simulationViewed: true,
            completed: existing?.quizPassed || false,
            quizScore: existing?.quizScore,
            quizPassed: existing?.quizPassed,
            lastVisitedAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const recordQuizScore = (topicId: string, score: number, totalQuestions: number) => {
    const passed = score >= Math.ceil(totalQuestions * 0.6);
    setProgress((prev) => {
      const existing = prev.completedTopics[topicId];
      const addedXp = passed && !existing?.quizPassed ? 50 : 10;
      const newStatus: TopicStatus = passed ? 'mastered' : 'practicing';

      return {
        ...prev,
        xp: prev.xp + addedXp,
        completedTopics: {
          ...prev.completedTopics,
          [topicId]: {
            topicId,
            status: newStatus,
            simulationViewed: true,
            completed: passed,
            quizScore: score,
            quizPassed: passed,
            lastVisitedAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const isTopicCompleted = (topicId: string): boolean => {
    return getTopicStatus(topicId) === 'mastered';
  };

  const getTopicProgress = (topicId: string): UserTopicProgress | undefined => {
    return progress.completedTopics[topicId];
  };

  const getStatusCounts = () => {
    let notStarted = 0;
    let practicing = 0;
    let mastered = 0;

    Object.values(progress.completedTopics).forEach((topic) => {
      const st = topic.status || (topic.completed ? 'mastered' : topic.simulationViewed ? 'practicing' : 'not-started');
      if (st === 'mastered') mastered++;
      else if (st === 'practicing') practicing++;
      else notStarted++;
    });

    return { notStarted, practicing, mastered };
  };

  const addXp = (amount: number) => {
    setProgress((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  const resetAllProgress = () => {
    setProgress(defaultState);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        setTopicStatus,
        getTopicStatus,
        markSimulationViewed,
        recordQuizScore,
        isTopicCompleted,
        getTopicProgress,
        getStatusCounts,
        addXp,
        resetAllProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
