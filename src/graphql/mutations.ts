import { gql } from "@apollo/client";

const INSERT_COMPLAINT = gql`
  mutation insertComplaint(
    $title: String!
    $description: String!
    $category: String!
    $sub_category: String!
    $user_id: uuid!
    $is_public: Boolean # $image_id: uuid
  ) {
    insert_complaints_one(
      object: {
        title: $title
        description: $description
        category: $category
        sub_category: $sub_category
        user_id: $user_id
        is_public: $is_public
        # image_id: $image_id
      }
    ) {
      created_at
      ticket_id
      title
      description
      category
      sub_category
      status
      is_public
      image_id
      vote {
        id
        ticket_id
        user_id
        upvote
      }
      user {
        id
        avatarUrl
        email
        displayName
      }
    }
  }
`;

const UPDATE_COMPLAINT_BY_PK = gql`
  mutation updateComplaintsByPk(
    $ticket_id: uuid!
    $title: String!
    $description: String!
    $category: String!
    $sub_category: String
    $is_public: Boolean
  ) {
    update_complaints_by_pk(
      pk_columns: { ticket_id: $ticket_id }
      _set: {
        category: $category
        description: $description
        is_public: $is_public
        sub_category: $sub_category
        title: $title
      }
    ) {
      created_at
      ticket_id
      title
      description
      category
      sub_category
      status
      is_public
      image_id
      vote {
        id
        ticket_id
        user_id
        upvote
      }
      user {
        id
        avatarUrl
        email
        displayName
      }
    }
  }
`;

const DELETE_COMPLAINT_BY_PK = gql`
  mutation deleteComplaintsByPk($ticket_id: uuid!) {
    delete_complaints_by_pk(ticket_id: $ticket_id) {
      created_at
      ticket_id
      title
      description
      category
      sub_category
      status
      is_public
      image_id
      vote {
        id
        ticket_id
        user_id
        upvote
      }
      user {
        id
        avatarUrl
        email
        displayName
      }
    }
  }
`;

// vote mutations
const INSERT_VOTE = gql`
  mutation insertVote($user_id: uuid!, $ticket_id: uuid, $upvote: Boolean!) {
    insert_vote_one(
      object: { user_id: $user_id, ticket_id: $ticket_id, upvote: $upvote }
    ) {
      user_id
      ticket_id
      upvote
    }
  }
`;

const UPDATE_VOTE = gql`
  mutation update_vote($id: uuid!, $upvote: Boolean!) {
    update_vote(where: { id: { _eq: $id } }, _set: { upvote: $upvote }) {
      affected_rows
    }
  }
`;

const DELETE_VOTE = gql`
  mutation delete_vote_by_pk($id: uuid!) {
    delete_vote_by_pk(id: $id) {
      id
      user_id
      ticket_id
      upvote
    }
  }
`;

const UPDATE_COMPLAINT_STATUS = gql`
  mutation update_status_by_complaint_pk($ticket_id: uuid!, $status: String) {
    update_complaints_by_pk(
      pk_columns: { ticket_id: $ticket_id }
      _set: { status: $status }
    ) {
      created_at
      ticket_id
      title
      description
      category
      sub_category
      status
      is_public
      image_id
      vote {
        id
        ticket_id
        user_id
        upvote
      }
    }
  }
`;

export {
  INSERT_COMPLAINT,
  DELETE_COMPLAINT_BY_PK,
  UPDATE_COMPLAINT_BY_PK,
  DELETE_VOTE,
  INSERT_VOTE,
  UPDATE_VOTE,
  UPDATE_COMPLAINT_STATUS,
};
