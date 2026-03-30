let currentGalleryData = {};
let currentTab = '';
let currentIndex = 0;

// This is the "Entry Point" called by index.html
function openGallery(projectData, defaultTab) {
    currentGalleryData = projectData;
    // Set the tab: use default if provided, otherwise grab the first key in the object
    currentTab = projectData[defaultTab] ? defaultTab : Object.keys(projectData)[0];
    currentIndex = 0;
    
    document.getElementById("galleryOverlay").style.display = "block";
    renderTabs(); // Build the buttons
    updateGallery(); // Show the first image
}

// This is the function that handles clicking a tab
function filterGallery(tabKey) {
    currentTab = tabKey;
    currentIndex = 0; // Reset to first image of the new category
    renderTabs();     // Redraw tabs to update the "active" CSS class
    updateGallery();  // Show the new image
}

function renderTabs() {
    const tabBar = document.querySelector('.tab-bar');
    tabBar.innerHTML = ''; // Clear existing buttons
    
    Object.keys(currentGalleryData).forEach(tabKey => {
        const btn = document.createElement('button');
        // If this is the active tab, give it the 'active' class for styling
        btn.className = `tab-link ${tabKey === currentTab ? 'active' : ''}`;
        
        // Make the button text look nice (e.g., "server" -> "Server")
        btn.innerText = tabKey.charAt(0).toUpperCase() + tabKey.slice(1);
        
        // Connect the click to our filter function
        btn.onclick = () => filterGallery(tabKey);
        
        tabBar.appendChild(btn);
    });
}

function updateGallery() {
    const imgElement = document.getElementById("mainGalleryImage");
    const captionElement = document.getElementById("imageCaption"); // Ensure this ID exists in HTML
    const images = currentGalleryData[currentTab];
    
    if (images && images.length > 0) {
        const currentData = images[currentIndex];
        
        // Update the Image
        imgElement.src = currentData.src;
        
        // Update the Caption
        captionElement.innerText = currentData.desc || ""; 
        
        // Update the Counter
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