export const usePagination = (page, totalPages) => {
  const safeTotalPages = Math.max(totalPages, 1);

  let startPage = Math.max(1, page - 1);
  let endPage = Math.min(safeTotalPages, startPage + 2);

  if (endPage - startPage < 2) {
    startPage = Math.max(1, endPage - 2);
  }

  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
};
