import * as searchRepository from "../repositories/search.repository.js";

export const globalSearch = async (
  query: string
) => {

  const keyword = query.trim();

  if (!keyword) {
    return {
      courses: [],
      lessons: [],
      students: [],
      quizzes: [],
    };
  }

  const [
    courses,
    lessons,
    students,
    quizzes,
  ] = await Promise.all([
    searchRepository.searchCourses(keyword),
    searchRepository.searchLessons(keyword),
    searchRepository.searchStudents(keyword),
    searchRepository.searchQuizzes(keyword),
  ]);

  return {
    courses,
    lessons,
    students,
    quizzes,
  };
};