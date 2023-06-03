import { User } from "@nhost/core";
import { UUID } from "crypto";
export {};

declare global {
  interface ComplaintType {
    created_at: Date;
    ticket_id: string;
    title: string;
    description: string;
    category: string;
    sub_category: string;
    status: "Not Started" | "Processing" | "Resolved";
    is_public: boolean;
    image_id: UUID;
    user: User;
    vote: VoteType[];
  }

  interface SelectComplaintReturnType {
    complaints: ComplaintType[];
  }

  interface InsertComplaintReturnType {
    insert_complaints_one: ComplaintType;
  }

  interface InsertComplaintVarType {
    title: string;
    description: string;
    category: string;
    sub_category: string;
    is_public: boolean;
    image_id: string;
    user_id: string;
    status: "Not Started" | "Processing" | "Resolved";
  }

  interface UpdateComplaintByPkReturnType {
    complaints: ComplaintType[];
  }

  interface UpdateComplaintByPkVarType {
    ticket_id: string;
    title: string;
    description: string;
    category: string;
    sub_category: string;
    is_public: boolean;
    image_id: string;
  }

  interface DeleteComplaintByPkVarType {
    ticket_id: string;
  }
  interface DeleteComplaintByPkReturnType {
    deketed_complaints_by_pk: ComplaintType;
  }

  interface CategoryType {
    category_id: UUID;
    title: string;
    description: string;
  }

  interface SelectCategoryReturnType {
    category: CategoryType[];
  }

  interface SubCategoryType {
    sub_category_id: UUID;
    parent_category_id: UUID;
    title: string;
    description: string;
  }

  interface SelectSubCategoryReturnType {
    sub_category: SubCategoryType[];
  }
  interface SelectSubCategoryVarType {
    parent_category_id: string;
  }

  interface VoteType {
    id: string;
    user_id: string;
    complaint_id: string;
    upvote: boolean;
  }

  interface SelectVoteReturnType {
    vote: VoteType[];
  }

  interface InsertVoteVarType {
    user_id: string;
    ticket_id: string;
    upvote: boolean;
  }

  interface InsertVoteReturntype {
    insert_vote_one: VoteType;
  }

  interface UpdateVoteVarType {
    id: string;
    upvote: boolean;
  }

  interface UpdateVoteReturnType {
    update_vote: {
      affected_rows: number;
    };
  }

  interface DeleteVoteVarType {
    id: string;
  }
  interface DeleteVoteReturnType {
    delete_vote_by_pk: VoteType;
  }
}
