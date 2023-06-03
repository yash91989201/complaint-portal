import { useState } from "react";
import { ComplaintFilterFormType } from "@/components/complaint/ComplaintFilter";

interface ComplaintFilterHookType {
  complaints: ComplaintType[];
}

export interface ComplaintFilterType {
  created_at: Date | undefined;
  category: string | undefined;
  sub_category: string | undefined;
  status: "Not Started" | "Processing" | "Resolved" | undefined;
  has_image: boolean | undefined;
}

interface ReturnType {
  filteredComplaints: ComplaintType[];
  complaintFilter: ComplaintFilterType;
  setComplaintFilter: React.Dispatch<React.SetStateAction<ComplaintFilterType>>;
  resetFilter: () => void;
}

const isCompareFilterApplied = (
  complaintFilter: ComplaintFilterType
): boolean => {
  let noFilterAvailable = false;
  if (Object.keys(complaintFilter).length === 0) {
    noFilterAvailable = true;
  }
  Object.keys(complaintFilter).forEach((key) => {
    if (complaintFilter[key as keyof ComplaintFilterType] === "") {
      noFilterAvailable = true;
    }
  });
  return noFilterAvailable;
};

export default function useComplaintFilter({
  complaints,
}: ComplaintFilterHookType): ReturnType {
  const [complaintFilter, setComplaintFilter] = useState<ComplaintFilterType>(
    {} as ComplaintFilterType
  );

  const getFilteredComplaints = (): ComplaintType[] => {
    if (complaintFilter == undefined || isCompareFilterApplied(complaintFilter))
      return complaints;

    let filteredComplaints = complaints;

    if (
      complaintFilter.created_at &&
      complaintFilter.created_at !== undefined
    ) {
      filteredComplaints = filteredComplaints.filter((complaint) => {
        const complaintDate = new Date(complaint.created_at);
        const filterDate = complaintFilter.created_at!;
        if (complaintDate < filterDate) return complaint;
      });
    }
    if (complaintFilter.category && complaintFilter.category !== "") {
      filteredComplaints = filteredComplaints.filter(
        (complaint) => complaint.category === complaintFilter.category
      );
    }

    if (complaintFilter.sub_category && complaintFilter.sub_category !== "") {
      filteredComplaints = filteredComplaints.filter(
        (complaint) => complaint.sub_category === complaintFilter.sub_category
      );
    }

    if (complaintFilter.status && complaintFilter.status !== undefined) {
      filteredComplaints = filteredComplaints.filter(
        (complaint) => complaint.status === complaintFilter.status
      );
    }

    if (complaintFilter.has_image) {
      filteredComplaints = filteredComplaints.filter(
        (complaint) => complaint.image_id !== null
      );
    }

    return filteredComplaints;
  };
  const filteredComplaints = getFilteredComplaints();

  const resetFilter = () => {
    setComplaintFilter({} as ComplaintFilterType);
  };

  return {
    filteredComplaints,
    complaintFilter,
    setComplaintFilter,
    resetFilter,
  };
}
