import { Toaster } from "react-hot-toast";
// custom components
import Navbar from "./Navbar";
import { TailwindViewPortIndicator } from "@/components/TailwindViewPortIndicator";
import { useRouter } from "next/router";
import useComplaintFilter, {
  ComplaintFilterType,
} from "@/hooks/useComplaintFilter";
import { createContext } from "react";
import { NhostSession } from "@nhost/react";
import { GET_COMPLAINTS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";

interface Props {
  children: JSX.Element;
}

export interface ComplaintFilterContextType {
  filteredComplaints: ComplaintType[];
  complaintFilter: ComplaintFilterType;
  setComplaintFilter: React.Dispatch<React.SetStateAction<ComplaintFilterType>>;
  resetFilter: () => void;
}

export const ComplaintFilterContext = createContext<ComplaintFilterContextType>(
  {} as ComplaintFilterContextType
);

export default function Layout({ children }: Props): JSX.Element {
  const { data } = useQuery<SelectComplaintReturnType, {}>(GET_COMPLAINTS);

  const {
    complaintFilter,
    setComplaintFilter,
    resetFilter,
    filteredComplaints,
  } = useComplaintFilter({
    complaints: data?.complaints || [],
  });

  const { route } = useRouter();
  if (route === "/admin" || route === "/sign-in" || route === "/sign-up")
    return (
      <ComplaintFilterContext.Provider
        value={{
          filteredComplaints,
          complaintFilter,
          setComplaintFilter,
          resetFilter,
        }}
      >
        <Toaster />
        <Navbar />
        {children}
        <TailwindViewPortIndicator />
      </ComplaintFilterContext.Provider>
    );

  return (
    <ComplaintFilterContext.Provider
      value={{
        filteredComplaints,
        complaintFilter,
        setComplaintFilter,
        resetFilter,
      }}
    >
      <Toaster />
      <Navbar />
      {children}
      <TailwindViewPortIndicator />
    </ComplaintFilterContext.Provider>
  );
}
