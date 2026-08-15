import * as adminRepository from "../repositories/admin.repository.js";

export const getStatistics = async () => {
  const [
    students,
    admins,
    courses,
    lessons,
    quizzes,
    enrollments,
    completedLessons,
    attempts,
    averageScore,
    latestStudents,
  ] = await Promise.all([
    adminRepository.countStudents(),
    adminRepository.countAdmins(),
    adminRepository.countCourses(),
    adminRepository.countLessons(),
    adminRepository.countQuizzes(),
    adminRepository.countEnrollments(),
    adminRepository.countCompletedLessons(),
    adminRepository.countQuizAttempts(),
    adminRepository.getAverageQuizScore(),
    adminRepository.getLatestStudents(),
  ]);

  return {
    overview: {
      students,
      admins,
      courses,
      lessons,
      quizzes,
      enrollments,
      completedLessons,
    },

    quiz: {
      attempts,
      averageScore,
    },

    latestStudents,
  };
};