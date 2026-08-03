import * as adminRepository from "../repositories/admin.repository.js";

export const getStatistics = async () => {
  const [
    users,
    courses,
    lessons,
    enrollments,
    completedLessons,
  ] = await Promise.all([
    adminRepository.countUsers(),
    adminRepository.countCourses(),
    adminRepository.countLessons(),
    adminRepository.countEnrollments(),
    adminRepository.countCompletedLessons(),
  ]);

  return {
    users,
    courses,
    lessons,
    enrollments,
    completedLessons,
  };
};