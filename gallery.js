let currentGalleryData = {};
let currentTab = '';
let currentIndex = 0;

function openGallery(projectData, defaultTab) {
    currentGalleryData = projectData;
    currentTab = projectData[defaultTab] ? defaultTab : Object.keys(projectData)[0];
    currentIndex = 0;
    
    document.getElementById("galleryOverlay").style.display = "block";
    renderTabs();
    updateGallery();
}

function filterGallery(tabKey) {
    currentTab = tabKey;
    currentIndex = 0;
    renderTabs();
    updateGallery();
}

function renderTabs() {
    const tabBar = document.querySelector('.tab-bar');
    tabBar.innerHTML = '';
    
    Object.keys(currentGalleryData).forEach(tabKey => {
        const btn = document.createElement('button');
        btn.className = `tab-link ${tabKey === currentTab ? 'active' : ''}`;
        
        btn.innerText = tabKey.charAt(0).toUpperCase() + tabKey.slice(1);
        
        btn.onclick = () => filterGallery(tabKey);
        
        tabBar.appendChild(btn);
    });
}

function updateGallery() {
    const imgElement = document.getElementById("mainGalleryImage");
    const pdfElement = document.getElementById("pdfViewer");
    const captionElement = document.getElementById("imageCaption");
    const images = currentGalleryData[currentTab];
    
    if (images && images.length > 0) {
        const currentData = images[currentIndex];
        const isPDF = currentData.src.toLowerCase().endsWith('.pdf');
        
        if (isPDF) {
            pdfElement.src = currentData.src;
            pdfElement.style.display = "block";
            imgElement.style.display = "none";
        } else {
            imgElement.src = currentData.src;
            imgElement.style.display = "block";
            pdfElement.style.display = "none";
        }        
        captionElement.innerText = currentData.desc || ""; 
        
        document.getElementById("imageCounter").innerText = 
            `${currentTab.toUpperCase()}: ${currentIndex + 1} / ${images.length}`;
    }
}

function changeImage(step) {
    const images = currentGalleryData[currentTab];
    if (!images) return;

    currentIndex = (currentIndex + step + images.length) % images.length;
    updateGallery();
}

function closeGallery() {
    document.getElementById("galleryOverlay").style.display = "none";
}