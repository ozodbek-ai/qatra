export interface Certificate {
  id: string;
  certificateNo: string;
  issuedAt: string;

  course: {
    id: string;
    title: string;
  };
}