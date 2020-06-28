import { state, mutation, update } from '@loona/react';
import gql from 'graphql-tag';

// Actions

export class AddBook {
  static mutation = gql`
    mutation addBook($title: String!) @client {
      addBook(title: $title)
    }
  `;

  constructor(private variables) {}
}

// GraphQL

export const allBooks = gql`
  query allBooks @client {
    books {
      id
      title
    }
  }
`;

export const recentBook = gql`
  query recentBook @client {
    recentBook {
      id
      title
    }
  }
`;

// State

@state({
  defaults: {
    books: [
      {
        id: Math.random()
          .toString(16)
          .substr(2),
        title: 'Harry Potter',
        __typename: 'Book',
      },
    ],
    recentBook: null,
  },
})
export class BooksState {
  @mutation(AddBook)
  addBook({ title }) {
    return {
      id: Math.random()
        .toString(16)
        .substr(2),
      title,
      __typename: 'Book',
    };
  }

  @update(AddBook)
  updateBooks(mutation, { patchQuery }) {
    patchQuery(allBooks, data => {
      data.books.push(mutation.result);
    });
  }

  @update(AddBook)
  setRecent(mutation, { patchQuery }) {
    patchQuery(recentBook, data => {
      data.recentBook = mutation.result;
    });
  }
}