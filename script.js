// Fix preloader issue - add this at the very beginning
document.addEventListener("DOMContentLoaded", () => {
  // Force hide preloader after maximum 5 seconds
  setTimeout(() => {
    const preloader = document.getElementById("preloader")
    if (preloader && !preloader.classList.contains("hidden")) {
      console.log("Force hiding preloader after timeout")
      hidePreloader()
    }
  }, 5000)

  // Initialize app
  initializeApp()
})

// YouTube API Configuration
const YOUTUBE_API_KEY = "AIzaSyA7TYBY-o0aIhZbZuzn_WJAjNht0F4YGH0"
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3"

// Teachers Data with Real Playlist IDs
const teachers = [
  {
    id: "1",
    name: "محمد عبد الجواد",
    subject: "الكيمياء",
    category: "science",
    avatar: "م ع",
    avgDuration: "15",
    totalVideos: 0,
    playlists: [
      { name: "أساسيات الكيمياء", id: "PL91xPELaCszWZKhQVC7ohvejPvfIFSQTU" },
      { name: "الباب الأول", id: "PL91xPELaCszUh5zKmMa-vdTbjcpZ8t0Xi" },
      { name: "الباب الثاني", id: "PL91xPELaCszVO876eMTb5D1m7Z3Efh33t" },
      { name: "الباب الثالث", id: "PL91xPELaCszXyzwCX7niMI5yVEW5NR_W4" },
      { name: "الباب الرابع", id: "PL91xPELaCszXf1RIS8Y6V5BgNBl1PDnXW" },
    ],
    defaultPlaylist: "PL91xPELaCszWZKhQVC7ohvejPvfIFSQTU",
  },
  {
    id: "2",
    name: "محمد عبد المعبود",
    subject: "الفيزياء",
    category: "science",
    avatar: "م ع",
    avgDuration: "45",
    totalVideos: 1,
    singleVideoId: "DnNMJyD7EBY",
    isSingleVideo: true,
  },
  {
    id: "3",
    name: "محمد صالح",
    subject: "الأحياء",
    category: "science",
    avatar: "م ص",
    avgDuration: "18",
    totalVideos: 0,
    defaultPlaylist: "PLrfUbqHkYDah6joGgvCVx3-BAY-ciIzbV",
  },
  {
    id: "4",
    name: "د. محمد أيمن",
    subject: "اللغة الإنجليزية",
    category: "language",
    avatar: "د م",
    avgDuration: "20",
    totalVideos: 0,
    defaultPlaylist: "PLemPsKnFIn6VJ9DxQjpZrFg1-Zxt5roZn",
  },
  {
    id: "5",
    name: "محمد صلاح",
    subject: "اللغة العربية",
    category: "language",
    avatar: "م ص",
    avgDuration: "22",
    totalVideos: 0,
    playlists: [
      { name: "التأسيس", id: "PLiHRnPC3do8VFtupgw83CyTBlg_e95UTl" },
      { name: "المراجعة النهائية", id: "PLiHRnPC3do8VGnz7nwvA-7DmQ8zvuugSk" },
    ],
    defaultPlaylist: "PLiHRnPC3do8VFtupgw83CyTBlg_e95UTl",
  },
]

// Global Variables
let currentTeacher = null
let currentPlaylist = null
let currentVideos = []
let currentVideoId = null
let studyTimer = null
let studyStartTime = null
let youtubePlayer = null
const YT = window.YT // Declare YT variable
let isPlayerReady = false

// Initialize App
// document.addEventListener("DOMContentLoaded", () => {
//   initializeApp()
// })

// Add error handling to hidePreloader function
function hidePreloader() {
  try {
    const preloader = document.getElementById("preloader")
    if (preloader) {
      preloader.classList.add("hidden")
      // Remove from DOM after animation
      setTimeout(() => {
        if (preloader.parentElement) {
          preloader.remove()
        }
      }, 500)
    }
  } catch (error) {
    console.error("Error hiding preloader:", error)
    // Force remove preloader if there's an error
    const preloader = document.getElementById("preloader")
    if (preloader) {
      preloader.style.display = "none"
    }
  }
}

// Update initializeApp function with better error handling
async function initializeApp() {
  try {
    console.log("Initializing app...")

    // Initialize components with error handling
    try {
      await initializeNavigation()
    } catch (error) {
      console.error("Navigation init error:", error)
    }

    try {
      initializeThemeToggle()
    } catch (error) {
      console.error("Theme toggle init error:", error)
    }

    try {
      initializeSearch()
    } catch (error) {
      console.error("Search init error:", error)
    }

    try {
      initializeMobileMenu()
    } catch (error) {
      console.error("Mobile menu init error:", error)
    }

    // Load data with error handling
    try {
      await loadTeachers()
    } catch (error) {
      console.error("Teachers loading error:", error)
      // Show teachers section even if API fails
      showTeachersWithoutAPI()
    }

    try {
      loadProgress()
    } catch (error) {
      console.error("Progress loading error:", error)
    }

    try {
      loadAchievements()
    } catch (error) {
      console.error("Achievements loading error:", error)
    }

    // Initialize counters
    try {
      initializeCounters()
    } catch (error) {
      console.error("Counters init error:", error)
    }

    // Load YouTube API
    try {
      loadYouTubeAPI()
    } catch (error) {
      console.error("YouTube API loading error:", error)
    }

    console.log("App initialized successfully")

    // Hide preloader after everything is loaded
    setTimeout(hidePreloader, 1000)
  } catch (error) {
    console.error("Critical error initializing app:", error)
    // Force hide preloader even if there are errors
    hidePreloader()
  }
}

// Preloader Functions
function showPreloader() {
  const preloader = document.getElementById("preloader")
  if (preloader) {
    preloader.classList.remove("hidden")
  }
}

// function hidePreloader() {
//   const preloader = document.getElementById("preloader")
//   if (preloader) {
//     preloader.classList.add("hidden")
//     // Remove from DOM after animation
//     setTimeout(() => {
//       preloader.remove()
//     }, 500)
//   }
// }

// Add fallback function to show teachers without API
function showTeachersWithoutAPI() {
  const teachersGrid = document.getElementById("teachers-grid")
  if (!teachersGrid) return

  teachersGrid.innerHTML = teachers
    .map((teacher, index) => {
      const progress = getTeacherProgress(teacher.id)
      const progressPercentage =
        teacher.totalVideos > 0 ? Math.round((progress.watchedCount / teacher.totalVideos) * 100) : 0

      return `
      <div class="teacher-card" data-category="${teacher.category}" style="opacity: 1; transform: translateY(0);">
        <div class="teacher-header">
          <div class="teacher-avatar">${teacher.avatar}</div>
          <div class="teacher-info">
            <h3>${teacher.name}</h3>
            <p>${teacher.subject}</p>
          </div>
        </div>
        <div class="teacher-stats">
          <div class="teacher-stat">
            <span class="number">${teacher.totalVideos || "متاح قريباً"}</span>
            <span class="label">درس</span>
          </div>
          <div class="teacher-stat">
            <span class="number">${teacher.avgDuration}</span>
            <span class="label">دقيقة</span>
          </div>
          <div class="teacher-stat">
            <span class="number">${progress.totalTime}</span>
            <span class="label">ساعة دراسة</span>
          </div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-label">
            <span>التقدم</span>
            <span>${progressPercentage}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
          </div>
        </div>
        <div class="teacher-actions">
          <button class="btn btn-primary" onclick="openTeacherModal('${teacher.id}')">
            <i class="fas fa-play"></i>
            <span>ابدأ الدراسة</span>
          </button>
          <button class="btn btn-secondary" onclick="viewTeacherProgress('${teacher.id}')" title="عرض التقدم">
            <i class="fas fa-chart-line"></i>
          </button>
        </div>
      </div>
    `
    })
    .join("")

  // Initialize filter functionality
  initializeTeacherFilter()
}

// Navigation
async function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link")
  const navbar = document.getElementById("navbar")

  // Handle navigation clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"))

      // Add active class to clicked link
      this.classList.add("active")

      // Scroll to section
      const targetId = this.getAttribute("data-section")
      scrollToSection(targetId)
    })
  })

  // Handle scroll for navbar styling
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }

    // Update active nav link based on scroll position
    updateActiveNavLink()
  })
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let currentSection = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("data-section") === currentSection) {
      link.classList.add("active")
    }
  })
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    const offsetTop = section.offsetTop - 80 // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

// Theme Toggle
function initializeThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle")
  const currentTheme = localStorage.getItem("theme") || "light"

  // Set initial theme
  document.documentElement.setAttribute("data-theme", currentTheme)
  updateThemeIcon(currentTheme)

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    updateThemeIcon(newTheme)

    // Add animation effect
    themeToggle.style.transform = "rotate(360deg)"
    setTimeout(() => {
      themeToggle.style.transform = ""
    }, 300)
  })
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById("theme-toggle")
  const icon = themeToggle.querySelector("i")

  if (theme === "dark") {
    icon.className = "fas fa-sun"
  } else {
    icon.className = "fas fa-moon"
  }
}

// Search Functions
function initializeSearch() {
  const searchToggle = document.getElementById("search-toggle")
  const searchOverlay = document.getElementById("search-overlay")
  const searchClose = document.getElementById("search-close")
  const searchInput = document.getElementById("search-input")

  searchToggle.addEventListener("click", () => {
    searchOverlay.classList.add("active")
    setTimeout(() => searchInput.focus(), 100)
  })

  searchClose.addEventListener("click", () => {
    searchOverlay.classList.remove("active")
    searchInput.value = ""
  })

  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove("active")
      searchInput.value = ""
    }
  })

  // Handle search input
  searchInput.addEventListener("input", debounce(handleSearch, 300))

  // Handle escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
      searchOverlay.classList.remove("active")
      searchInput.value = ""
    }
  })
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim()
  const searchResults = document.getElementById("search-results")

  if (query.length < 2) {
    searchResults.innerHTML = ""
    return
  }

  // Search through teachers
  const results = teachers.filter(
    (teacher) => teacher.name.toLowerCase().includes(query) || teacher.subject.toLowerCase().includes(query),
  )

  displaySearchResults(results)
}

function displaySearchResults(results) {
  const searchResults = document.getElementById("search-results")

  if (results.length === 0) {
    searchResults.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>لم يتم العثور على نتائج</p>
      </div>
    `
    return
  }

  searchResults.innerHTML = results
    .map(
      (teacher) => `
    <div class="search-result-item" onclick="openTeacherFromSearch('${teacher.id}')">
      <div class="result-avatar">${teacher.avatar}</div>
      <div class="result-info">
        <h4>${teacher.name}</h4>
        <p>${teacher.subject}</p>
      </div>
      <i class="fas fa-arrow-left"></i>
    </div>
  `,
    )
    .join("")
}

function openTeacherFromSearch(teacherId) {
  document.getElementById("search-overlay").classList.remove("active")
  document.getElementById("search-input").value = ""
  openTeacherModal(teacherId)
}

// Mobile Menu Functions
function initializeMobileMenu() {
  const mobileToggle = document.getElementById("mobile-menu-toggle")
  const navMenu = document.getElementById("nav-menu")

  mobileToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    mobileToggle.classList.toggle("active")
  })
}

// Animated Counters
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number[data-count]")

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    observer.observe(counter)
  })
}

function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-count"))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current)
  }, 16)
}

// YouTube API Functions
function loadYouTubeAPI() {
  // YouTube API will be loaded via script tag in HTML
  window.onYouTubeIframeAPIReady = () => {
    console.log("YouTube API loaded successfully")
    isPlayerReady = true
  }
}

async function getPlaylistVideos(playlistId, maxResults = 50) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}&maxResults=${maxResults}&order=date`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items) {
      throw new Error("No items found in playlist")
    }

    // Get video details for duration and view count
    const videoIds = data.items.map((item) => item.snippet.resourceId.videoId).join(",")
    const videoDetailsResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
    )

    const videoDetailsData = await videoDetailsResponse.json()
    const videoDetails = {}

    if (videoDetailsData.items) {
      videoDetailsData.items.forEach((video) => {
        videoDetails[video.id] = {
          duration: video.contentDetails.duration,
          viewCount: video.statistics.viewCount,
        }
      })
    }

    return data.items.map((item, index) => {
      const videoId = item.snippet.resourceId.videoId
      const details = videoDetails[videoId] || {}

      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail:
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        duration: details.duration ? parseDuration(details.duration) : "غير محدد",
        viewCount: details.viewCount ? Number.parseInt(details.viewCount).toLocaleString("ar-EG") : "0",
        position: index + 1,
      }
    })
  } catch (error) {
    console.error("Error fetching playlist videos:", error)
    throw error
  }
}

async function getPlaylistInfo(playlistId) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/playlists?part=snippet,contentDetails&id=${playlistId}&key=${YOUTUBE_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error("Playlist not found")
    }

    const playlist = data.items[0]
    return {
      title: playlist.snippet.title,
      description: playlist.snippet.description,
      videoCount: playlist.contentDetails.itemCount,
      thumbnail: playlist.snippet.thumbnails.high?.url || playlist.snippet.thumbnails.medium?.url,
    }
  } catch (error) {
    console.error("Error fetching playlist info:", error)
    throw error
  }
}

function parseDuration(duration) {
  // Parse ISO 8601 duration format (PT4M13S)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "0:00"

  const hours = Number.parseInt(match[1]) || 0
  const minutes = Number.parseInt(match[2]) || 0
  const seconds = Number.parseInt(match[3]) || 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }
}

// Load Teachers
async function loadTeachers() {
  const teachersGrid = document.getElementById("teachers-grid")

  // Show skeleton loaders
  showTeacherSkeletons()

  try {
    // Load video counts for each teacher
    for (const teacher of teachers) {
      if (!teacher.isSingleVideo) {
        const playlistId = teacher.defaultPlaylist || (teacher.playlists && teacher.playlists[0].id)
        if (playlistId) {
          try {
            const playlistInfo = await getPlaylistInfo(playlistId)
            teacher.totalVideos = playlistInfo.videoCount
          } catch (error) {
            console.error(`Error loading video count for teacher ${teacher.name}:`, error)
            teacher.totalVideos = 0
          }
        }
      }
    }

    // Clear skeleton loaders
    teachersGrid.innerHTML = ""

    // Create teacher cards
    teachers.forEach((teacher, index) => {
      const teacherCard = createTeacherCard(teacher)
      teachersGrid.appendChild(teacherCard)

      // Add staggered animation
      setTimeout(() => {
        teacherCard.style.opacity = "1"
        teacherCard.style.transform = "translateY(0)"
      }, index * 100)
    })

    // Initialize filter functionality
    initializeTeacherFilter()
  } catch (error) {
    console.error("Error loading teachers:", error)
    teachersGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: var(--error-500);"></i>
        <h3>حدث خطأ في تحميل بيانات المدرسين</h3>
        <p>يرجى المحاولة مرة أخرى لاحقاً</p>
        <button onclick="loadTeachers()" class="btn btn-primary" style="margin-top: 1rem;">
          <i class="fas fa-redo"></i>
          إعادة المحاولة
        </button>
      </div>
    `
  }
}

function showTeacherSkeletons() {
  const teachersGrid = document.getElementById("teachers-grid")
  teachersGrid.innerHTML = Array(5)
    .fill()
    .map(
      () => `
    <div class="teacher-skeleton">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-info">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
      <div class="skeleton-stats">
        <div class="skeleton-stat"></div>
        <div class="skeleton-stat"></div>
        <div class="skeleton-stat"></div>
      </div>
      <div class="skeleton-progress"></div>
      <div class="skeleton-button"></div>
    </div>
  `,
    )
    .join("")
}

function createTeacherCard(teacher) {
  const progress = getTeacherProgress(teacher.id)
  const progressPercentage =
    teacher.totalVideos > 0 ? Math.round((progress.watchedCount / teacher.totalVideos) * 100) : 0

  const card = document.createElement("div")
  card.className = "teacher-card"
  card.style.opacity = "0"
  card.style.transform = "translateY(20px)"
  card.style.transition = "all 0.6s ease-out"
  card.setAttribute("data-category", teacher.category)

  card.innerHTML = `
    <div class="teacher-header">
      <div class="teacher-avatar">${teacher.avatar}</div>
      <div class="teacher-info">
        <h3>${teacher.name}</h3>
        <p>${teacher.subject}</p>
      </div>
    </div>
    <div class="teacher-stats">
      <div class="teacher-stat">
        <span class="number">${teacher.totalVideos}</span>
        <span class="label">درس</span>
      </div>
      <div class="teacher-stat">
        <span class="number">${teacher.avgDuration}</span>
        <span class="label">دقيقة</span>
      </div>
      <div class="teacher-stat">
        <span class="number">${progress.totalTime}</span>
        <span class="label">ساعة دراسة</span>
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-label">
        <span>التقدم</span>
        <span>${progressPercentage}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
      </div>
    </div>
    <div class="teacher-actions">
      <button class="btn btn-primary" onclick="openTeacherModal('${teacher.id}')">
        <i class="fas fa-play"></i>
        <span>ابدأ الدراسة</span>
      </button>
      <button class="btn btn-secondary" onclick="viewTeacherProgress('${teacher.id}')" title="عرض التقدم">
        <i class="fas fa-chart-line"></i>
      </button>
    </div>
  `

  return card
}

function initializeTeacherFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const teacherCards = document.querySelectorAll(".teacher-card")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active filter button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      const filterValue = button.getAttribute("data-subject")

      // Filter teacher cards
      teacherCards.forEach((card) => {
        const category = card.getAttribute("data-category")

        if (filterValue === "all" || category === filterValue) {
          card.style.display = "block"
          setTimeout(() => {
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
          }, 50)
        } else {
          card.style.opacity = "0"
          card.style.transform = "translateY(20px)"
          setTimeout(() => {
            card.style.display = "none"
          }, 300)
        }
      })
    })
  })
}

// Teacher Modal Functions
async function openTeacherModal(teacherId) {
  const teacher = teachers.find((t) => t.id === teacherId)
  if (!teacher) return

  currentTeacher = teacher

  // Show modal
  const modal = document.getElementById("teacher-modal")
  modal.classList.add("active")

  // Update modal header
  document.getElementById("modal-teacher-name").textContent = teacher.name
  document.getElementById("modal-teacher-subject").textContent = teacher.subject
  document.getElementById("modal-teacher-avatar").textContent = teacher.avatar

  // Update modal stats
  document.getElementById("modal-total-videos").textContent = teacher.totalVideos
  document.getElementById("modal-avg-duration").textContent = teacher.avgDuration

  const progress = getTeacherProgress(teacher.id)
  const progressPercentage =
    teacher.totalVideos > 0 ? Math.round((progress.watchedCount / teacher.totalVideos) * 100) : 0

  document.getElementById("modal-progress-percent").textContent = `${progressPercentage}%`
  document.getElementById("modal-progress-text").textContent = `${progress.watchedCount} من ${teacher.totalVideos}`
  document.getElementById("modal-progress-fill").style.width = `${progressPercentage}%`

  // Show playlist selector if teacher has multiple playlists
  const playlistSelector = document.getElementById("playlist-selector")
  const playlistTabs = document.getElementById("playlist-tabs")

  if (teacher.playlists && teacher.playlists.length > 1) {
    playlistSelector.style.display = "block"
    playlistTabs.innerHTML = ""

    teacher.playlists.forEach((playlist, index) => {
      const tab = document.createElement("button")
      tab.className = `playlist-tab ${index === 0 ? "active" : ""}`
      tab.textContent = playlist.name
      tab.onclick = () => selectPlaylist(playlist.id, tab)
      playlistTabs.appendChild(tab)
    })

    currentPlaylist = teacher.playlists[0].id
  } else {
    playlistSelector.style.display = "none"
    currentPlaylist = teacher.defaultPlaylist || teacher.singleVideoId
  }

  // Load videos
  await loadTeacherVideos()
}

function closeTeacherModal() {
  const modal = document.getElementById("teacher-modal")
  modal.classList.remove("active")

  currentTeacher = null
  currentPlaylist = null
  currentVideos = []
}

async function selectPlaylist(playlistId, tabElement) {
  // Update active tab
  document.querySelectorAll(".playlist-tab").forEach((tab) => {
    tab.classList.remove("active")
  })
  tabElement.classList.add("active")

  currentPlaylist = playlistId
  await loadTeacherVideos()
}

async function loadTeacherVideos() {
  const videosContainer = document.getElementById("videos-container")

  // Show loading state
  videosContainer.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>جاري تحميل الدروس من اليوتيوب...</p>
    </div>
  `

  try {
    if (currentTeacher.isSingleVideo) {
      // Handle single video case (Physics)
      currentVideos = [
        {
          id: currentTeacher.singleVideoId,
          title: `${currentTeacher.subject} - المنهج كامل`,
          description: "شرح المنهج كامل",
          thumbnail: `https://img.youtube.com/vi/${currentTeacher.singleVideoId}/maxresdefault.jpg`,
          publishedAt: new Date().toISOString(),
          duration: "2:45:30",
          viewCount: "1,234,567",
          position: 1,
        },
      ]
    } else {
      currentVideos = await getPlaylistVideos(currentPlaylist)
    }

    renderVideosList()
    updateModalProgress()
  } catch (error) {
    console.error("Error loading videos:", error)
    videosContainer.innerHTML = `
      <div class="loading-state">
        <i class="fas fa-exclamation-triangle" style="color: var(--error-500); font-size: 2rem; margin-bottom: 1rem;"></i>
        <p>حدث خطأ في تحميل الفيديوهات</p>
        <button onclick="loadTeacherVideos()" class="btn btn-primary" style="margin-top: 1rem;">
          <i class="fas fa-redo"></i>
          إعادة المحاولة
        </button>
      </div>
    `
  }
}

function renderVideosList() {
  const videosContainer = document.getElementById("videos-container")
  const progress = getTeacherProgress(currentTeacher.id)

  if (currentVideos.length === 0) {
    videosContainer.innerHTML = `
      <div class="loading-state">
        <i class="fas fa-video-slash" style="color: var(--text-secondary); font-size: 2rem; margin-bottom: 1rem;"></i>
        <p>لا توجد فيديوهات متاحة</p>
      </div>
    `
    return
  }

  videosContainer.innerHTML = currentVideos
    .map((video, index) => {
      const isWatched = progress.watchedVideos[video.id] || false
      const studyTime = progress.studyTime[video.id] || 0

      return `
        <div class="video-item" data-video-id="${video.id}">
          <div class="video-checkbox ${isWatched ? "checked" : ""}" onclick="toggleVideoWatched('${video.id}')">
            ${isWatched ? '<i class="fas fa-check"></i>' : ""}
          </div>
          <img class="video-thumbnail" 
               src="${video.thumbnail}" 
               alt="${video.title}" 
               onerror="this.src='https://img.youtube.com/vi/${video.id}/mqdefault.jpg'"
               loading="lazy">
          <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-meta">
              <span><i class="fas fa-clock"></i> ${video.duration}</span>
              <span><i class="fas fa-eye"></i> ${video.viewCount} مشاهدة</span>
              <span><i class="fas fa-calendar"></i> ${formatDate(video.publishedAt)}</span>
              ${studyTime > 0 ? `<span><i class="fas fa-stopwatch"></i> ${Math.round(studyTime / 60)} دقيقة دراسة</span>` : ""}
              ${isWatched ? '<span class="watched-badge"><i class="fas fa-check-circle"></i> تم المشاهدة</span>' : ""}
            </div>
          </div>
          <div class="video-actions">
            <button class="video-action" onclick="openVideoModal('${video.id}')" title="تشغيل الفيديو">
              <i class="fas fa-play"></i>
            </button>
            <button class="video-action" onclick="addToBookmarks('${video.id}')" title="إضافة للمفضلة">
              <i class="fas fa-bookmark"></i>
            </button>
            <button class="video-action" onclick="shareVideo('${video.id}')" title="مشاركة">
              <i class="fas fa-share"></i>
            </button>
          </div>
        </div>
      `
    })
    .join("")

  // Add click events to video items
  document.querySelectorAll(".video-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      if (!e.target.closest(".video-checkbox") && !e.target.closest(".video-actions")) {
        const videoId = item.getAttribute("data-video-id")
        openVideoModal(videoId)
      }
    })
  })
}

function updateModalProgress() {
  if (!currentTeacher || !currentVideos.length) return

  const progress = getTeacherProgress(currentTeacher.id)
  const totalVideos = currentVideos.length
  const watchedCount = Object.keys(progress.watchedVideos).filter(
    (videoId) => progress.watchedVideos[videoId] && currentVideos.some((v) => v.id === videoId),
  ).length

  const percentage = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0

  document.getElementById("modal-progress-fill").style.width = `${percentage}%`
  document.getElementById("modal-progress-percent").textContent = `${percentage}%`
  document.getElementById("modal-progress-text").textContent = `${watchedCount} من ${totalVideos}`
}

// Video Modal Functions
function openVideoModal(videoId) {
  const video = currentVideos.find((v) => v.id === videoId)
  if (!video) return

  currentVideoId = videoId

  // Update modal content
  document.getElementById("video-title").textContent = video.title
  document.getElementById("video-duration").textContent = video.duration
  document.getElementById("video-views").textContent = `${video.viewCount} مشاهدة`

  // Update watched button
  const progress = getTeacherProgress(currentTeacher.id)
  const isWatched = progress.watchedVideos[videoId] || false
  const watchedBtn = document.getElementById("mark-watched-btn")

  if (isWatched) {
    watchedBtn.innerHTML = '<i class="fas fa-check"></i><span>تم المشاهدة</span>'
    watchedBtn.classList.add("primary")
  } else {
    watchedBtn.innerHTML = '<i class="fas fa-eye"></i><span>تم المشاهدة</span>'
    watchedBtn.classList.remove("primary")
  }

  watchedBtn.onclick = () => toggleVideoWatched(videoId)

  // Show video overlay
  document.getElementById("video-overlay").classList.remove("hidden")

  // Start study timer
  startStudyTimer()

  // Show modal
  document.getElementById("video-modal").classList.add("active")
}

function closeVideoModal() {
  // Stop study timer and save time
  stopStudyTimer()

  // Destroy YouTube player
  if (youtubePlayer) {
    try {
      youtubePlayer.destroy()
    } catch (error) {
      console.error("Error destroying YouTube player:", error)
    }
    youtubePlayer = null
  }

  // Hide modal
  document.getElementById("video-modal").classList.remove("active")

  // Reset current video
  currentVideoId = null

  // Update progress in teacher modal
  if (currentTeacher) {
    updateModalProgress()
    renderVideosList()
  }
}

function initializePlayer() {
  if (!currentVideoId || !isPlayerReady) return

  const overlay = document.getElementById("video-overlay")
  overlay.classList.add("hidden")

  if (window.YT && window.YT.Player) {
    youtubePlayer = new window.YT.Player("youtube-player", {
      height: "100%",
      width: "100%",
      videoId: currentVideoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        fs: 1,
        cc_load_policy: 0,
        iv_load_policy: 3,
        autohide: 0,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
    })
  }
}

function onPlayerReady(event) {
  console.log("YouTube player ready")
  resumeStudyTimer()
}

function onPlayerStateChange(event) {
  const YT = window.YT
  if (!YT) return

  switch (event.data) {
    case YT.PlayerState.PLAYING:
      resumeStudyTimer()
      break
    case YT.PlayerState.PAUSED:
    case YT.PlayerState.BUFFERING:
      pauseStudyTimer()
      break
    case YT.PlayerState.ENDED:
      pauseStudyTimer()
      // Auto-mark as watched when video ends
      if (currentVideoId) {
        markVideoAsWatched(currentVideoId, true)
      }
      break
  }
}

function onPlayerError(event) {
  console.error("YouTube player error:", event.data)
  const overlay = document.getElementById("video-overlay")
  const overlayContent = overlay.querySelector(".overlay-content")

  overlayContent.innerHTML = `
    <div style="color: #ff6b6b;">
      <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
      <h3>حدث خطأ في تشغيل الفيديو</h3>
      <p>يرجى المحاولة مرة أخرى أو مشاهدة الفيديو على اليوتيوب مباشرة</p>
      <a href="https://www.youtube.com/watch?v=${currentVideoId}" target="_blank" class="btn btn-primary" style="margin-top: 1rem;">
        <i class="fab fa-youtube"></i>
        فتح في اليوتيوب
      </a>
    </div>
  `

  overlay.classList.remove("hidden")
}

// Study Timer Functions
function startStudyTimer() {
  studyStartTime = Date.now()
  updateTimerDisplay()

  studyTimer = setInterval(() => {
    updateTimerDisplay()
  }, 1000)
}

function stopStudyTimer() {
  if (studyTimer) {
    clearInterval(studyTimer)
    studyTimer = null
  }

  if (studyStartTime && currentVideoId) {
    const studyTime = Math.round((Date.now() - studyStartTime) / 1000)
    saveStudyTime(currentVideoId, studyTime)
    studyStartTime = null
  }
}

function pauseStudyTimer() {
  if (studyTimer) {
    clearInterval(studyTimer)
    studyTimer = null
  }
}

function resumeStudyTimer() {
  if (!studyTimer && studyStartTime) {
    studyTimer = setInterval(() => {
      updateTimerDisplay()
    }, 1000)
  }
}

function updateTimerDisplay() {
  if (studyStartTime) {
    const elapsed = Math.round((Date.now() - studyStartTime) / 1000)
    document.getElementById("study-timer").textContent = formatTime(elapsed)
  }
}

function saveStudyTime(videoId, seconds) {
  if (!currentTeacher || !videoId) return

  const progress = getTeacherProgress(currentTeacher.id)
  if (!progress.studyTime[videoId]) {
    progress.studyTime[videoId] = 0
  }
  progress.studyTime[videoId] += seconds

  saveTeacherProgress(currentTeacher.id, progress)
}

// Progress Functions
function getTeacherProgress(teacherId) {
  const allProgress = JSON.parse(localStorage.getItem("studytube-progress") || "{}")

  if (!allProgress[teacherId]) {
    allProgress[teacherId] = {
      watchedVideos: {},
      studyTime: {},
      bookmarks: [],
      lastAccessed: Date.now(),
    }
  }

  const progress = allProgress[teacherId]
  const watchedCount = Object.values(progress.watchedVideos).filter(Boolean).length
  const totalTime = Math.round(Object.values(progress.studyTime).reduce((sum, time) => sum + time, 0) / 3600) // Convert to hours

  return {
    ...progress,
    watchedCount,
    totalTime,
  }
}

function saveTeacherProgress(teacherId, progress) {
  const allProgress = JSON.parse(localStorage.getItem("studytube-progress") || "{}")
  allProgress[teacherId] = {
    ...progress,
    lastAccessed: Date.now(),
  }
  localStorage.setItem("studytube-progress", JSON.stringify(allProgress))
}

function toggleVideoWatched(videoId) {
  if (!currentTeacher) return

  const progress = getTeacherProgress(currentTeacher.id)
  const newWatchedState = !progress.watchedVideos[videoId]

  markVideoAsWatched(videoId, newWatchedState)
}

function markVideoAsWatched(videoId, isWatched) {
  if (!currentTeacher) return

  const progress = getTeacherProgress(currentTeacher.id)
  progress.watchedVideos[videoId] = isWatched

  saveTeacherProgress(currentTeacher.id, progress)

  // Update UI
  updateModalProgress()
  renderVideosList()

  // Update teacher cards if on main page
  const teacherCards = document.querySelectorAll(".teacher-card")
  teacherCards.forEach((card) => {
    // This would need to be implemented to refresh teacher cards
  })

  // Update button in video modal if open
  if (currentVideoId === videoId) {
    const watchedBtn = document.getElementById("mark-watched-btn")
    if (watchedBtn) {
      if (isWatched) {
        watchedBtn.innerHTML = '<i class="fas fa-check"></i><span>تم المشاهدة</span>'
        watchedBtn.classList.add("primary")
      } else {
        watchedBtn.innerHTML = '<i class="fas fa-eye"></i><span>تم المشاهدة</span>'
        watchedBtn.classList.remove("primary")
      }
    }
  }

  // Show notification
  showNotification(isWatched ? "تم تسجيل الفيديو كمشاهد" : "تم إلغاء تسجيل المشاهدة", "success")
}

// Progress Dashboard
function loadProgress() {
  const progressDashboard = document.getElementById("progress-dashboard")
  const allProgress = JSON.parse(localStorage.getItem("studytube-progress") || "{}")

  if (Object.keys(allProgress).length === 0) {
    progressDashboard.innerHTML = `
      <div style="text-align: center; padding: 4rem; color: var(--text-secondary);">
        <i class="fas fa-chart-line" style="font-size: 4rem; margin-bottom: 2rem; opacity: 0.3;"></i>
        <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">لا توجد بيانات تقدم حتى الآن</h3>
        <p style="font-size: 1.1rem; margin-bottom: 2rem;">ابدأ بمشاهدة بعض الفيديوهات لرؤية تقدمك هنا</p>
        <button onclick="scrollToSection('teachers')" class="btn btn-primary">
          <i class="fas fa-play"></i>
          ابدأ التعلم الآن
        </button>
      </div>
    `
    return
  }

  let totalVideosWatched = 0
  let totalStudyTime = 0
  let totalVideos = 0
  let progressCards = ""

  teachers.forEach((teacher) => {
    const progress = getTeacherProgress(teacher.id)
    totalVideosWatched += progress.watchedCount
    totalStudyTime += progress.totalTime
    totalVideos += teacher.totalVideos

    const percentage = teacher.totalVideos > 0 ? Math.round((progress.watchedCount / teacher.totalVideos) * 100) : 0

    progressCards += `
      <div class="progress-card">
        <div class="progress-card-header">
          <div class="teacher-avatar">${teacher.avatar}</div>
          <div>
            <h4>${teacher.name}</h4>
            <p>${teacher.subject}</p>
          </div>
          <div class="progress-percentage">${percentage}%</div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="progress-stats">
          <span><i class="fas fa-play-circle"></i> ${progress.watchedCount}/${teacher.totalVideos} فيديو</span>
          <span><i class="fas fa-clock"></i> ${progress.totalTime} ساعة</span>
        </div>
        <div style="margin-top: 1rem;">
          <button onclick="openTeacherModal('${teacher.id}')" class="btn btn-primary" style="width: 100%;">
            <i class="fas fa-play"></i>
            متابعة الدراسة
          </button>
        </div>
      </div>
    `
  })

  const overallProgress = totalVideos > 0 ? Math.round((totalVideosWatched / totalVideos) * 100) : 0

  progressDashboard.innerHTML = `
    <div class="progress-overview">
      <div class="overview-card">
        <div class="overview-icon">
          <i class="fas fa-play-circle"></i>
        </div>
        <div class="overview-content">
          <div class="overview-number">${totalVideosWatched}</div>
          <div class="overview-label">فيديو مكتمل</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="overview-content">
          <div class="overview-number">${totalStudyTime}</div>
          <div class="overview-label">ساعة دراسة</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="overview-content">
          <div class="overview-number">${overallProgress}%</div>
          <div class="overview-label">التقدم الإجمالي</div>
        </div>
      </div>
    </div>
    <div class="progress-cards">
      ${progressCards}
    </div>
  `
}

// Achievements System
function loadAchievements() {
  const achievementsGrid = document.getElementById("achievements-grid")
  const allProgress = JSON.parse(localStorage.getItem("studytube-progress") || "{}")

  const achievements = [
    {
      id: "first_video",
      title: "البداية",
      description: "شاهد أول فيديو",
      icon: "fas fa-play",
      condition: () => {
        return Object.values(allProgress).some((progress) =>
          Object.values(progress.watchedVideos || {}).some((watched) => watched),
        )
      },
    },
    {
      id: "first_hour",
      title: "ساعة من التعلم",
      description: "أكمل ساعة واحدة من الدراسة",
      icon: "fas fa-clock",
      condition: () => {
        const totalTime = Object.values(allProgress).reduce(
          (sum, progress) => sum + Object.values(progress.studyTime || {}).reduce((timeSum, time) => timeSum + time, 0),
          0,
        )
        return totalTime >= 3600 // 1 hour in seconds
      },
    },
    {
      id: "complete_subject",
      title: "إتمام مادة",
      description: "أكمل جميع فيديوهات مدرس واحد",
      icon: "fas fa-trophy",
      condition: () => {
        return teachers.some((teacher) => {
          const progress = allProgress[teacher.id]
          if (!progress || teacher.totalVideos === 0) return false
          const watchedCount = Object.values(progress.watchedVideos || {}).filter(Boolean).length
          return watchedCount === teacher.totalVideos
        })
      },
    },
    {
      id: "study_streak",
      title: "المثابرة",
      description: "ادرس لمدة 7 أيام متتالية",
      icon: "fas fa-fire",
      condition: () => {
        // This would require tracking daily study sessions
        return false // Placeholder
      },
    },
    {
      id: "night_owl",
      title: "بومة الليل",
      description: "ادرس بعد منتصف الليل",
      icon: "fas fa-moon",
      condition: () => {
        // This would require tracking study times
        return false // Placeholder
      },
    },
    {
      id: "early_bird",
      title: "طائر الصباح",
      description: "ابدأ الدراسة قبل الساعة 6 صباحاً",
      icon: "fas fa-sun",
      condition: () => {
        // This would require tracking study times
        return false // Placeholder
      },
    },
  ]

  achievementsGrid.innerHTML = achievements
    .map((achievement) => {
      const isUnlocked = achievement.condition()
      return `
      <div class="achievement-card ${isUnlocked ? "unlocked" : "locked"}">
        <div class="achievement-icon">
          <i class="${achievement.icon}"></i>
        </div>
        <div class="achievement-content">
          <h4 class="achievement-title">${achievement.title}</h4>
          <p class="achievement-description">${achievement.description}</p>
        </div>
        <div class="achievement-status">
          ${
            isUnlocked
              ? '<i class="fas fa-check-circle" style="color: var(--success-500);"></i>'
              : '<i class="fas fa-lock" style="color: var(--text-tertiary);"></i>'
          }
        </div>
      </div>
    `
    })
    .join("")
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  } else {
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Additional Functions
function viewTeacherProgress(teacherId) {
  scrollToSection("progress")
  // Highlight the specific teacher's progress card
  setTimeout(() => {
    const progressCards = document.querySelectorAll(".progress-card")
    progressCards.forEach((card) => {
      if (card.innerHTML.includes(teachers.find((t) => t.id === teacherId)?.name)) {
        card.style.transform = "scale(1.05)"
        card.style.boxShadow = "var(--shadow-2xl)"
        setTimeout(() => {
          card.style.transform = ""
          card.style.boxShadow = ""
        }, 2000)
      }
    })
  }, 500)
}

function addToBookmarks(videoId) {
  if (!currentTeacher) return

  const progress = getTeacherProgress(currentTeacher.id)
  if (!progress.bookmarks) {
    progress.bookmarks = []
  }

  const bookmarkIndex = progress.bookmarks.indexOf(videoId)
  if (bookmarkIndex === -1) {
    progress.bookmarks.push(videoId)
    showNotification("تم إضافة الفيديو للمفضلة", "success")
  } else {
    progress.bookmarks.splice(bookmarkIndex, 1)
    showNotification("تم إزالة الفيديو من المفضلة", "info")
  }

  saveTeacherProgress(currentTeacher.id, progress)
}

function shareVideo(videoId) {
  const video = currentVideos.find((v) => v.id === videoId)
  if (!video) return

  const shareData = {
    title: video.title,
    text: `شاهد هذا الدرس الرائع: ${video.title}`,
    url: `https://www.youtube.com/watch?v=${videoId}`,
  }

  if (navigator.share) {
    navigator.share(shareData)
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(shareData.url).then(() => {
      showNotification("تم نسخ رابط الفيديو", "success")
    })
  }
}

function playIntroVideo() {
  // This would open a modal with an intro video
  showNotification("العرض التوضيحي قريباً!", "info")
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`

  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  }

  notification.innerHTML = `
    <i class="${icons[type]}"></i>
    <span>${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 300)
  }, 5000)
}

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  // Escape key to close modals
  if (e.key === "Escape") {
    if (document.getElementById("video-modal").classList.contains("active")) {
      closeVideoModal()
    } else if (document.getElementById("teacher-modal").classList.contains("active")) {
      closeTeacherModal()
    } else if (document.getElementById("search-overlay").classList.contains("active")) {
      document.getElementById("search-overlay").classList.remove("active")
    }
  }

  // Space bar to play/pause video
  if (e.key === " " && document.getElementById("video-modal").classList.contains("active")) {
    e.preventDefault()
    if (youtubePlayer && youtubePlayer.getPlayerState) {
      const YT = window.YT
      const state = youtubePlayer.getPlayerState()
      if (state === YT.PlayerState.PLAYING) {
        youtubePlayer.pauseVideo()
      } else if (state === YT.PlayerState.PAUSED) {
        youtubePlayer.playVideo()
      }
    }
  }

  // Ctrl/Cmd + K to open search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault()
    document.getElementById("search-overlay").classList.add("active")
    setTimeout(() => document.getElementById("search-input").focus(), 100)
  }
})

// Add notification styles
const notificationStyles = `
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--bg-card);
  color: var(--text-primary);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transform: translateX(100%);
  transition: transform var(--transition-normal);
  z-index: var(--z-toast);
  border-left: 4px solid var(--primary-500);
  min-width: 300px;
  max-width: 400px;
}

.notification.show {
  transform: translateX(0);
}

.notification-success {
  border-left-color: var(--success-500);
}

.notification-error {
  border-left-color: var(--error-500);
}

.notification-warning {
  border-left-color: var(--warning-500);
}

.notification-info {
  border-left-color: var(--primary-500);
}

.notification i:first-child {
  font-size: 1.2rem;
}

.notification-success i:first-child {
  color: var(--success-500);
}

.notification-error i:first-child {
  color: var(--error-500);
}

.notification-warning i:first-child {
  color: var(--warning-500);
}

.notification-info i:first-child {
  color: var(--primary-500);
}

.notification span {
  flex: 1;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.notification-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.achievement-card {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.achievement-card.locked {
  opacity: 0.6;
  filter: grayscale(1);
}

.achievement-card.unlocked {
  border-color: var(--success-500);
  background: linear-gradient(135deg, var(--bg-card), var(--success-50));
}

.achievement-card.unlocked::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, var(--success-500), var(--success-400));
}

.achievement-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.achievement-card.unlocked .achievement-icon {
  background: linear-gradient(135deg, var(--success-500), var(--success-400));
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: var(--space-1);
  color: var(--text-primary);
}

.achievement-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.achievement-status {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-result-item:hover {
  background: var(--bg-secondary);
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
}

.result-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--text-primary);
}

.result-info p {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .notification {
    right: var(--space-4);
    left: var(--space-4);
    min-width: auto;
    max-width: none;
  }
  
  .achievement-card {
    flex-direction: column;
    text-align: center;
  }
  
  .achievement-icon {
    margin-bottom: var(--space-2);
  }
}
`

// Add styles to document
const styleSheet = document.createElement("style")
styleSheet.textContent = notificationStyles
document.head.appendChild(styleSheet)

// Initialize service worker for offline functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful")
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed")
      })
  })
}

// Handle online/offline status
window.addEventListener("online", () => {
  showNotification("تم استعادة الاتصال بالإنترنت", "success")
})

window.addEventListener("offline", () => {
  showNotification("لا يوجد اتصال بالإنترنت", "warning")
})

// Performance monitoring
window.addEventListener("load", () => {
  if (window.performance) {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
    console.log(`Page loaded in ${loadTime}ms`)
  }
})
