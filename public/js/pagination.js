/**
 * Pagination Module
 * Handles pagination functionality for search results.
 */

import { dom } from './dom.js';

// Pagination state.
let currentPage = 1;
let pageSize = 20;
let totalResults = 0;
let currentQuery = '';

/**
 * Initializes pagination.
 * @param {number} total - Total number of results.
 * @param {number} limit - Results per page.
 * @param {string} query - Current search query.
 */
export function initPagination(total, limit, query) {
    totalResults = total;
    pageSize = limit;
    currentQuery = query;
    currentPage = 1;
    renderPagination();
}

/**
 * Gets the current page number.
 * @returns {number} Current page number.
 */
export function getCurrentPage() {
    return currentPage;
}

/**
 * Gets the page size.
 * @returns {number} Page size.
 */
export function getPageSize() {
    return pageSize;
}

/**
 * Gets the total number of results.
 * @returns {number} Total results.
 */
export function getTotalResults() {
    return totalResults;
}

/**
 * Calculates total pages.
 * @returns {number} Total number of pages.
 */
function getTotalPages() {
    return Math.ceil(totalResults / pageSize);
}

/**
 * Renders pagination controls.
 */
function renderPagination() {
    if (!dom.paginationContainer) return;
    
    const totalPages = getTotalPages();
    
    if (totalPages <= 1) {
        dom.paginationContainer.innerHTML = '';
        return;
    }
    
    // Create pagination HTML.
    const paginationHTML = createPaginationHTML(totalPages);
    dom.paginationContainer.innerHTML = paginationHTML;
    
    // Attach event listeners.
    attachPaginationListeners();
}

/**
 * Creates pagination HTML.
 * @param {number} totalPages - Total number of pages.
 * @returns {string} Pagination HTML.
 */
function createPaginationHTML(totalPages) {
    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    const nextDisabled = currentPage >= totalPages ? 'disabled' : '';
    
    let pageButtons = '';
    
    // Calculate page range to display.
    const maxVisible = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    // Adjust start if we're near the end.
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    // First page button.
    if (startPage > 1) {
        pageButtons += `<button class="pagination-btn" data-page="1">1</button>`;
        if (startPage > 2) {
            pageButtons += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    // Page number buttons.
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        pageButtons += `<button class="pagination-btn ${activeClass}" data-page="${i}">${i}</button>`;
    }
    
    // Last page button.
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageButtons += `<span class="pagination-ellipsis">...</span>`;
        }
        pageButtons += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    return `
        <div class="pagination">
            <button class="pagination-btn pagination-prev ${prevDisabled}" data-action="prev" ${prevDisabled ? 'disabled' : ''}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                上一页
            </button>
            <div class="pagination-pages">
                ${pageButtons}
            </div>
            <button class="pagination-btn pagination-next ${nextDisabled}" data-action="next" ${nextDisabled ? 'disabled' : ''}>
                下一页
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    `;
}

/**
 * Attaches event listeners to pagination buttons.
 */
function attachPaginationListeners() {
    if (!dom.paginationContainer) return;
    
    const buttons = dom.paginationContainer.querySelectorAll('.pagination-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const action = btn.getAttribute('data-action');
            const page = btn.getAttribute('data-page');
            
            if (action === 'prev') {
                goToPage(currentPage - 1);
            } else if (action === 'next') {
                goToPage(currentPage + 1);
            } else if (page) {
                goToPage(parseInt(page, 10));
            }
        });
    });
}

/**
 * Goes to a specific page.
 * @param {number} page - Page number to go to.
 */
export function goToPage(page) {
    const totalPages = getTotalPages();
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderPagination();
    
    // Trigger search with new page.
    if (typeof window.handleSearchWithPage === 'function') {
        window.handleSearchWithPage(currentQuery, page);
    }
}

/**
 * Resets pagination.
 */
export function resetPagination() {
    currentPage = 1;
    totalResults = 0;
    currentQuery = '';
    if (dom.paginationContainer) {
        dom.paginationContainer.innerHTML = '';
    }
}

/**
 * Sets the current query for pagination.
 * @param {string} query - Current search query.
 */
export function setPaginationQuery(query) {
    currentQuery = query;
}

// Export function for search module.
window.setPaginationQuery = setPaginationQuery;

/**
 * Updates pagination info display.
 * @param {number} total - Total number of results.
 * @param {number} offset - Current offset.
 * @param {number} limit - Results per page.
 */
export function updatePaginationInfo(total, offset, limit) {
    totalResults = total;
    pageSize = limit;
    currentPage = Math.floor(offset / limit) + 1;
    currentQuery = currentQuery || ''; // Preserve current query
    
    // Update results count display.
    if (dom.resultsCount) {
        const start = offset + 1;
        const end = Math.min(offset + limit, total);
        dom.resultsCount.textContent = `显示 ${start}-${end} / 共 ${total} 条结果`;
    }
    
    renderPagination();
}


