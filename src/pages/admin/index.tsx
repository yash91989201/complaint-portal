import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ComplaintFilter from "@/components/complaint/ComplaintFilter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const complaintPriority = (
  votes: number
): {
  priorityText: string;
  priorityBadgeStyling: string;
} => {
  if (votes > 50)
    return {
      priorityText: "High",
      priorityBadgeStyling: "text-white bg-red-500",
    };
  if (votes > 25)
    return {
      priorityText: "Medium",
      priorityBadgeStyling: "text-white bg-amber-600",
    };
  return {
    priorityText: "Low",
    priorityBadgeStyling: "",
  };
};

type StatusType = "Not Started" | "Processing" | "Resolved";

// // This type is used to define the shape of our data.
// // You can use a Zod schema here if you want.
export interface ComplaintTableType {
  created_at: Date;
  ticket_id: string;
  title: string;
  description: string;
  category: string;
  sub_category: string;
  status: StatusType;
  priority: number;
  vote: VoteType[];
}
import apollo_client from "@/config/apollo-client";

const updateComplaintStatus = ({
  ticket_id,
  current_status,
  updated_status,
}: {
  ticket_id: string;
  current_status: StatusType;
  updated_status: StatusType;
}): void => {
  if (current_status === updated_status) return;
  apollo_client
    .mutate<
      SelectComplaintReturnType,
      { ticket_id: string; status: StatusType }
    >({
      mutation: UPDATE_COMPLAINT_STATUS,
      variables: {
        ticket_id,
        status: updated_status,
      },
      refetchQueries: [{ query: GET_COMPLAINTS }],
    })
    .then(() => {
      toast.success("Status updated");
    });
};

export const columns: ColumnDef<ComplaintType>[] = [
  {
    accessorKey: "created_at",
    header: "Created At",
    // header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const created_at = row.getValue("created_at") as Date;
      const formattedDate = new Date(created_at).toLocaleDateString();
      return <div className="font-medium">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "sub_category",
    header: "Sub Category",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const complaint = row.original;

      return (
        <Select
          onValueChange={(updated_status: StatusType) => {
            updateComplaintStatus({
              ticket_id: complaint.ticket_id,
              current_status: complaint.status,
              updated_status,
            });
          }}
          defaultValue={complaint.status}
        >
          <SelectTrigger className="rounded-full ">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            {["Not Started", "Processing", "Resolved"].map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "vote",
    header: () => <></>,
    cell: () => <></>,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    // header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const votes = row.getValue("vote") as VoteType[];
      const upvote_count = votes.reduce((total, vote) => {
        return vote.upvote ? (total += 1) : (total -= 1);
      }, 0);

      const { priorityText, priorityBadgeStyling } =
        complaintPriority(upvote_count);
      return (
        <Badge variant="secondary" className={priorityBadgeStyling}>
          {priorityText}
        </Badge>
      );
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end p-4 space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button variant="outline" size="sm">
          {table.getPageCount()}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

import { ComplaintFilterContext } from "@/components/shared/Layout";
import { useContext } from "react";
import { UPDATE_COMPLAINT_STATUS } from "@/graphql/mutations";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import { GET_COMPLAINTS } from "@/graphql/queries";
import Head from "next/head";
import { useAuthenticationStatus } from "@nhost/react";
import { useRouter } from "next/router";

export default function AdminHome() {
  const {
    filteredComplaints: complaintsList,
    complaintFilter,
    resetFilter,
  } = useContext(ComplaintFilterContext);
  const router = useRouter();
  const { isAuthenticated } = useAuthenticationStatus();

  if (!isAuthenticated) router.push("/admin/sign-up");

  return (
    <>
      <Head>
        <title>Student Complaint Portal | Admin</title>
      </Head>
      <main className="flex flex-col max-w-6xl px-3 mx-auto my-6 space-y-6 lg:px-6 xl:px-0 ">
        <div className="flex items-center justify-center ">
          <div className="flex-1" />
          <ComplaintFilter />
          {complaintFilter && Object.keys(complaintFilter).length > 0 ? (
            <Button variant="outline" onClick={resetFilter}>
              <X size={16} />
              <span>Clear Filter</span>
            </Button>
          ) : (
            <></>
          )}
        </div>
        <div className="container mx-auto">
          <DataTable columns={columns} data={complaintsList} />
        </div>
      </main>
    </>
  );
}
