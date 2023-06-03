import { useMutation } from "@apollo/client";
import { useAuthenticated, useUserId } from "@nhost/react";
import { DELETE_VOTE, INSERT_VOTE, UPDATE_VOTE } from "@/graphql/mutations";
import { GET_COMPLAINTS, GET_PUBLIC_COMPLAINTS } from "@/graphql/queries";
import toast from "react-hot-toast";

interface Props {
  ticket_id: string;
  vote: VoteType[];
}

type HookReturnType = [
  number,
  boolean | undefined,
  (up_vote: boolean) => void,
  boolean
];

interface ReturnProps extends HookReturnType {}

export default function useUpvote({ ticket_id, vote }: Props): ReturnProps {
  const userId = useUserId();
  const isAuthenticated = useAuthenticated();
  const vote_count = vote.reduce((total, vote) => {
    return vote.upvote ? (total += 1) : (total -= 1);
  }, 0);
  // check for the vote done by a specific user with given userId
  const user_vote_object = vote.find((vote) => vote.user_id === userId);
  // user_vote_object contains the upvote object for the current user
  const has_user_voted = user_vote_object?.upvote;
  // get the vote id for a possible update or delete
  const user_vote_id = user_vote_object?.id;
  const [insertVote, { loading: insertVoteLoading }] = useMutation<
    InsertVoteReturntype,
    InsertVoteVarType
  >(INSERT_VOTE, {
    refetchQueries: [
      { query: GET_PUBLIC_COMPLAINTS },
      { query: GET_COMPLAINTS },
    ],
  });

  const [updateVote, { loading: updateVoteLoading }] = useMutation<
    UpdateVoteReturnType,
    UpdateVoteVarType
  >(UPDATE_VOTE, {
    refetchQueries: [
      { query: GET_PUBLIC_COMPLAINTS },
      { query: GET_COMPLAINTS },
    ],
  });

  const [deleteVote, { loading: deleteVoteLoading }] = useMutation<
    DeleteVoteReturnType,
    DeleteVoteVarType
  >(DELETE_VOTE, {
    refetchQueries: [
      { query: GET_PUBLIC_COMPLAINTS },
      { query: GET_COMPLAINTS },
    ],
  });

  const upVote = (up_vote: boolean) => {
    if (!isAuthenticated) {
      toast.error("Please Signin to vote.", { id: "signin-to-vote-toast" });
      return;
    }
    if (has_user_voted == undefined) {
      insertVote({
        variables: {
          user_id: userId!,
          ticket_id: ticket_id,
          upvote: up_vote,
        },
      }).then(function () {
        toast.success("Added your vote.", { id: "add-vote-toast" });
      });
      return;
    }

    if ((has_user_voted && up_vote) || (!has_user_voted && !up_vote)) {
      deleteVote({ variables: { id: user_vote_id! } }).then(() => {
        toast.success("Vote Removed", { id: "remove-vote-toast" });
      });
      return;
    }

    updateVote({
      variables: {
        id: user_vote_id!,
        upvote: !has_user_voted,
      },
    }).then((res) => {
      if (res.data?.update_vote.affected_rows)
        toast.success("Vote Updated", { id: "" });
    });
  };
  const isLoading = insertVoteLoading || updateVoteLoading || deleteVoteLoading;
  return [vote_count, has_user_voted, upVote, isLoading];
}
