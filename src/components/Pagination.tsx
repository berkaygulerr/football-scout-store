import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  getPageNumbers: () => number[];
}

export default function PaginationComponent({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  startIndex,
  endIndex,
  hasNextPage,
  hasPrevPage,
  goToPage,
  nextPage,
  prevPage,
  setPageSize,
  getPageNumbers,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-4">
      {/* Mobil: Sadece sayfa bilgisi ve sayfa boyutu */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="order-2 sm:order-1">
          <span className="hidden sm:inline">
            {startIndex + 1}-{Math.min(endIndex, totalItems)} / {totalItems} sonuç
          </span>
          <span className="sm:hidden">
            {totalItems} sonuç
          </span>
        </div>
        
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Label htmlFor="pageSize" className="text-xs sm:text-sm whitespace-nowrap">
            <span className="hidden sm:inline">Sayfa başına:</span>
            <span className="sm:hidden">Sayfa:</span>
          </Label>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger id="pageSize" className="w-16 sm:w-20 flat-input text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="flat-card">
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
              <SelectItem value="96">96</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navigation - Mobil optimized */}
      <div className="flex items-center justify-center">
        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious 
                onClick={prevPage}
                className={`flat-button h-8 px-2 sm:h-9 sm:px-3 ${!hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Önceki</span>
              </PaginationPrevious>
            </PaginationItem>

            {/* Mobilde daha az sayfa göster */}
            <div className="hidden sm:flex items-center gap-1">
              {pageNumbers[0] > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => goToPage(1)}
                      className="cursor-pointer flat-button"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {pageNumbers[0] > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}

              {pageNumbers.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => goToPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer flat-button"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => goToPage(totalPages)}
                      className="cursor-pointer flat-button"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
            </div>

            {/* Mobil: Sadece mevcut sayfa */}
            <div className="flex sm:hidden items-center gap-1">
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => goToPage(currentPage - 1)}
                    className="cursor-pointer flat-button h-8 w-8 text-xs"
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationLink
                  isActive={true}
                  className="flat-button h-8 w-8 text-xs"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => goToPage(currentPage + 1)}
                    className="cursor-pointer flat-button h-8 w-8 text-xs"
                  >
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}
            </div>

            <PaginationItem>
              <PaginationNext 
                onClick={nextPage}
                className={`flat-button h-8 px-2 sm:h-9 sm:px-3 ${!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
              >
                <span className="hidden sm:inline mr-1">Sonraki</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Mobil: Sayfa bilgisi alt kısımda */}
      <div className="sm:hidden text-center text-xs text-muted-foreground">
        Sayfa {currentPage} / {totalPages}
      </div>
    </div>
  );
} 