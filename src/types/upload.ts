import { FileType } from "@/common/enums";

export interface Upload {
  id: string;
  sessionId?: string;
  chatMessageId?: string;
  filePath: string;
  fileType: FileType;
  fileName: string;
  orderIndex: number;
  extractedText?: string;
  createdAt: string;
}
