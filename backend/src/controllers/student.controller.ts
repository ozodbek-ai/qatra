import { asyncHandler } from "../utils/asyncHandler.js";
import * as studentService from "../services/student.service.js";

export const getStudentsController =
asyncHandler(async (req, res) => {

  const students =
    await studentService.getStudents(
  req.query
);

  res.json({
    success: true,
    data: students,
  });

});

export const getStudentController =
asyncHandler(async (req, res) => {

  const student =
    await studentService.getStudentById(
      req.params.id as string
    );

  res.json({
    success: true,
    data: student,
  });

});