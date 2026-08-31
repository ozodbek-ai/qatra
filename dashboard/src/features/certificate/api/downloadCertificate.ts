import { api } from "@/lib/axios";

interface DownloadCertificateParams {
  certificateId: string;
  certificateNo: string;
}

export const downloadCertificate = async ({
  certificateId,
  certificateNo,
}: DownloadCertificateParams) => {
  const response = await api.get(
    `/certificates/${certificateId}/pdf`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob(
    [response.data],
    {
      type: "application/pdf",
    }
  );

  const url = window.URL.createObjectURL(
    blob
  );

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `Qatra-Certificate-${certificateNo}.pdf`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};