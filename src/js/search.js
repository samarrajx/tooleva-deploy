export async function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;

    let searchIndex = null;

    const performSearch = async (query) => {
        if (query.length === 0) {
            searchResults.classList.add('hidden');
            searchResults.innerHTML = '';
            return;
        }

        if (!searchIndex) {
            try {
                const response = await fetch('/search-index.json');
                searchIndex = await response.json();
            } catch (err) {
                console.error("Failed to load search index", err);
                return;
            }
        }

        const matches = searchIndex.filter(tool => {
            return tool.title.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query);
        }).slice(0, 8);

        if (matches.length > 0) {
            let html = matches.map(tool => `
                <a href="${tool.url}" class="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700 last:border-0 transition-colors text-left">
                    <div class="font-bold text-gray-900 dark:text-white mb-1">${tool.title}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate">${tool.description}</div>
                </a>
            `).join('');
            
            // Inject Ad at the bottom of results
            html += `
                <div class="block px-4 py-3 bg-gray-50 dark:bg-slate-800/80 border-t border-gray-100 dark:border-slate-700 text-center">
                    <span class="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-2 font-semibold">Advertisement</span>
                    <div class="h-[60px] w-full max-w-[468px] mx-auto bg-gray-200/50 dark:bg-slate-700/50 border border-dashed border-gray-300 dark:border-slate-600 rounded flex flex-col items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                        <span>Banner Ad Space</span>
                        <span class="opacity-70">(468x60)</span>
                    </div>
                </div>
            `;
            
            searchResults.innerHTML = html;
            searchResults.classList.remove('hidden');
        } else {
            searchResults.innerHTML = `
                <div class="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    No tools found matching "${query}"
                </div>
            `;
            searchResults.classList.remove('hidden');
        }
    };

    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value.toLowerCase().trim());
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstResult = searchResults.querySelector('a');
            if (firstResult) {
                window.location.href = firstResult.href;
            }
        }
    });

    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
             const firstResult = searchResults.querySelector('a');
             if (firstResult) {
                 window.location.href = firstResult.href;
             } else {
                 searchInput.focus();
             }
        });
    }

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });
}
