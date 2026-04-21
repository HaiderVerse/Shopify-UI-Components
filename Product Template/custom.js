document.addEventListener("DOMContentLoaded", function() {
    // Calculate and set dynamic height for shade selector wrappers
    function updateShadeSelectorHeights() {
        const wrappers = document.querySelectorAll('.product-shade-selector_wrapperShades');
        
        wrappers.forEach((wrapper) => {
            const selector = wrapper.querySelector('.product-shade-selector_shadesSelector');
            
            if (selector) {
                // Get the first item to calculate row height
                const firstItem = selector.querySelector('a, button');
                
                if (firstItem) {
                    const itemHeight = firstItem.offsetHeight;
                    const itemTop = firstItem.offsetTop;
                    
                    // Find items in the first row
                    let itemsInFirstRow = 1;
                    
                    // Count items in first row
                    for (let i = 1; i < selector.children.length; i++) {
                        const item = selector.children[i];
                        if (item.offsetTop === itemTop) {
                            itemsInFirstRow++;
                        } else {
                            break;
                        }
                    }
                    
                    // Calculate first row height (including gaps)
                    const firstRowHeight = itemHeight
                    
                    // Store full height for later expansion
                    const contentHeight = selector.scrollHeight;
                    wrapper.dataset.fullHeight = contentHeight;
                    wrapper.dataset.firstRowHeight = firstRowHeight;
                    
                    // Set initial height to show only first row
                    wrapper.style.height = firstRowHeight + 'px';
                }
            }
        });
    }
    
    // Handle shades count button click to expand/collapse
    const shadesCountButtons = document.querySelectorAll('.product-shade-selector_shadesCount');
    
    shadesCountButtons.forEach((button) => {
        // Store original text
        button.dataset.originalText = button.textContent;
        
        button.addEventListener('click', function() {
            // Find parent structure and the wrapper
            const shadesHeader = this.closest('.product-shade-selector_shadesHeader__brdn5');
            const wrapper = shadesHeader.nextElementSibling;
            if (wrapper && wrapper.classList.contains('product-shade-selector_wrapperShades')) {
                const isExpanded = wrapper.dataset.isExpanded === 'true';
                
                if (isExpanded) {
                    // Collapse to first row
                    wrapper.style.height = wrapper.dataset.firstRowHeight + 'px';
                    wrapper.dataset.isExpanded = 'false';
                    this.textContent = this.dataset.originalText;
                } else {
                    // Expand to show all
                    wrapper.style.height = wrapper.dataset.fullHeight + 'px';
                    wrapper.dataset.isExpanded = 'true';
                    this.textContent = "Show less";
                }
            }
        });
    });
    
    // Call on load and on window resize
    updateShadeSelectorHeights();
    window.addEventListener('resize', updateShadeSelectorHeights);
    
    // Handle disclosure button functionality
    const disclosureButtons = document.querySelectorAll('.product-more-info_disclosureButton');
    
    disclosureButtons.forEach((button) => {
        button.addEventListener('click', function() {
            
            // Find the next panel element (sibling)
            const panel = this.nextElementSibling;
            
            // Check if this panel is already open
            const isExpandedState = this.getAttribute('data-headlessui-state') === 'open';
            
            // Close all other panels
            disclosureButtons.forEach((otherButton) => {
                if (otherButton !== this) {
                    otherButton.setAttribute('aria-expanded', 'false');
                    otherButton.setAttribute('data-headlessui-state', '');
                    
                    const otherPanel = otherButton.nextElementSibling;
                    if (otherPanel && otherPanel.classList.contains('product-more-info_disclosurePanel')) {
                        otherPanel.setAttribute('data-headlessui-state', '');
                    }
                    
                    const otherIcon = otherButton.querySelector('.icon_iconContainer__lS_O1 svg');
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current button
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            this.setAttribute('data-headlessui-state', isExpanded ? '' : 'open');
            
            // Toggle the panel's data-headlessui-state attribute
            if (panel && panel.classList.contains('product-more-info_disclosurePanel')) {
                panel.setAttribute('data-headlessui-state', isExpanded ? '' : 'open');
            }
            
            // Rotate the icon
            const icon = this.querySelector('.icon_iconContainer__lS_O1 svg');
            if (icon) {
                icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    });
});