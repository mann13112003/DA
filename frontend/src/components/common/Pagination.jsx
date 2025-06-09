import './Pagination.css';
const Pagination = ({currentPage,pageSize,totalItems,onPageChange}) => {
    const totalPages = Math.ceil(totalItems / pageSize);
 
    if (totalPages <= 1) return null;
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];

        for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
        range.push(i);
        }

        if (range[0] > 2) range.unshift("...");
        if (range[0] !== 1) range.unshift(1);
        if (range[range.length - 1] < totalPages - 1) range.push("...");
        if (range[range.length - 1] !== totalPages) range.push(totalPages);

        return range;
    };

    return (
        <div className="pagination" >
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous"
        >
            ←
        </button>

        {getPageNumbers().map((page, index) => (
            <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === "..."}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
            >
            {page}
            </button>
        ))}

        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next"
        >
            →
        </button>
        </div>
    );
}
export default Pagination;