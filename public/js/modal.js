/**
 * Modal Dialog Module
 * Provides custom alert and confirm dialogs matching the project UI style.
 */

/**
 * Shows an alert dialog.
 * @param {string} message - The message to display.
 * @param {string} title - Optional title (default: '提示').
 * @returns {Promise<void>} Resolves when the dialog is closed.
 */
export function alert(message, title = '提示') {
    return new Promise((resolve) => {
        const modal = createModal(title, message, 'alert');
        const okBtn = modal.querySelector('.modal-btn-primary');
        
        okBtn.addEventListener('click', () => {
            closeModal(modal);
            resolve();
        });
        
        // Close on backdrop click.
        const backdrop = modal.querySelector('.modal-backdrop');
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal(modal);
                resolve();
            }
        });
        
        // Close on Escape key.
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal(modal);
                document.removeEventListener('keydown', handleEscape);
                resolve();
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        showModal(modal);
    });
}

/**
 * Shows a confirm dialog.
 * @param {string} message - The message to display.
 * @param {string} title - Optional title (default: '确认').
 * @returns {Promise<boolean>} Resolves to true if confirmed, false if cancelled.
 */
export function confirm(message, title = '确认') {
    return new Promise((resolve) => {
        const modal = createModal(title, message, 'confirm');
        const okBtn = modal.querySelector('.modal-btn-primary');
        const cancelBtn = modal.querySelector('.modal-btn-secondary');
        
        okBtn.addEventListener('click', () => {
            closeModal(modal);
            resolve(true);
        });
        
        cancelBtn.addEventListener('click', () => {
            closeModal(modal);
            resolve(false);
        });
        
        // Close on backdrop click (treat as cancel).
        const backdrop = modal.querySelector('.modal-backdrop');
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal(modal);
                resolve(false);
            }
        });
        
        // Close on Escape key (treat as cancel).
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal(modal);
                document.removeEventListener('keydown', handleEscape);
                resolve(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        showModal(modal);
    });
}

/**
 * Creates a modal dialog element.
 * @param {string} title - The modal title.
 * @param {string} message - The modal message.
 * @param {string} type - Modal type ('alert' or 'confirm').
 * @returns {HTMLElement} The modal element.
 */
function createModal(title, message, type) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    const dialog = document.createElement('div');
    dialog.className = 'modal-dialog';
    
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const titleEl = document.createElement('h3');
    titleEl.className = 'modal-title';
    titleEl.textContent = title;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;
    closeBtn.setAttribute('aria-label', 'Close');
    
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    const messageEl = document.createElement('p');
    messageEl.className = 'modal-message';
    // Preserve line breaks in message.
    messageEl.innerHTML = message.split('\n').map(line => {
        return line.trim() ? `<span>${line}</span>` : '<br>';
    }).join('');
    
    body.appendChild(messageEl);
    
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    
    if (type === 'confirm') {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'modal-btn modal-btn-secondary';
        cancelBtn.textContent = '取消';
        footer.appendChild(cancelBtn);
    }
    
    const okBtn = document.createElement('button');
    okBtn.className = 'modal-btn modal-btn-primary';
    okBtn.textContent = type === 'confirm' ? '确定' : '确定';
    footer.appendChild(okBtn);
    
    dialog.appendChild(header);
    dialog.appendChild(body);
    dialog.appendChild(footer);
    modal.appendChild(backdrop);
    modal.appendChild(dialog);
    
    // Close button handler - will be set up after modal is added to DOM.
    // Store type for later use.
    modal.dataset.modalType = type;
    
    return modal;
}

/**
 * Shows the modal dialog.
 * @param {HTMLElement} modal - The modal element.
 */
function showModal(modal) {
    document.body.appendChild(modal);
    
    // Set up close button handler after modal is in DOM.
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const type = modal.dataset.modalType;
            if (type === 'confirm') {
                // Trigger cancel for confirm dialogs.
                const cancelBtn = modal.querySelector('.modal-btn-secondary');
                if (cancelBtn) {
                    cancelBtn.click();
                }
            } else {
                // Trigger OK for alert dialogs.
                const okBtn = modal.querySelector('.modal-btn-primary');
                if (okBtn) {
                    okBtn.click();
                }
            }
        });
    }
    
    // Trigger animation by adding active class after a small delay.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modal.classList.add('modal-active');
        });
    });
}

/**
 * Closes the modal dialog.
 * @param {HTMLElement} modal - The modal element.
 */
function closeModal(modal) {
    modal.classList.remove('modal-active');
    // Remove from DOM after animation completes.
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

