import { BookPayload } from "../models/book";
import { prisma } from "../prisma";

export const findAllBooks = () => {
  return prisma.books.findMany({
    include: { authors: true },
  });
};

export const findBookById = (id: number) => {
  return prisma.books.findFirstOrThrow({
    where: {
      id: id,
    },
  });
};

export const createBook = (payload: BookPayload) => {
  const { title, author_id } = payload;
  return prisma.books.create({
    data: {
      title: title,
      author_id: author_id,
    },
  });
};

export const updateBook = (payload: {
  id: number;
  title?: string;
  author_id?: number | null;
}) => {
  const { id, title, author_id } = payload;
  return prisma.books.update({
    select: { title: true, authors: true },
    data: {
      title: title,
      author_id: author_id,
    },
    where: {
      id: id,
    },
  });
};

export const deleteBook = (id: number) => {
  return prisma.books.delete({
    where: {
      id: id,
    },
  });
};
