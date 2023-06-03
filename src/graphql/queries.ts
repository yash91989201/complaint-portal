import { gql } from "@apollo/client";

const GET_COMPLAINTS = gql`
  query get_complaints {
    complaints {
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

const GET_PUBLIC_COMPLAINTS = gql`
  query get_public_complaints {
    complaints(where: { is_public: { _eq: true } }) {
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

const GET_COMPLAINTS_BY_PK = gql`
  query get_complaints($ticket_id: uuid!) {
    complaints(where: { ticket_id: { _eq: $ticket_id } }) {
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

const GET_CATEGORY = gql`
  query get_category {
    category {
      category_id
      title
      description
    }
  }
`;

const GET_SUBCATEGORY = gql`
  query get_sub_category {
    sub_category {
      sub_category_id
      parent_category_id
      title
      description
    }
  }
`;

export {
  GET_COMPLAINTS,
  GET_CATEGORY,
  GET_SUBCATEGORY,
  GET_COMPLAINTS_BY_PK,
  GET_PUBLIC_COMPLAINTS,
};
