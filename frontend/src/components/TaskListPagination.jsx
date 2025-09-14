import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const TaskListPagination = ({
  handleNext,
  handlePrev,
  handlePageChange,
  page,
  totalPages,
}) => {
  const generatePages = () => {
    const pages = [];

    if (totalPages <= 7) {
      // hiện hết toàn bộ
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // đầu danh sách
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      }
      // cuối danh sách
      else if (page >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      }
      // ở giữa
      else {
        pages.push(
          1,
          "...",
          page - 2,
          page - 1,
          page,
          page + 1,
          page + 2,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const pageToShow = generatePages();

  return (
    <div className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          {/* Trước */}
          <PaginationItem>
            <PaginationPrevious
              onClick={page === 1 ? undefined : handlePrev}
              className={cn(
                "cursor-pointer",
                page === 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>

          {/* Danh sách trang */}
          {pageToShow.map((p, index) => (
            <PaginationItem
              key={p === "..." ? `ellipsis-${index}` : p}>
              {p === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={p === page}
                  onClick={() => {
                    if (p !== page) handlePageChange(p);
                  }}
                  className="cursor-pointer">
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Sau */}
          <PaginationItem>
            <PaginationNext
              onClick={page === totalPages ? undefined : handleNext}
              className={cn(
                "cursor-pointer",
                page === totalPages &&
                  "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TaskListPagination;
