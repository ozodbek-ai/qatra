export interface Certificate {
  id: string;
  certificateNo: string;
  userId: string;
  courseId: string;
  completionId: string;
  issuedAt: string;

  course: {
    id: string;
    title: string;
  };
}