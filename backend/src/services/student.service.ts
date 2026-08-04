import * as studentRepository from "../repositories/student.repository.js";
import { AppError } from "../utils/AppError.js";

import {
  getPagination,
  type PaginationQuery,
} from "../utils/pagination.js";

export const getStudents = async (
  query: PaginationQuery
) => {

  const {
    page,
    limit,
    skip,
    take,
  } = getPagination(query);

  const search =
    query.search?.trim();

  const students =
    await studentRepository.findStudents(
      skip,
      take,
      search
    );

  const total =
    await studentRepository.countStudents(
      search
    );

  return {

    items: students.map(student => ({

      id: student.id,

      fullName: student.fullName,

      email: student.email,

      joinedAt: student.createdAt,

      enrolledCourses: 0,
      quizAttempts: 0,

    })),

    pagination: {

      page,

      limit,

      total,

      totalPages:
        Math.ceil(total / limit),

    },

  };

};

export const getStudentById = async (
  id: string
) => {

  const student =
    await studentRepository.findStudentById(id);

  if (!student) {
    throw new AppError(
      "Student topilmadi.",
      404
    );
  }

  return student;

};