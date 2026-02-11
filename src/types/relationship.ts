import { RelationshipType } from "@/common/enums";
import { User } from "./user";
import { AnalysisSession } from "./analysis-session";

export class Relationship {
  id: string;
  userId: string;
  name?: string;
  avatarUrl?: string;
  relation: RelationshipType;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  session?: AnalysisSession;
}
