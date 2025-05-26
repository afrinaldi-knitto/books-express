import { prisma } from "../prisma";

export const getAllAuthors = async () => {
  const authors = await prisma.authors.findMany({
    select: { id: true, name: true, books: true },
  });
  return authors.map((author) => ({
    id: author.id,
    name: author.name,
    books: author.books?.map((book) => book.title) ?? null,
  }));
};

export const getAuthor = async (id: number) => {
  const author = await prisma.authors.findFirstOrThrow({
    where: { id },
    select: { id: true, name: true, books: true },
  });
  return {
    id: author.id,
    name: author.name,
    books: author.books?.map((book) => book.title) ?? null,
  };
};

export const createAuthor = async (name: string) => {
  const author = await prisma.authors.create({
    data: { name },
    select: { id: true, name: true, books: true },
  });
  return {
    id: author.id,
    name: author.name,
    books: author.books?.map((book) => book.title) ?? null,
  };
};

export const updateAuthor = async (id: number, name: string) => {
  return await prisma.authors.update({
    where: { id },
    data: { name },
  });
};

export const deleteAuthor = async (id: number) => {
  return await prisma.authors.delete({
    where: { id },
  });
};
