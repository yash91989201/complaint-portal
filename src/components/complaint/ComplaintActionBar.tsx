import { useAuthenticationStatus } from "@nhost/react";
import CreateComplaintForm from "./CreateComplaintForm";
import ComplaintFilter from "./ComplaintFilter";
import { useContext } from "react";
import { LayoutGrid, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { ComplaintFilterContext } from "../shared/Layout";

interface Props {
  isGridView: boolean;
  toggleGridView: () => void;
}

export default function ComplaintActionBar({
  isGridView,
  toggleGridView,
}: Props) {
  const { isAuthenticated } = useAuthenticationStatus();
  const { complaintFilter, resetFilter } = useContext(ComplaintFilterContext);
  const { route } = useRouter();
  return (
    <div className="flex flex-row items-center justify-end w-full space-x-3 sm:justify-start ">
      {/* <div className="flex-1 hidden sm:block" /> */}
      <h2 className="flex-1 text-lg font-semibold sm:hidden">
        Complaint Actions
      </h2>
      {isAuthenticated ? <CreateComplaintForm /> : <></>}
      <div className="flex items-center justify-center space-x-2">
        <ComplaintFilter />
        {complaintFilter && Object.keys(complaintFilter).length > 0 ? (
          <Button variant="outline" onClick={resetFilter} className="space-x-3">
            <X size={16} />
            <span>Clear Filter</span>
          </Button>
        ) : (
          <></>
        )}
      </div>

      {route === "/" && (
        <div className="flex items-center justify-center space-x-3">
          <Button
            variant="secondary"
            className="flex items-center justify-center font-semibold sm:px-4 sm:py-2 sm:space-x-2"
            title="Toggle Grid/Column View"
            onClick={() => toggleGridView()}
          >
            <span className="hidden sm:inline">
              {isGridView ? "Grid View:" : "Column View:"}&nbsp;
            </span>
            {isGridView ? <LayoutGrid size={14} /> : <Menu size={14} />}
          </Button>
        </div>
      )}
    </div>
  );
}
