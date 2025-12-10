import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({
  currentPage,
  totalPages,
  perPage,
  setCurrentPage,
  nextPage,
  previousPage,
}) => {
  console.log("currentPage", currentPage);
  console.log("totalPages", totalPages);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPages / perPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination className="mt-3">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={previousPage}
            className="cursor-pointer"
          />
        </PaginationItem>
        {pageNumbers?.map((page) => {
          if (page === Number(currentPage)) {
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          } else {
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          }
        })}

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={nextPage} className="cursor-pointer" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
