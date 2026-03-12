/**
 * Generic Dropzone Configurator
 * Handles drag and drop events, file selection, and UI updates
 */
export function initDropzone(zoneId, inputId, onFileSelect, options = { multiple: false, accept: '*' }) {
    const dropZone = document.getElementById(zoneId);
    const fileInput = document.getElementById(inputId);
    
    if (!dropZone || !fileInput) return;

    if (options.multiple) {
        fileInput.setAttribute('multiple', '');
    }
    if (options.accept !== '*') {
        fileInput.setAttribute('accept', options.accept);
    }

    const triggerSelect = () => fileInput.click();

    dropZone.addEventListener('click', triggerSelect);
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }, false);

    // Handle selected files
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleFiles(files) {
        if (!files || files.length === 0) return;
        
        let fileList = Array.from(files);
        
        // Filter by accept if specified
        if (options.accept && options.accept !== '*') {
            const acceptedTypes = options.accept.split(',').map(t => t.trim());
            fileList = fileList.filter(file => {
                // simple extension check or mime check
                return acceptedTypes.some(type => {
                    if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type);
                    if (type.endsWith('/*')) return file.type.startsWith(type.replace('/*', ''));
                    return file.type === type;
                });
            });
            if (fileList.length !== files.length) {
                // Call a generic window method or dispatch event if invalid files
                console.warn("Some files were rejected due to invalid type.");
            }
        }

        if (!options.multiple && fileList.length > 0) {
            fileList = [fileList[0]];
        }

        if (fileList.length > 0) {
            onFileSelect(fileList);
        }
    }
}
