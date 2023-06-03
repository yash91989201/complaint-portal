// custom hook import
import useUpvote from "@/hooks/useUpvote";
import { ArrowBigDownDash, ArrowBigUpDash, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
// react icons

interface Props {
  ticket_id: string;
  vote: VoteType[];
}

export default function Vote({ ticket_id, vote }: Props): JSX.Element {
  const [vote_count, has_user_voted, upVote, isLoading] = useUpvote({
    ticket_id,
    vote,
  });

  return (
    <div className="flex items-center overflow-hidden border rounded-full">
      <Button
        className="p-1 px-1.5 border-none rounded-none cursor-pointer hover:text-blue-500 hover:bg-gray-200 h-fit "
        variant="outline"
        onClick={() => upVote(true)}
      >
        <ArrowBigUpDash
          size={18}
          className={
            has_user_voted && has_user_voted
              ? "fill-blue-500 stroke-blue-500"
              : ""
          }
        />
      </Button>
      <p className="flex items-center justify-center w-8 text-black border-l border-r cursor-default">
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          vote_count
        )}
      </p>
      <Button
        className=" p-1 px-1.5 text-xl rounded-none cursor-pointer hover:text-red-500 hover:bg-gray-200 h-fit"
        variant="ghost"
        onClick={() => upVote(false)}
      >
        <ArrowBigDownDash
          size={18}
          className={
            has_user_voted == false ? "fill-red-500 stroke-red-500" : ""
          }
        />
      </Button>
    </div>
  );
}
