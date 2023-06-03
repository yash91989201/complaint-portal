import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Trash2 } from "lucide-react";
import { DELETE_COMPLAINT_BY_PK } from "@/graphql/mutations";
import { GET_COMPLAINTS } from "@/graphql/queries";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useRouter } from "next/router";
import EditComplaintForm from "./EditComplaintForm";
import Vote from "./Vote";
import { useMutation } from "@apollo/client";

interface ComplaintCardProps extends ComplaintType {}

export default function ComplaintCard(props: ComplaintCardProps) {
  const {
    created_at,
    ticket_id,
    user,
    category,
    sub_category,
    status,
    description,
    image_id,
    title,
    vote,
  } = props;

  const [
    deleteComplaint,
    { loading: deletingComplaint, called: deleteComplaintCalled },
  ] = useMutation<DeleteComplaintByPkReturnType, DeleteComplaintByPkVarType>(
    DELETE_COMPLAINT_BY_PK,
    {
      variables: {
        ticket_id: ticket_id,
      },
      refetchQueries: [
        {
          query: GET_COMPLAINTS,
        },
      ],
    }
  );

  const { route } = useRouter();

  return (
    <Card className="relative w-full overflow-hidden bg-white shadow max-h-60">
      {deletingComplaint ||
        (deleteComplaintCalled && (
          <div className="absolute inset-0 bg-white/80 z-[99] flex items-center justify-center space-x-3 font-semibold">
            <Loader2 size={24} className="animate-spin" />
            <span>Deleting Complaint</span>
          </div>
        ))}
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <div className="flex ">
          <Avatar className="self-center mr-2 bg-gray-100 border">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.displayName}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle>{user.displayName}</CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              {user.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-4 ">
        <div className="flex my-1 space-x-3">
          <Badge
            variant="secondary"
            className="cursor-default select-none w-fit sm:w-auto"
          >
            {category}&nbsp;/&nbsp;{sub_category}
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-default select-none w-fit sm:w-auto"
          >
            {new Date(created_at).toLocaleDateString()}
          </Badge>
          <Badge
            data-status={status.split(" ").join("")}
            className="group  data-[status=NotStarted]:bg-gray-100 data-[status=NotStarted]:text-gray-500
            data-[status=Processing]:bg-amber-400 data-[status=Processing]:text-white
            data-[status=Resolved]:bg-green-500 data-[status=Resolved]:text-white
            cursor-default
            select-none w-fit sm:w-auto
            "
          >
            <div
              className="w-1.5 h-1.5 mr-1 rounded-full  group-data-[status=NotStarted]:bg-gray-500
            group-data-[status=Processing]:bg-white group-data-[status=Resolved]:bg-white   "
            ></div>
            {status}
          </Badge>
        </div>
        <div className="flex-1 mt-2 mb-3">
          <p>{title}</p>
          {image_id && (
            <div className="relative w-32 aspect-square">
              <Image
                src={`https://updrzfqvjfhophnanpqv.nhost.run/v1/storage/files/${image_id}`}
                alt={title}
                fill
              />
            </div>
          )}
          <p>{description}</p>
        </div>
        <div className="flex items-center justify-start space-x-3">
          {route === "/" && <Vote ticket_id={ticket_id} vote={vote} />}
          {route === "/my-complaints" && (
            <>
              <EditComplaintForm {...props} />
              <Button
                className="flex items-center px-4 py-2 space-x-2 rounded-full w-fit"
                variant="destructive"
                onClick={() => deleteComplaint()}
              >
                <Trash2 size={14} /> <span>Delete</span>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
