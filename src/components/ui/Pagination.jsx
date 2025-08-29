import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Button from "./Button";

const Pagination = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 12, 24, 48],
  loading = false,
  showPageSizeSelector = true,
  showInfo = true,
  className = "",
}) => {
  // Don't show pagination if there are no results
  if (totalElements === 0) return null;

  const startPage = Math.max(0, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages && !loading) {
      onPageChange(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    if (newSize !== pageSize && !loading && onPageSizeChange) {
      onPageSizeChange(parseInt(newSize));
    }
  };

  return (
    <div className={`mt-8 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6 ${className}`}>
      {/* Page Size Selector */}
      {showPageSizeSelector && onPageSizeChange && (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Show:
          </span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            disabled={loading}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        {/* First Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0 || loading}
          className="flex items-center space-x-1"
          title="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="hidden sm:inline">First</span>
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0 || loading}
          className="flex items-center space-x-1"
          title="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {startPage > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(0)}
                disabled={loading}
                className="px-3"
              >
                1
              </Button>
              {startPage > 1 && (
                <span className="text-gray-500 dark:text-gray-400 px-2">...</span>
              )}
            </>
          )}

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
            (pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
                className="px-3"
                title={`Go to page ${pageNum + 1}`}
              >
                {pageNum + 1}
              </Button>
            )
          )}

          {endPage < totalPages - 1 && (
            <>
              {endPage < totalPages - 2 && (
                <span className="text-gray-500 dark:text-gray-400 px-2">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={loading}
                className="px-3"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || loading}
          className="flex items-center space-x-1"
          title="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1 || loading}
          className="flex items-center space-x-1"
          title="Go to last page"
        >
          <span className="hidden sm:inline">Last</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Pagination Info */}
      {showInfo && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Showing {totalElements > 0 ? currentPage * pageSize + 1 : 0} to{" "}
          {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
          {totalElements} results
        </div>
      )}
    </div>
  );
};

export default Pagination;
