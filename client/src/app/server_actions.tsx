"use server"
import  prisma  from '@/lib/prisma';

export const createTask = async (task: string, dateStarted: string, userId: string): Promise<number > => {
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      return 0;
    }

    const newTaskHistory = await prisma.taskHistory.create({
      data: {
        task,
        dateStarted,
        userId,
      },
    });

    return  newTaskHistory.id ;
  } catch (error) {
    console.error('An error occurred while creating the task:', error);
    return 0;
  }
};

export const updateTaskHistory = async (taskId: number, dateEnded: string, time: string) => {
  try {
    await prisma.taskHistory.update({
      where: {
        id: taskId,
      },
      data: {
        dateEnded,
        timeSpent:time,
        wasStopped:true
      },
    });
  } catch (error) {
    console.error('An error occurred while updating the task:', error);
  }
}

export const getTaskHistory = async (userId: string) => {
  
  try {
    const taskHistory = await prisma.taskHistory.findMany({
      where: {
        userId,
      },
      orderBy: {
        dateStarted: 'desc', 
      },
      take: 7, 
    });
    
    return taskHistory;
  } catch (error) {
    console.error('An error occurred while getting the task history:', error);
    return [];
  }
};