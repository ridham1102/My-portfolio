// Project data with graph information
const projectsData = {
  'biodiversity': {
    title: 'Species Conservation Accuracy (%)',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    predicted: [85, 87, 89, 91, 88, 92],
    actual: [82, 85, 87, 89, 86, 90]
  },
  'forest-fires': {
    title: 'Fire Risk Prediction Accuracy (%)',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    predicted: [78, 82, 85, 87, 84, 89],
    actual: [76, 80, 83, 85, 82, 87]
  },
  'trader-sentiment': {
    title: 'Market Sentiment Prediction (%)',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    predicted: [72, 75, 78, 81, 77, 84],
    actual: [70, 73, 76, 79, 75, 82]
  },
  'analytics-case': {
    title: 'Revenue Prediction Accuracy (%)',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    predicted: [88, 90, 92, 89, 94, 91],
    actual: [86, 88, 90, 87, 92, 89]
  },
  'car-price': {
    title: 'Price Prediction Accuracy (%)',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    predicted: [82, 84, 87, 89, 85, 91],
    actual: [80, 82, 85, 87, 83, 89]
  }
};

// Chart instance and state
let chart = null;
let currentProject = 'biodiversity';
let lineVisibility = {
  predicted: true,
  actual: true
};

// Loading Screen Animation
document.addEventListener('DOMContentLoaded', function() {
  const loader = document.getElementById('loader');
  const main = document.getElementById('main');
  const loaderText = document.querySelector('.loader__text');
  
  // Loading sequence with timing
  const loadingSequence = [
    { text: 'Initializing Neural Networks...', delay: 0 },
    { text: 'Loading ML Models... 25%', delay: 1000 },
    { text: 'Training Algorithms... 50%', delay: 2000 },
    { text: 'Aspiring Data Scientist... 75%', delay: 3000 },
    { text: 'Machine Learning Expert... 100%', delay: 4000 }
  ];
  
  // Execute loading sequence
  loadingSequence.forEach((step, index) => {
    setTimeout(() => {
      loaderText.textContent = step.text;
      
      // If this is the final step, start fade out after a brief delay
      if (index === loadingSequence.length - 1) {
        setTimeout(() => {
          fadeOutLoader();
        }, 800);
      }
    }, step.delay);
  });
  
  // Fade out loader and show main content
  function fadeOutLoader() {
    loader.classList.add('fade-out');
    
    // Wait for fade animation to complete, then show main content
    setTimeout(() => {
      loader.style.display = 'none';
      main.classList.remove('hidden');
      
      // Initialize chart and interactions
      initializeChart();
      setupInteractions();
      setupContactForm();
      animateSections();
    }, 800);
  }
  
  // Animate sections with staggered timing
  function animateSections() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.style.animationDelay = `${index * 0.3}s`;
        section.style.animationPlayState = 'running';
      }, index * 200);
    });
  }
});

// Initialize Chart.js
function initializeChart() {
  const ctx = document.getElementById('predictionChart');
  if (!ctx) return;
  
  const data = projectsData[currentProject];
  
  chart = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Predicted',
          data: data.predicted,
          borderColor: '#00f7ff',
          backgroundColor: 'rgba(0, 247, 255, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#00f7ff',
          pointBorderColor: '#00f7ff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          hidden: !lineVisibility.predicted
        },
        {
          label: 'Actual',
          data: data.actual,
          borderColor: '#ff00c3',
          backgroundColor: 'rgba(255, 0, 195, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ff00c3',
          pointBorderColor: '#ff00c3',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          hidden: !lineVisibility.actual
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(14, 14, 14, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#00f7ff',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            labelColor: function(context) {
              return {
                borderColor: context.dataset.borderColor,
                backgroundColor: context.dataset.borderColor
              };
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)',
            font: {
              size: 12
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)',
            font: {
              size: 12
            },
            callback: function(value) {
              return value + '%';
            }
          },
          min: 60,
          max: 100
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }
  });
}

// Setup all interactive functionality
function setupInteractions() {
  // Project selector buttons
  const projectButtons = document.querySelectorAll('.project-btn');
  projectButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const project = this.dataset.project;
      if (project !== currentProject) {
        switchProject(project, this);
      }
    });
  });
  
  // Toggle buttons for predicted/actual lines
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const lineType = this.dataset.line;
      toggleLine(lineType, this);
    });
  });
  
  // Enhanced project card interactions
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    // Add mouse enter/leave effects
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Add click ripple effect
    card.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.width = '4px';
      ripple.style.height = '4px';
      ripple.style.background = '#00f7ff';
      ripple.style.borderRadius = '50%';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'ripple 0.6s ease-out forwards';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Contact link hover effects
  const contactLinks = document.querySelectorAll('.contact-link');
  contactLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      const svg = this.querySelector('svg');
      if (svg) {
        svg.style.transform = 'scale(1.1) rotate(5deg)';
      }
    });
    
    link.addEventListener('mouseleave', function() {
      const svg = this.querySelector('svg');
      if (svg) {
        svg.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });
}

// Setup Contact Form
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const successMessage = document.getElementById('formSuccess');
  
  if (!form || !emailInput || !messageInput) {
    console.warn('Contact form elements not found');
    return;
  }
  
  // Real-time validation
  emailInput.addEventListener('blur', validateEmail);
  messageInput.addEventListener('blur', validateMessage);
  
  // Clear errors on input
  emailInput.addEventListener('input', () => hideError(emailError));
  messageInput.addEventListener('input', () => hideError(messageError));
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isValidEmail = validateEmail();
    const isValidMessage = validateMessage();
    
    if (isValidEmail && isValidMessage) {
      submitForm();
    }
  });
  
  function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      showError(emailError, 'Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      showError(emailError, 'Please enter a valid email address');
      return false;
    } else {
      hideError(emailError);
      return true;
    }
  }
  
  function validateMessage() {
    const message = messageInput.value.trim();
    
    if (!message) {
      showError(messageError, 'Message is required');
      return false;
    } else if (message.length < 10) {
      showError(messageError, 'Message must be at least 10 characters long');
      return false;
    } else {
      hideError(messageError);
      return true;
    }
  }
  
  function showError(errorElement, message) {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }
  
  function hideError(errorElement) {
    if (errorElement) {
      errorElement.classList.remove('show');
      errorElement.textContent = '';
    }
  }
  
  function submitForm() {
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    // Create mailto link
    const subject = encodeURIComponent('Portfolio Contact Form - Message from ' + email);
    const body = encodeURIComponent(`From: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:aridham1102@gmail.com?subject=${subject}&body=${body}`;
    
    // Open mailto link
    window.open(mailtoLink, '_self');
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    form.reset();
    hideError(emailError);
    hideError(messageError);
  }
  
  function showSuccessMessage() {
    if (!successMessage) return;
    
    successMessage.classList.remove('hidden');
    
    // Add animation class
    successMessage.style.opacity = '0';
    successMessage.style.transform = 'translateY(20px)';
    
    // Animate in
    setTimeout(() => {
      successMessage.style.transition = 'all 0.5s ease';
      successMessage.style.opacity = '1';
      successMessage.style.transform = 'translateY(0)';
    }, 100);
    
    // Hide after 5 seconds
    setTimeout(() => {
      successMessage.style.opacity = '0';
      successMessage.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        successMessage.classList.add('hidden');
        successMessage.style.transition = '';
      }, 500);
    }, 5000);
  }
}

// Switch between projects
function switchProject(projectId, buttonElement) {
  if (!chart || !projectsData[projectId]) return;
  
  currentProject = projectId;
  const data = projectsData[projectId];
  
  // Update active project button
  document.querySelectorAll('.project-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  buttonElement.classList.add('active');
  
  // Update chart title - this was the bug!
  const chartTitleElement = document.getElementById('chart-title');
  if (chartTitleElement) {
    chartTitleElement.textContent = data.title;
  }
  
  // Update chart data
  chart.data.labels = data.labels;
  chart.data.datasets[0].data = data.predicted;
  chart.data.datasets[1].data = data.actual;
  
  // Apply current visibility settings
  chart.data.datasets[0].hidden = !lineVisibility.predicted;
  chart.data.datasets[1].hidden = !lineVisibility.actual;
  
  // Animate chart update
  chart.update('active');
}

// Toggle predicted/actual lines
function toggleLine(lineType, buttonElement) {
  if (!chart) return;
  
  // Toggle visibility state
  lineVisibility[lineType] = !lineVisibility[lineType];
  
  // Update button visual state
  if (lineVisibility[lineType]) {
    buttonElement.classList.add('active');
  } else {
    buttonElement.classList.remove('active');
  }
  
  // Update chart dataset visibility
  const datasetIndex = lineType === 'predicted' ? 0 : 1;
  chart.data.datasets[datasetIndex].hidden = !lineVisibility[lineType];
  
  // Animate chart update
  chart.update('active');
}

// Scroll-triggered animations for better performance
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe sections for scroll animations (after main content is shown)
setTimeout(() => {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}, 5500);

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
  // Allow escape key to skip loading screen (for development/accessibility)
  if (e.key === 'Escape' && document.getElementById('loader') && !document.getElementById('loader').classList.contains('fade-out')) {
    const loader = document.getElementById('loader');
    const main = document.getElementById('main');
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
      main.classList.remove('hidden');
      initializeChart();
      setupInteractions();
      setupContactForm();
    }, 800);
  }
});

// Add ripple animation keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(40);
      opacity: 0;
    }
  }
  
  /* Additional smooth transitions */
  .project-card,
  .contact-link svg,
  .project-btn,
  .toggle-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Enhanced focus states */
  .project-card:focus-within {
    outline: 2px solid #00f7ff;
    outline-offset: 4px;
  }
`;

document.head.appendChild(style);

// Performance monitoring (optional - can be removed in production)
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log(`Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
      }
    }, 0);
  });
}

// Accessibility enhancements
document.addEventListener('DOMContentLoaded', function() {
  // Respect user's motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Reduce animation durations
    const animations = document.querySelectorAll('*');
    animations.forEach(el => {
      el.style.animationDuration = '0.01s';
      el.style.transitionDuration = '0.01s';
    });
  }
  
  // Announce loading completion to screen readers
  setTimeout(() => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Interactive portfolio loaded successfully. Navigate through projects using the selector buttons and fill out the contact form to get in touch.';
    document.body.appendChild(announcement);
    
    // Remove announcement after screen readers have processed it
    setTimeout(() => {
      announcement.remove();
    }, 3000);
  }, 6000);
});

// Enhanced form interactions
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    const contactInputs = document.querySelectorAll('.contact-input, .contact-textarea');
    
    contactInputs.forEach(input => {
      // Add focus and blur effects
      input.addEventListener('focus', function() {
        if (this.parentElement) {
          this.parentElement.style.transform = 'scale(1.02)';
        }
      });
      
      input.addEventListener('blur', function() {
        if (this.parentElement) {
          this.parentElement.style.transform = 'scale(1)';
        }
      });
      
      // Add typing effect
      input.addEventListener('input', function() {
        if (this.value) {
          this.style.textShadow = '0 0 5px rgba(0, 247, 255, 0.3)';
        } else {
          this.style.textShadow = 'none';
        }
      });
    });
  }, 6000);
});