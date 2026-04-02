let currentGalleryData = {};
let currentTab = '';
let currentIndex = 0;
let isInlineLightbox = false;
let tocHeadings = [];
let tocLinks = [];
let tocLinkById = new Map();
let tocScrollTicking = false;
let projectCards = [];
let activeBackgroundCardIndex = -1;
let defaultBgAccentA = '';
let defaultBgAccentB = '';
let defaultBgBase = '';

function openGallery(projectData, defaultTab) {
    currentGalleryData = projectData;
    currentTab = projectData[defaultTab] ? defaultTab : Object.keys(projectData)[0];
    currentIndex = 0;
    
    document.getElementById("galleryOverlay").style.display = "block";
    renderTabs();
    updateGallery();
}

function openImageLightbox(src, desc) {
    isInlineLightbox = true;
    openGallery({ preview: [{ src, desc }] }, 'preview');
}

function filterGallery(tabKey) {
    currentTab = tabKey;
    currentIndex = 0;
    renderTabs();
    updateGallery();
}

function renderTabs() {
    const tabBar = document.querySelector('.tab-bar');
    if (!tabBar) return;
    tabBar.innerHTML = '';

    if (isInlineLightbox) {
        tabBar.style.display = 'none';
        return;
    }

    tabBar.style.display = 'flex';
    
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
    const controls = document.querySelector('.gallery-controls');
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

        if (controls) {
            controls.style.display = isInlineLightbox ? 'none' : 'block';
        }

        document.getElementById("imageCounter").innerText =
            isInlineLightbox
                ? ""
                : `${currentTab.toUpperCase()}: ${currentIndex + 1} / ${images.length}`;
    }
}

function changeImage(step) {
    const images = currentGalleryData[currentTab];
    if (!images) return;

    currentIndex = (currentIndex + step + images.length) % images.length;
    updateGallery();
}

function closeGallery() {
    isInlineLightbox = false;
    document.getElementById("galleryOverlay").style.display = "none";
}

function getProjectItems(projectKey, tabList) {
    if (!window.allProjectData || !window.allProjectData[projectKey]) return [];

    const projectData = window.allProjectData[projectKey];
    const tabs = tabList
        ? tabList.split(',').map((t) => t.trim()).filter(Boolean)
        : Object.keys(projectData);

    const items = [];
    tabs.forEach((tab) => {
        const section = projectData[tab] || [];
        section.forEach((entry) => {
            if (!entry.src.toLowerCase().endsWith('.pdf')) {
                items.push({ ...entry, tab });
            }
        });
    });

    return items;
}

function renderInlineGallery(galleryNode) {
    const projectKey = galleryNode.dataset.project;
    const tabList = galleryNode.dataset.tabs;
    const items = getProjectItems(projectKey, tabList);

    if (!items.length) {
        galleryNode.innerHTML = '<p>Gallery content is on the way.</p>';
        return;
    }

    let activeIndex = 0;

    const featured = document.createElement('div');
    featured.className = 'featured-media';

    const featuredImg = document.createElement('img');
    featuredImg.alt = 'Project visual';
    featuredImg.className = 'featured-media-image';

    const featuredCaption = document.createElement('p');
    featuredCaption.className = 'featured-caption';

    const thumbs = document.createElement('div');
    thumbs.className = 'thumb-strip';

    function renderFeatured(index) {
        const item = items[index];
        featuredImg.src = item.src;
        featuredCaption.innerText = item.desc || '';
        featuredImg.onclick = () => openImageLightbox(item.src, item.desc || '');

        thumbs.querySelectorAll('button').forEach((btn, idx) => {
            btn.classList.toggle('active', idx === index);
        });
    }

    items.forEach((item, idx) => {
        const thumbBtn = document.createElement('button');
        thumbBtn.type = 'button';
        thumbBtn.className = 'thumb-button';
        thumbBtn.setAttribute('aria-label', `View ${projectKey} image ${idx + 1}`);

        const thumbImg = document.createElement('img');
        thumbImg.src = item.src;
        thumbImg.alt = item.desc ? item.desc.slice(0, 80) : 'Gallery thumbnail';

        thumbBtn.onclick = () => {
            activeIndex = idx;
            renderFeatured(activeIndex);
        };

        thumbBtn.appendChild(thumbImg);
        thumbs.appendChild(thumbBtn);
    });

    featured.appendChild(featuredImg);
    featured.appendChild(featuredCaption);

    galleryNode.innerHTML = '';
    galleryNode.appendChild(featured);
    galleryNode.appendChild(thumbs);

    renderFeatured(activeIndex);
}

function renderDocLinks(targetId, projectKey, tabKey) {
    const container = document.getElementById(targetId);
    if (!container) return;

    const docs = window.allProjectData?.[projectKey]?.[tabKey] || [];
    container.innerHTML = '';

    docs.forEach((doc) => {
        const link = document.createElement('a');
        link.href = doc.src;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'doc-link';
        link.innerText = doc.desc || 'Open document';
        container.appendChild(link);
    });
}

function slugifyHeading(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function ensureHeadingIds(headings) {
    const used = new Set();
    headings.forEach((heading) => {
        let baseId = heading.id || slugifyHeading(heading.innerText || 'section');
        if (!baseId) baseId = 'section';

        let uniqueId = baseId;
        let index = 2;
        while (used.has(uniqueId) || (document.getElementById(uniqueId) && document.getElementById(uniqueId) !== heading)) {
            uniqueId = `${baseId}-${index}`;
            index += 1;
        }

        heading.id = uniqueId;
        used.add(uniqueId);
    });
}

function setActiveTocLink(id) {
    if (!id || !tocLinkById.has(id)) return;
    tocLinks.forEach((link) => link.classList.remove('active'));
    tocLinkById.get(id).classList.add('active');
}

function setPageBackgroundAccent(accentA, accentB, baseBg = defaultBgBase) {
    const root = document.documentElement;
    root.style.setProperty('--bg-accent-a', accentA);
    root.style.setProperty('--bg-accent-b', accentB);
    root.style.setProperty('--bg', baseBg);
}

function applyBackgroundFromCard(card) {
    if (!card) {
        if (activeBackgroundCardIndex !== -1) {
            setPageBackgroundAccent(defaultBgAccentA, defaultBgAccentB, defaultBgBase);
            activeBackgroundCardIndex = -1;
        }
        return;
    }

    const cardIndex = projectCards.indexOf(card);
    if (cardIndex === activeBackgroundCardIndex) return;

    activeBackgroundCardIndex = cardIndex;
    const accentA = card.dataset.bgA || defaultBgAccentA;
    const accentB = card.dataset.bgB || defaultBgAccentB;
    const baseBg = card.dataset.bgBase || defaultBgBase;
    setPageBackgroundAccent(accentA, accentB, baseBg);
}

function updateTocActiveByScroll() {
    if (!tocHeadings.length) return;

    const anchorY = window.scrollY + Math.round(window.innerHeight * 0.28);
    let activeHeading = tocHeadings[0];

    for (let i = 0; i < tocHeadings.length; i += 1) {
        const heading = tocHeadings[i];
        const headingTop = heading.getBoundingClientRect().top + window.scrollY;
        if (headingTop <= anchorY) {
            activeHeading = heading;
        } else {
            break;
        }
    }

    setActiveTocLink(activeHeading.id);

    // Background gradient follows the same active heading: find its parent card and apply its colors
    const activeCard = activeHeading.closest('.project-card');
    applyBackgroundFromCard(activeCard);
}

function requestTocActiveUpdate() {
    if (tocScrollTicking) return;
    tocScrollTicking = true;
    window.requestAnimationFrame(() => {
        updateTocActiveByScroll();
        tocScrollTicking = false;
    });
}

function buildTableOfContents() {
    const tocList = document.getElementById('tocList');
    const contentRoot = document.getElementById('mainContent');
    if (!tocList || !contentRoot) return;

    const useDetailedToc = window.matchMedia('(min-width: 1101px)').matches;
    const headingSelector = useDetailedToc ? 'h2, h3' : 'h2';

    const headings = Array.from(contentRoot.querySelectorAll(headingSelector))
        .filter((heading) => heading.innerText && heading.innerText.trim().length > 0);

    if (!headings.length) {
        tocList.innerHTML = '';
        tocHeadings = [];
        tocLinks = [];
        tocLinkById = new Map();
        return;
    }

    ensureHeadingIds(headings);
    tocList.innerHTML = '';

    headings.forEach((heading) => {
        const item = document.createElement('li');
        item.className = `toc-level-${heading.tagName.toLowerCase()}`;

        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.innerText = heading.innerText.trim();

        item.appendChild(link);
        tocList.appendChild(item);
    });

    tocHeadings = headings;
    tocLinks = Array.from(tocList.querySelectorAll('a'));
    tocLinkById = new Map(tocLinks.map((link) => [link.getAttribute('href')?.slice(1), link]));

    requestTocActiveUpdate();
}

function syncTocVerticalAnchor() {
    const toc = document.getElementById('tocNav');
    const firstCard = document.querySelector('#projects .project-card');
    if (!toc || !firstCard) return;

    const isWide = window.matchMedia('(min-width: 1841px)').matches;
    if (!isWide) {
        toc.style.top = '';
        return;
    }

    // Align fixed TOC with where the first card sits when the page is at scroll top.
    const cardDocumentTop = firstCard.getBoundingClientRect().top + window.scrollY;
    const anchoredTop = Math.max(16, Math.round(cardDocumentTop));
    toc.style.top = `${anchoredTop}px`;
}

document.addEventListener('DOMContentLoaded', () => {
    const rootStyles = window.getComputedStyle(document.documentElement);
    defaultBgAccentA = rootStyles.getPropertyValue('--bg-accent-a').trim() || '#ffe8d4';
    defaultBgAccentB = rootStyles.getPropertyValue('--bg-accent-b').trim() || '#fff0db';
    defaultBgBase = rootStyles.getPropertyValue('--bg').trim() || '#fffaf3';
    projectCards = Array.from(document.querySelectorAll('#projects .project-card'));

    document.querySelectorAll('.inline-gallery').forEach(renderInlineGallery);
    renderDocLinks('tactileDocLinks', 'tactileSoft', 'documentation');
    buildTableOfContents();
    syncTocVerticalAnchor();
    requestTocActiveUpdate();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            buildTableOfContents();
            syncTocVerticalAnchor();
            requestTocActiveUpdate();
        }, 140);
    });

    window.addEventListener('load', syncTocVerticalAnchor);
    window.addEventListener('scroll', requestTocActiveUpdate, { passive: true });
});