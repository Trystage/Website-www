// Hide loading overlay when all resources are loaded
window.addEventListener('load', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        // Custom smooth scrolling with easing function
        const targetPosition = targetElement.offsetTop - 70; // Adjust for fixed header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        // Easing function for smooth animation
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
        
        // Update active navigation link
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
        
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-menu li a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Simple markdown parser
function parseMarkdown(markdown) {
    // Convert headers
    markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    markdown = markdown.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    
    // Convert bold text
    markdown = markdown.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    
    // Convert italic text
    markdown = markdown.replace(/\*(.*)\*/gim, '<em>$1</em>');
    
    // Convert paragraphs
    markdown = markdown.replace(/\n\n/gim, '</p><p>');
    markdown = '<p>' + markdown + '</p>';
    
    // Remove extra paragraph tags
    markdown = markdown.replace('<p></p>', '');
    
    return markdown;
}

// Load news files
async function loadNews() {
    const newsContainer = document.getElementById('news-container');
    
    // Check if news container exists
    if (!newsContainer) {
        console.error('News container not found');
        return Promise.resolve(); // Return a resolved promise
    }
    
    try {
        // Clear existing content
        newsContainer.innerHTML = '';
        
        // Load all markdown files from the news directory
        // Show all news items on both desktop and mobile
        const newsFiles = ['news1.md', 'news2.md', 'news3.md']; // Add more files as needed
        
        // Create news boxes for the scrolling effect
        const newsBoxes = [];
        
        for (const file of newsFiles) {
            const response = await fetch(`news/${file}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${file}`);
            }
            
            let content = await response.text();
            
            // Extract title (first # heading)
            const titleMatch = content.match(/^# (.+)$/m);
            const title = titleMatch ? titleMatch[1] : '无标题';
            
            // Extract date (line starting with "发布时间：")
            const dateMatch = content.match(/^发布时间：(.+)$/m);
            const date = dateMatch ? dateMatch[1] : '';
            
            // Remove title and date from content
            content = content.replace(/^# .+$/m, ''); // Remove title line
            content = content.replace(/发布时间：.+$/m, ''); // Remove date line
            content = content.trim(); // Remove leading/trailing whitespace
            
            // Create news box
            const newsBox = document.createElement('div');
            newsBox.className = 'news-box';
            newsBox.innerHTML = `
                <h3>${title}</h3>
                <div class="news-content styled-content">${parseMarkdown(content)}</div>
                ${date ? `<div class="news-date">发布时间：${date}</div>` : ''}
            `;
            newsBoxes.push(newsBox);
        }
        
        // Append news boxes once for static display
        newsBoxes.forEach(box => {
            newsContainer.appendChild(box.cloneNode(true));
        });
        
        // Return a resolved promise
        return Promise.resolve();
    } catch (error) {
        console.error('Error loading news:', error);
        newsContainer.innerHTML = '<p>无法加载新闻内容。</p>';
        return Promise.reject(error);
    }
}

// Load news when page loads
// Removed to prevent duplicate loading

// Copy IP address functionality
document.querySelectorAll('.copy-ip').forEach(button => {
    button.addEventListener('click', function() {
        const ip = this.getAttribute('data-ip');
        
        // Create temporary textarea to copy text
        const textarea = document.createElement('textarea');
        textarea.value = ip;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Show toast notification
        const toast = document.getElementById('toast');
        toast.textContent = 'IP地址已复制！';
        toast.classList.add('show');
        
        // Hide toast after 2 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    });
});

// Scroll animations for project cards and news boxes
// We need to wait for the news to be loaded before we can observe them
function initScrollAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    const newsBoxes = document.querySelectorAll('.news-box');
    const aboutSection = document.querySelector('#about');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate class to trigger transition
                entry.target.classList.add('animate');
            } else {
                // Remove animate class when element is not in viewport
                entry.target.classList.remove('animate');
            }
        });
    }, {
        threshold: 0.1
    });
    
    projectCards.forEach(card => {
        observer.observe(card);
    });
    
    // Apply same animation to news boxes
    newsBoxes.forEach(box => {
        observer.observe(box);
    });
    
    // Apply animation to about section
    if (aboutSection) {
        observer.observe(aboutSection);
    }
}

// Initialize scroll animations after news is loaded
document.addEventListener('DOMContentLoaded', () => {
    // For project cards, we can initialize immediately
    initScrollAnimations();
    
    // Set initial active navigation link
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        
        if (window.pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// For news boxes, we need to wait for them to be loaded
// We'll call initScrollAnimations again after news is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadNews().then(() => {
        // Reinitialize scroll animations to include news boxes
        initScrollAnimations();
    });
});

// Enhanced typing effect for hero section
const typingText = document.querySelector('.typing-text');
const text = typingText.textContent;
typingText.textContent = '';

let i = 0;
const typing = () => {
    if (i < text.length) {
        typingText.textContent += text.charAt(i);
        i++;
        setTimeout(typing, 150);
    } else {
        // Add blinking cursor
        typingText.style.borderRight = '0.15em solid #00BFFF';
        setTimeout(() => {
            typingText.style.borderRight = 'none';
        }, 500);
    }
};

// Start typing effect after a short delay
setTimeout(typing, 500);

// Auto scroll to next section on scroll (page flip effect)
let isScrolling = false;
let scrollTimeout;

// Function to scroll to a specific section
function scrollToSection(index) {
    const sections = document.querySelectorAll('main section');
    if (index >= 0 && index < sections.length) {
        isScrolling = true;
        const targetTop = sections[index].offsetTop - 70; // Adjust for fixed header
        
        // Use custom smooth scrolling for better control
        const startPosition = window.pageYOffset;
        const distance = targetTop - startPosition;
        const duration = 150; // milliseconds
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
            else {
                isScrolling = false;
            }
        }
        
        // Easing function for smooth animation
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
        
        // Clear any existing timeout
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        // Set a timeout to ensure isScrolling is reset even if animation is interrupted
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, duration + 100);
    }
}

// Improved section detection
function getCurrentSectionIndex() {
    const sections = document.querySelectorAll('main section');
    let currentSectionIndex = 0;
    
    // Find the section that takes up the most space in the viewport
    let maxVisibleHeight = 0;
    
    for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate visible height of section in viewport
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            currentSectionIndex = i;
        }
    }
    
    return currentSectionIndex;
}

// Improved scroll position detection for navigation links
function updateNavigationOnScroll() {
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.pageYOffset + window.innerHeight / 2;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Scroll with mouse wheel - with debouncing
let wheelTimeout;
window.addEventListener('wheel', (e) => {
    // Prevent default scrolling behavior completely
    e.preventDefault();
    
    if (isScrolling) return;
    
    // Debounce wheel events
    if (wheelTimeout) clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        const sections = document.querySelectorAll('main section');
        const currentSectionIndex = getCurrentSectionIndex();
        
        // Determine the next section based on scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextSectionIndex = currentSectionIndex + direction;
        
        // Scroll to the next section if it exists
        scrollToSection(nextSectionIndex);
    }, 50); // 50ms debounce
}, { passive: false }); // Disable passive event listener to allow preventDefault

// Scroll with arrow keys
window.addEventListener('keydown', (e) => {
    if (isScrolling) return;
    
    // Only handle arrow keys
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    
    const sections = document.querySelectorAll('main section');
    const currentSectionIndex = getCurrentSectionIndex();
    
    // Determine the next section based on key pressed
    let nextSectionIndex = currentSectionIndex;
    if (e.key === 'ArrowDown') {
        nextSectionIndex = currentSectionIndex + 1;
    } else if (e.key === 'ArrowUp') {
        nextSectionIndex = currentSectionIndex - 1;
    }
    
    // Scroll to the next section if it exists
    scrollToSection(nextSectionIndex);
    
    // Prevent default behavior for arrow keys
    e.preventDefault();
});

// Update active navigation link based on scroll position
window.addEventListener('scroll', () => {
    updateNavigationOnScroll();
});

let currentOpenDrawer = null;

document.addEventListener('click', function(e) {
    const drawers = document.querySelectorAll('.qq-drawer, .wiki-drawer');
    let shouldCloseAll = true;
    
    drawers.forEach(drawer => {
        if (drawer.contains(e.target)) {
            shouldCloseAll = false;
        }
    });
    
    if (shouldCloseAll && currentOpenDrawer) {
        currentOpenDrawer.classList.remove('show');
        currentOpenDrawer.style.pointerEvents = 'none';
        currentOpenDrawer = null;
    }
});

// QQ Drawer functionality
document.addEventListener('DOMContentLoaded', function() {
    const qqDrawer = document.querySelector('.qq-drawer');
    const qqDrawerToggle = document.querySelector('.qq-drawer-toggle');
    const qqDrawerContent = document.querySelector('.qq-drawer-content');
    
    if (qqDrawer && qqDrawerToggle && qqDrawerContent) {
        qqDrawerContent.style.display = 'block';
        qqDrawerContent.classList.remove('show');
        
        qqDrawerToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (qqDrawerContent.classList.contains('show')) {
                qqDrawerContent.classList.remove('show');
                    currentOpenDrawer = null;
            } else {
                if (currentOpenDrawer && currentOpenDrawer !== qqDrawerContent) {
                    currentOpenDrawer.classList.remove('show');
                }
                
                qqDrawerContent.classList.add('show');
                currentOpenDrawer = qqDrawerContent;
            }
        });
    }
});

// Wiki Drawer functionality
document.addEventListener('DOMContentLoaded', function() {
    const wikiDrawer = document.querySelector('.wiki-drawer');
    const wikiDrawerToggle = document.querySelector('.wiki-drawer-toggle');
    const wikiDrawerContent = document.querySelector('.wiki-drawer-content');
    
    if (wikiDrawer && wikiDrawerToggle && wikiDrawerContent) {
        wikiDrawerContent.style.display = 'block';
        wikiDrawerContent.classList.remove('show');
        
        wikiDrawerToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (wikiDrawerContent.classList.contains('show')) {
                wikiDrawerContent.classList.remove('show');
                currentOpenDrawer = null;
            } else {
                if (currentOpenDrawer && currentOpenDrawer !== wikiDrawerContent) {
                    currentOpenDrawer.classList.remove('show');
                }
                
                wikiDrawerContent.classList.add('show');
                currentOpenDrawer = wikiDrawerContent;
            }
        });
    }
});