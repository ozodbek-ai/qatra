export interface SiteSettings {
  id: string;
  platformName: string;
  description: string;
  logoUrl: string | null;
  supportEmail: string | null;
  defaultQuizPassPercentage: number;
  createdAt: string;
  updatedAt: string;
}