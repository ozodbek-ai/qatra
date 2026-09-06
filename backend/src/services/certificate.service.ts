import * as certificateRepository from "../repositories/certificate.repository.js";
import * as completionRepository from "../repositories/course-completion.repository.js";
import { generateCertificateNo } from "../utils/generateCertificateNo.js";
import { AppError } from "../utils/AppError.js";
import PDFDocument from "pdfkit";
import * as notificationService from
  "./notification.service.js";
import {
  createNotification,
} from "./notification.service.js";

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

  const certificate =
  await certificateRepository.createCertificate(
    userId,
    courseId,
    completion.id,
    generateCertificateNo()
  );

/*
|--------------------------------------------------------------------------
| Notification
|--------------------------------------------------------------------------
*/

await createNotification({
  userId,

  type: "CERTIFICATE_ISSUED",

  title: "Sertifikat tayyor",

  message:
    `"${certificate.course.title}" kursi uchun sertifikatingiz yaratildi.`,

  link:
    `/certificates/${certificate.id}`,

  metadata: {
    certificateId:
      certificate.id,

    certificateNo:
      certificate.certificateNo,

    courseId:
      certificate.course.id,
  },
});


return certificate;

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

export const generateCertificatePdf = async (
  userId: string,
  certificateId: string
) => {
  const certificate =
    await certificateRepository.findByIdForUser(
      certificateId,
      userId
    );

  if (!certificate) {
    throw new AppError(
      "Sertifikat topilmadi.",
      404
    );
  }

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 0,
  });

  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => {
    chunks.push(chunk);
  });

  const pdfBuffer =
    await new Promise<Buffer>(
      (resolve, reject) => {
        doc.on("end", () => {
          resolve(
            Buffer.concat(chunks)
          );
        });

        doc.on("error", reject);

        const width = 841.89;
        const height = 595.28;

        // Tashqi ramka
        doc
          .lineWidth(3)
          .strokeColor("#1e40af")
          .rect(
            25,
            25,
            width - 50,
            height - 50
          )
          .stroke();

        // Ichki ramka
        doc
          .lineWidth(1)
          .strokeColor("#94a3b8")
          .rect(
            38,
            38,
            width - 76,
            height - 76
          )
          .stroke();

        // QATRA
        doc
          .fontSize(28)
          .fillColor("#1e40af")
          .font("Helvetica-Bold")
          .text(
            "QATRA",
            0,
            75,
            {
              align: "center",
              width,
            }
          );

        // Sarlavha
        doc
          .fontSize(34)
          .fillColor("#0f172a")
          .font("Helvetica-Bold")
          .text(
            "SERTIFIKAT",
            0,
            125,
            {
              align: "center",
              width,
            }
          );

        doc
          .fontSize(14)
          .fillColor("#64748b")
          .font("Helvetica")
          .text(
            "Ushbu sertifikat quyidagini tasdiqlaydi:",
            0,
            190,
            {
              align: "center",
              width,
            }
          );

        // Student
        doc
          .fontSize(30)
          .fillColor("#0f172a")
          .font("Helvetica-Bold")
          .text(
            certificate.user.fullName,
            80,
            225,
            {
              align: "center",
              width: width - 160,
            }
          );

        // Kurs
        doc
          .fontSize(17)
          .fillColor("#475569")
          .font("Helvetica")
          .text(
            "quyidagi kursni muvaffaqiyatli yakunladi:",
            0,
            275,
            {
              align: "center",
              width,
            }
          );

        doc
          .fontSize(24)
          .fillColor("#1e40af")
          .font("Helvetica-Bold")
          .text(
            certificate.course.title,
            70,
            310,
            {
              align: "center",
              width: width - 140,
            }
          );

        // Pastki ma'lumotlar
        const issuedDate =
          new Date(
            certificate.issuedAt
          ).toLocaleDateString(
            "uz-UZ"
          );

        doc
          .fontSize(11)
          .fillColor("#64748b")
          .font("Helvetica")
          .text(
            "Sertifikat raqami",
            80,
            445
          );

        doc
          .fontSize(13)
          .fillColor("#0f172a")
          .font("Helvetica-Bold")
          .text(
            certificate.certificateNo,
            80,
            465
          );

        doc
          .fontSize(11)
          .fillColor("#64748b")
          .font("Helvetica")
          .text(
            "Berilgan sana",
            width - 220,
            445,
            {
              width: 140,
              align: "right",
            }
          );

        doc
          .fontSize(13)
          .fillColor("#0f172a")
          .font("Helvetica-Bold")
          .text(
            issuedDate,
            width - 220,
            465,
            {
              width: 140,
              align: "right",
            }
          );

        doc.end();
      }
    );

  return {
    certificate,
    pdfBuffer,
  };
};

export const getAdminCertificateStatistics =
  async () => {
    const now = new Date();

    const today =
      new Date(now);

    today.setHours(
      0,
      0,
      0,
      0
    );

    const week =
      new Date(today);

    const day =
      week.getDay();

    const daysFromMonday =
      day === 0
        ? 6
        : day - 1;

    week.setDate(
      week.getDate() -
        daysFromMonday
    );

    const month =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    return certificateRepository
      .getAdminCertificateStatistics({
        today,
        week,
        month,
      });
  };