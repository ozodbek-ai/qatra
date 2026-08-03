import * as certificateRepository from "../repositories/certificate.repository.js";
import * as completionRepository from "../repositories/course-completion.repository.js";
import { generateCertificateNo } from "../utils/generateCertificateNo.js";
import { AppError } from "../utils/AppError.js";

export const generateCertificate = async (
  userId: string,
  courseId: string
) => {

  const completion =
    await completionRepository.findCompletion(
      userId,
      courseId
    );

  if (!completion) {
    throw new AppError(
      "Kurs hali tugatilmagan.",
      400
    );
  }

  const existing =
    await certificateRepository.findByCompletion(
      completion.id
    );

  if (existing) {
    return existing;
  }

  return certificateRepository.createCertificate(
    userId,
    courseId,
    completion.id,
    generateCertificateNo()
  );

};

export const verifyCertificate = async (
  certificateNo: string
) => {

  const certificate =
    await certificateRepository.findByCertificateNo(
      certificateNo
    );

  if (!certificate) {
    throw new AppError(
      "Sertifikat topilmadi.",
      404
    );
  }

  return certificate;

};

export const getMyCertificates = async (
  userId: string
) => {

  return certificateRepository.getUserCertificates(
    userId
  );

};