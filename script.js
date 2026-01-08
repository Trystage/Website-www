// Hide loading overlay when all resources are loaded
window.addEventListener('load', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
});

// Smooth scrolling behavior is handled by CSS (scroll-behavior: smooth)
// This event listener updates the active state of navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function () {
        // Update active navigation link
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
        
        // Close mobile menu if open (handled by another listener, but good to ensure)
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
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
    updateNavigationOnScroll();

    // Initialize Language
    initLanguage();

    // Initialize Theme
    initTheme();
});

// Translation Dictionary
const translations = {
    'zh': {
        'loading': '加载中...',
        'nav.home': '首页',
        'nav.developers': '开发者',
        'nav.gallery': '项目画廊',
        'nav.resources': '资源站',
        'hero.subtitle': '一个为创造与竞技而生的社区。',
        'hero.cta': '探索我们的服务器',
        'projects.title': '我们的服务器',
        'projects.ts.desc': '一个充满设计与未来感的小游戏服务器，对完整世界的挖掘与创新。',
        'projects.ts.feat1': '特殊游戏体验',
        'projects.ts.feat2': '内容更新极快',
        'projects.ts.feat3': '极高的可探索性',
        'projects.tbw.desc': '基于全球最大服务器 Hypixel 设计，提供专业的高质量起床战争体验。',
        'projects.tbw.feat1': '专业级竞技场',
        'projects.tbw.feat2': '中高延迟手感',
        'projects.tbw.feat3': '可靠的反作弊措施',
        'btn.details': '了解详情',
        'btn.copy_ip': '复制IP地址',
        'news.title': '最新新闻',
        'about.title': '关于我们',
        'about.p1': 'Trystage是一个致力于为所有人提供高质量体验的社区。我们专注于创造竞技和生活，提供各种有趣的玩法和活动。',
        'about.p2': '我们的团队由一群热爱游戏的开发者和设计师组成，致力于不断改进和创新，带来更好的体验。',
        'about.join': '加入我们，一起探索无限可能！',
        'footer.slogan': '为世界而诞生',
        'footer.community': '社区',
        'footer.forum': '论坛',
        'footer.qq_group': 'QQ群',
        'footer.resources': '资源',
        'footer.social': '社交',
        'footer.douyin': '抖音',
        'toast.copy': 'IP地址已复制！'
    },
    'en': {
        'loading': 'Loading...',
        'nav.home': 'Home',
        'nav.developers': 'Developers',
        'nav.gallery': 'Gallery',
        'nav.resources': 'Resources',
        'hero.subtitle': 'A community born for creation and competition.',
        'hero.cta': 'Explore Servers',
        'projects.title': 'Our Servers',
        'projects.ts.desc': 'A futuristic mini-game server focused on innovation and world exploration.',
        'projects.ts.feat1': 'Unique Gameplay',
        'projects.ts.feat2': 'Fast Updates',
        'projects.ts.feat3': 'High Explorability',
        'projects.tbw.desc': 'Based on Hypixel, providing professional high-quality Bedwars experience.',
        'projects.tbw.feat1': 'Pro Arenas',
        'projects.tbw.feat2': 'Optimized Latency',
        'projects.tbw.feat3': 'Reliable Anti-Cheat',
        'btn.details': 'Details',
        'btn.copy_ip': 'Copy IP',
        'news.title': 'Latest News',
        'about.title': 'About Us',
        'about.p1': 'Trystage is a community dedicated to providing high-quality experiences for everyone. We focus on creative competition and lifestyle.',
        'about.p2': 'Our team consists of passionate developers and designers committed to continuous improvement and innovation.',
        'about.join': 'Join us and explore infinite possibilities!',
        'footer.slogan': 'Born for the World',
        'footer.community': 'Community',
        'footer.forum': 'Forum',
        'footer.qq_group': 'QQ Group',
        'footer.resources': 'Resources',
        'footer.social': 'Social',
        'footer.douyin': 'TikTok (Douyin)',
        'toast.copy': 'IP Address Copied!'
    }
};

let currentLang = localStorage.getItem('lang') || 'zh';
let currentTheme = localStorage.getItem('theme') || 'dark';

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Apply initial theme
    applyTheme(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme);
    });
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.querySelector('.sun-icon').style.display = 'none';
        document.querySelector('.moon-icon').style.display = 'block';
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.querySelector('.sun-icon').style.display = 'block';
        document.querySelector('.moon-icon').style.display = 'none';
    }
}

function initLanguage() {
    const langToggle = document.getElementById('lang-toggle');
    
    // Apply initial language
    applyLanguage(currentLang);
    
    // Update button text
    updateLangButton(langToggle);

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('lang', currentLang);
        applyLanguage(currentLang);
        updateLangButton(langToggle);
    });
}

function updateLangButton(btn) {
    btn.textContent = currentLang === 'zh' ? 'EN' : 'CN';
}

function applyLanguage(lang) {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}


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
        typingText.style.borderRight = '0.15em solid #00f3ff';
        setTimeout(() => {
            typingText.style.borderRight = 'none';
        }, 500);
    }
};

// Start typing effect after a short delay
setTimeout(typing, 500);

// Use IntersectionObserver for navigation highlighting to improve performance
function updateNavigationOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('nav ul li a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the section is visible
    });

    document.querySelectorAll('main section').forEach(section => {
        observer.observe(section);
    });
}
