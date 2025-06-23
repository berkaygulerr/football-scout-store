import { useStore } from "@/store/useStore";
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

export default function PaginationComponent() {
  // Zustand store - çok basit!
  const {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    getFilteredPlayers,
    getTotalPages,
  } = useStore();

  const filteredPlayers = getFilteredPlayers();
  const totalPages = getTotalPages();
  const totalItems = filteredPlayers.length;

  if (totalItems === 0) return null;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Sayfa numaraları hesapla
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    
    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }
    
    return range.filter((page, index, arr) => 
      page !== arr[index - 1]
    );
  };

  const pageNumbers = getPageNumbers();

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGoToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetPageSize = (size: number) => {
    setPageSize(size);
  };

  return (
    <div className="space-y-4">
      {/* Mobil: Sadece sayfa bilgisi ve sayfa boyutu */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="order-2 sm:order-1">
          <span className="hidden sm:inline">
            {startIndex + 1}-{endIndex} / {totalItems} sonuç
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
          <Select value={pageSize.toString()} onValueChange={(value) => handleSetPageSize(Number(value))}>
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
                onClick={handlePrevPage}
                className={`flat-button h-8 px-2 sm:h-9 sm:px-3 ${!hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Önceki</span>
              </PaginationPrevious>
            </PaginationItem>

            {/* Desktop: Sayfa numaraları */}
            <div className="hidden sm:flex items-center gap-1">
              {pageNumbers[0] > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => handleGoToPage(1)}
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
                    onClick={() => handleGoToPage(page)}
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
                      onClick={() => handleGoToPage(totalPages)}
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
                    onClick={() => handleGoToPage(currentPage - 1)}
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
                    onClick={() => handleGoToPage(currentPage + 1)}
                    className="cursor-pointer flat-button h-8 w-8 text-xs"
                  >
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}
            </div>

            <PaginationItem>
              <PaginationNext 
                onClick={handleNextPage}
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