// Main App JavaScript
class CyberpunkBlog {
    constructor() {
        this.blogPosts = [];
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadBlogData();
        this.setupEventListeners();
        this.renderBlogPosts();
        this.setupScrollAnimations();
    }

    async loadBlogData() {
        try {
            // 在 GitHub Pages 或其他 HTTP 服務器上，這會正常工作
            const response = await fetch('blog_posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.blogPosts = data.blogPosts.map(post => ({
                ...post,
                category: this.categorizePost(post.title, post.content)
            }));
            console.log(`✅ 成功載入 ${this.blogPosts.length} 篇文章`);
        } catch (error) {
            console.warn('JSON 載入失敗，使用備選數據:', error.message);
            // 使用內嵌數據作為備選方案（本地開發時）
            this.loadFallbackData();
            
            // 只在本地 file:// 協議時顯示提示
            if (window.location.protocol === 'file:') {
                this.showLocalDevTip();
            }
        }
    }

    loadFallbackData() {
        console.log('📦 載入備選數據...');
        // 使用內嵌的完整數據
        if (window.BLOG_POSTS_DATA && window.BLOG_POSTS_DATA.blogPosts) {
            this.blogPosts = window.BLOG_POSTS_DATA.blogPosts.map(post => ({
                ...post,
                category: this.categorizePost(post.title, post.content)
            }));
            console.log(`✅ 從備選數據載入 ${this.blogPosts.length} 篇文章`);
        } else {
            console.warn('⚠️ 備選數據不可用，使用示例數據');
            // 基本示例數據
            const exampleData = {
                "blogPosts": [
                    {
                        "date": "2025年7月14日",
                        "title": "🚀 歡迎來到 Cyberpunk Blog",
                        "content": "<p>這是一個使用 Cyberpunk 風格設計的技術部落格。</p><p>🎯 <strong>部署到 GitHub Pages 後，所有功能都會正常運作！</strong></p><p>目前您看到的是本地預覽版本。</p>",
                        "images": []
                    },
                    {
                        "date": "2025年7月14日", 
                        "title": "📡 GitHub Pages 部署指南",
                        "content": "<h3>快速部署步驟：</h3><ol><li>推送代碼到 GitHub</li><li>在倉庫設置中啟用 Pages</li><li>選擇 main 分支作為來源</li><li>等待幾分鐘完成部署</li></ol><p>✨ 部署後在 <code>https://garzlolz.github.io/blog</code> 訪問</p>",
                        "images": []
                    }
                ]
            };
            
            this.blogPosts = exampleData.blogPosts.map(post => ({
                ...post,
                category: this.categorizePost(post.title, post.content)
            }));
        }
    }

    showLocalDevTip() {
        // 檢查是否已經顯示過提示
        if (sessionStorage.getItem('localDevTipShown') === 'true') {
            return;
        }
        
        setTimeout(() => {
            const tip = document.getElementById('cors-notice');
            if (tip) {
                tip.style.display = 'flex';
                sessionStorage.setItem('localDevTipShown', 'true');
            }
        }, 3000);
    }

    categorizePost(title, content) {
        const techKeywords = ['.net', 'c#', 'javascript', 'vue', 'api', 'ef core', 'jwt', 'iis', 'ajax', 'sql'];
        const workKeywords = ['工作', '面試', '上班', '公司', '職位', '薪水'];
        const lifeKeywords = ['北漂', '租房', '開刀', '畢業', '專題'];

        const lowerTitle = title.toLowerCase();
        const lowerContent = content.toLowerCase();
        const searchText = lowerTitle + ' ' + lowerContent;

        if (techKeywords.some(keyword => searchText.includes(keyword))) {
            return 'tech';
        } else if (workKeywords.some(keyword => searchText.includes(keyword))) {
            return 'work';
        } else if (lifeKeywords.some(keyword => searchText.includes(keyword))) {
            return 'life';
        }
        return 'life'; // default category
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('DOMContentLoaded', () => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (hamburger && navMenu) {
                hamburger.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                });
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.currentPage = 1;
                this.renderBlogPosts();
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.renderBlogPosts(true);
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('blog-modal');
            if (e.target === modal) {
                this.closeBlogModal();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeBlogModal();
            }
        });
    }

    getFilteredPosts() {
        if (this.currentFilter === 'all') {
            return this.blogPosts;
        }
        return this.blogPosts.filter(post => post.category === this.currentFilter);
    }

    renderBlogPosts(append = false) {
        const blogGrid = document.getElementById('blog-grid');
        const loadMoreBtn = document.getElementById('load-more-btn');
        
        if (!blogGrid) return;

        const filteredPosts = this.getFilteredPosts();
        const startIndex = append ? (this.currentPage - 1) * this.postsPerPage : 0;
        const endIndex = this.currentPage * this.postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        if (!append) {
            blogGrid.innerHTML = '';
        }

        postsToShow.forEach((post, index) => {
            const blogCard = this.createBlogCard(post, startIndex + index);
            blogGrid.appendChild(blogCard);
        });

        // Show/hide load more button
        if (loadMoreBtn) {
            loadMoreBtn.style.display = endIndex >= filteredPosts.length ? 'none' : 'inline-flex';
        }

        // Add animation
        setTimeout(() => {
            document.querySelectorAll('.blog-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in-up');
                }, index * 100);
            });
        }, 100);
    }

    createBlogCard(post, index) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.addEventListener('click', () => this.openBlogModal(post));

        const preview = this.stripHtml(post.content).substring(0, 150) + '...';
        const tags = this.generateTags(post);

        card.innerHTML = `
            <div class="blog-card-header">
                <div class="blog-date">${post.date}</div>
            </div>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-preview">${preview}</p>
            <div class="blog-tags">
                ${tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
            </div>
        `;

        return card;
    }

    generateTags(post) {
        const tags = [];
        
        // Add category tag
        const categoryNames = {
            'tech': '技術',
            'work': '工作',
            'life': '生活'
        };
        tags.push(categoryNames[post.category] || '其他');

        // Add specific tags based on content
        const content = post.title.toLowerCase() + ' ' + post.content.toLowerCase();
        
        if (content.includes('.net') || content.includes('c#')) tags.push('.NET');
        if (content.includes('javascript') || content.includes('vue')) tags.push('前端');
        if (content.includes('api') || content.includes('jwt')) tags.push('API');
        if (content.includes('面試')) tags.push('面試');
        if (content.includes('台北') || content.includes('北漂')) tags.push('台北');

        return tags.slice(0, 3); // Limit to 3 tags
    }

    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    openBlogModal(post) {
        const modal = document.getElementById('blog-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalContent = document.getElementById('modal-content');

        if (modal && modalTitle && modalDate && modalContent) {
            modalTitle.textContent = post.title;
            modalDate.textContent = post.date;
            modalContent.innerHTML = post.content;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Add animation
            setTimeout(() => {
                modal.querySelector('.modal-content').style.animation = 'fadeInUp 0.3s ease-out';
            }, 10);
        }
    }

    closeBlogModal() {
        const modal = document.getElementById('blog-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
}

// Utility functions
function closeCorsNotice() {
    const notice = document.getElementById('cors-notice');
    if (notice) {
        notice.style.display = 'none';
        // 這次會話中不再顯示
        sessionStorage.setItem('localDevTipShown', 'true');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function closeBlogModal() {
    if (window.cyberpunkBlog) {
        window.cyberpunkBlog.closeBlogModal();
    }
}

// Initialize the blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cyberpunkBlog = new CyberpunkBlog();
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    }
});

// Typing effect for terminal
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when about section comes into view
const aboutSection = document.querySelector('#about');
if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const terminalContent = entry.target.querySelector('.terminal-content');
                if (terminalContent && !terminalContent.classList.contains('typed')) {
                    terminalContent.classList.add('typed');
                    // Trigger typing animation
                    setTimeout(() => {
                        const paragraphs = terminalContent.querySelectorAll('p');
                        paragraphs.forEach((p, index) => {
                            setTimeout(() => {
                                p.style.animation = `typewriter 1s steps(${p.textContent.length}) forwards`;
                            }, index * 500);
                        });
                    }, 500);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(aboutSection);
}
