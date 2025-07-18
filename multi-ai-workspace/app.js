// Application data
const appData = {
  projects: [
    {
      id: "1",
      name: "Marketing Campaign Analysis",
      description: "AI-powered analysis of marketing campaigns using multiple models",
      aiModels: ["gpt-4", "claude-3", "gemini-pro"],
      lastActivity: "2025-01-18T10:30:00Z",
      collaborators: ["john@company.com", "sarah@company.com"],
      conversations: 24,
      cost: 45.60
    },
    {
      id: "2", 
      name: "Research Assistant",
      description: "Multi-AI research and document analysis workspace",
      aiModels: ["gpt-4", "claude-3"],
      lastActivity: "2025-01-17T15:45:00Z",
      collaborators: ["mike@company.com"],
      conversations: 12,
      cost: 23.80
    },
    {
      id: "3",
      name: "Code Review Bot",
      description: "Automated code review using multiple AI models",
      aiModels: ["gpt-4", "claude-3", "codestral"],
      lastActivity: "2025-01-16T09:15:00Z",
      collaborators: ["dev@company.com", "lead@company.com"],
      conversations: 45,
      cost: 78.90
    }
  ],
  aiServices: [
    {
      id: "openai",
      name: "OpenAI",
      models: ["gpt-4", "gpt-4o", "gpt-3.5-turbo"],
      status: "connected",
      usage: 1250,
      cost: 125.50
    },
    {
      id: "anthropic",
      name: "Anthropic",
      models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
      status: "connected",
      usage: 890,
      cost: 89.30
    },
    {
      id: "google",
      name: "Google AI",
      models: ["gemini-pro", "gemini-pro-vision"],
      status: "disconnected",
      usage: 0,
      cost: 0
    }
  ],
  analytics: {
    totalRequests: 2140,
    totalCost: 214.80,
    averageResponseTime: 2.3,
    topModels: [
      {name: "gpt-4", usage: 45},
      {name: "claude-3", usage: 35},
      {name: "gemini-pro", usage: 20}
    ],
    dailyUsage: [
      {date: "2025-01-12", requests: 120, cost: 12.40},
      {date: "2025-01-13", requests: 150, cost: 15.60},
      {date: "2025-01-14", requests: 180, cost: 18.90},
      {date: "2025-01-15", requests: 200, cost: 21.50},
      {date: "2025-01-16", requests: 170, cost: 17.80},
      {date: "2025-01-17", requests: 160, cost: 16.30},
      {date: "2025-01-18", requests: 190, cost: 19.20}
    ]
  },
  conversations: [
    {
      id: "1",
      projectId: "1",
      aiModel: "gpt-4",
      messages: [
        {
          role: "user",
          content: "Analyze the effectiveness of our Q4 marketing campaign",
          timestamp: "2025-01-18T10:30:00Z"
        },
        {
          role: "assistant",
          content: "I'll analyze your Q4 marketing campaign effectiveness. Based on the data provided, here are the key insights:\n\n1. **Overall Performance**: The campaign showed strong performance with a 23% increase in engagement\n2. **Channel Analysis**: Social media performed best (35% conversion rate)\n3. **Demographics**: 25-34 age group showed highest engagement\n4. **ROI**: 4.2x return on ad spend\n\nWould you like me to dive deeper into any specific aspect?",
          timestamp: "2025-01-18T10:30:15Z"
        }
      ]
    }
  ],
  workflows: [
    {
      id: "1",
      name: "Content Creation Pipeline",
      description: "Generate, review, and optimize content using multiple AI models",
      steps: [
        {type: "generate", model: "gpt-4", prompt: "Create blog post outline"},
        {type: "review", model: "claude-3", prompt: "Review and improve outline"},
        {type: "write", model: "gpt-4", prompt: "Write full article"},
        {type: "optimize", model: "claude-3", prompt: "Optimize for SEO"}
      ],
      status: "active"
    }
  ]
};

// Application state
let currentView = 'dashboard';
let currentProject = null;
let currentChatMessages = [];
let currentAIModel = 'gpt-4';
let chartsInitialized = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeApp();
  setupEventListeners();
});

function initializeApp() {
  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'system';
  applyTheme(savedTheme);
  
  // Show initial view
  showView('dashboard');
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Navigation - more robust event handling
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const view = this.getAttribute('data-view');
      console.log('Navigation clicked:', view);
      if (view) {
        showView(view);
      }
    });
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Modal handlers
  const createProjectBtn = document.getElementById('createProjectBtn');
  const newProjectBtn = document.getElementById('newProjectBtn');
  const closeModal = document.getElementById('closeModal');
  const cancelProject = document.getElementById('cancelProject');
  const createProject = document.getElementById('createProject');
  const modal = document.getElementById('projectModal');

  if (createProjectBtn) {
    createProjectBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  }
  
  if (newProjectBtn) {
    newProjectBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', closeModalHandler);
  }
  
  if (cancelProject) {
    cancelProject.addEventListener('click', closeModalHandler);
  }
  
  if (createProject) {
    createProject.addEventListener('click', handleCreateProject);
  }

  // Close modal on backdrop click
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModalHandler();
      }
    });
  }

  // Chat functionality - will be set up when chat view is rendered
  setupChatEventListeners();
}

function setupChatEventListeners() {
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  const messageInput = document.getElementById('messageInput');
  const modelSelect = document.getElementById('modelSelect');
  const clearChatBtn = document.getElementById('clearChatBtn');

  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', sendMessage);
  }
  
  if (messageInput) {
    messageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  if (modelSelect) {
    modelSelect.addEventListener('change', function() {
      currentAIModel = this.value;
    });
  }

  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', clearChat);
  }
}

function showView(viewName) {
  console.log('Showing view:', viewName);
  currentView = viewName;
  
  // Update navigation
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('nav-item--active');
    if (item.getAttribute('data-view') === viewName) {
      item.classList.add('nav-item--active');
    }
  });

  // Update views
  const views = document.querySelectorAll('.view');
  views.forEach(view => {
    view.classList.remove('view--active');
    if (view.id === viewName) {
      view.classList.add('view--active');
    }
  });

  // Update page title
  const pageTitle = document.getElementById('pageTitle');
  const titles = {
    'dashboard': 'Dashboard',
    'projects': 'Projects',
    'ai-hub': 'AI Integration Hub',
    'chat': 'AI Chat',
    'analytics': 'Analytics',
    'workflows': 'Workflows',
    'settings': 'Settings'
  };
  if (pageTitle) {
    pageTitle.textContent = titles[viewName] || 'Dashboard';
  }

  // Render view content
  setTimeout(() => {
    switch(viewName) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'projects':
        renderProjects();
        break;
      case 'ai-hub':
        renderAIHub();
        break;
      case 'chat':
        renderChat();
        setupChatEventListeners();
        break;
      case 'analytics':
        renderAnalytics();
        break;
      case 'workflows':
        renderWorkflows();
        break;
      case 'settings':
        renderSettings();
        break;
    }
  }, 50);
}

function renderDashboard() {
  console.log('Rendering dashboard...');
  const recentProjects = document.getElementById('recentProjects');
  const recentActivity = document.getElementById('recentActivity');

  if (recentProjects) {
    // Render recent projects
    recentProjects.innerHTML = appData.projects.slice(0, 3).map(project => `
      <div class="project-item" onclick="openProject('${project.id}')">
        <div class="project-info">
          <h4>${project.name}</h4>
          <p>${project.description}</p>
        </div>
        <div class="project-meta">
          <div>${project.conversations} conversations</div>
          <div>$${project.cost.toFixed(2)}</div>
        </div>
      </div>
    `).join('');
  }

  if (recentActivity) {
    // Render recent activity
    const activities = [
      { icon: '🚀', text: 'New project "Marketing Campaign Analysis" created', time: '2 hours ago' },
      { icon: '🤖', text: 'GPT-4 model added to Research Assistant', time: '4 hours ago' },
      { icon: '📊', text: 'Monthly analytics report generated', time: '1 day ago' },
      { icon: '🔗', text: 'Connected to Anthropic API', time: '2 days ago' }
    ];

    recentActivity.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-content">
          <p>${activity.text}</p>
          <div class="activity-time">${activity.time}</div>
        </div>
      </div>
    `).join('');
  }
}

function renderProjects() {
  console.log('Rendering projects...');
  const projectsGrid = document.getElementById('projectsGrid');
  
  if (projectsGrid) {
    projectsGrid.innerHTML = appData.projects.map(project => `
      <div class="project-card" onclick="openProject('${project.id}')">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="project-models">
          ${project.aiModels.map(model => `<span class="model-tag">${model}</span>`).join('')}
        </div>
        <div class="project-stats">
          <span>${project.conversations} conversations</span>
          <span>$${project.cost.toFixed(2)}</span>
        </div>
      </div>
    `).join('');
  }
}

function renderAIHub() {
  console.log('Rendering AI Hub...');
  const aiServicesGrid = document.getElementById('aiServicesGrid');
  
  if (aiServicesGrid) {
    aiServicesGrid.innerHTML = appData.aiServices.map(service => `
      <div class="ai-service-card">
        <div class="service-header">
          <div class="service-name">${service.name}</div>
          <div class="service-status service-status--${service.status}">
            ${service.status}
          </div>
        </div>
        <div class="service-models">
          <h4>Available Models</h4>
          <div class="project-models">
            ${service.models.map(model => `<span class="model-tag">${model}</span>`).join('')}
          </div>
        </div>
        <div class="service-stats">
          <span>${service.usage} requests</span>
          <span>$${service.cost.toFixed(2)}</span>
        </div>
      </div>
    `).join('');
  }
}

function renderChat() {
  console.log('Rendering chat...');
  const chatProjectsList = document.getElementById('chatProjectsList');
  const chatMessages = document.getElementById('chatMessages');
  
  if (chatProjectsList) {
    // Render chat projects
    chatProjectsList.innerHTML = appData.projects.map(project => `
      <div class="chat-project-item ${currentProject === project.id ? 'chat-project-item--active' : ''}" 
           onclick="selectChatProject('${project.id}')">
        <div>${project.name}</div>
        <div style="font-size: 12px; color: var(--color-text-secondary);">${project.conversations} conversations</div>
      </div>
    `).join('');
  }

  if (chatMessages) {
    // Render chat messages
    if (currentProject) {
      const conversation = appData.conversations.find(c => c.projectId === currentProject);
      if (conversation) {
        chatMessages.innerHTML = conversation.messages.map(message => `
          <div class="message ${message.role === 'user' ? 'message--user' : ''}">
            <div class="message-avatar">
              ${message.role === 'user' ? 'U' : 'AI'}
            </div>
            <div class="message-content">
              ${message.content}
            </div>
          </div>
        `).join('');
      }
    } else {
      chatMessages.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">Select a project to start chatting</p>';
    }
  }
}

function renderAnalytics() {
  console.log('Rendering analytics...');
  if (!chartsInitialized) {
    setTimeout(() => {
      renderUsageChart();
      renderModelChart();
      chartsInitialized = true;
    }, 200);
  }
  renderCostBreakdown();
  renderPerformanceMetrics();
}

function renderUsageChart() {
  const ctx = document.getElementById('usageChart');
  if (!ctx) return;

  try {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: appData.analytics.dailyUsage.map(d => {
          const date = new Date(d.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [{
          label: 'Requests',
          data: appData.analytics.dailyUsage.map(d => d.requests),
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          fill: true,
          tension: 0.4
        }, {
          label: 'Cost ($)',
          data: appData.analytics.dailyUsage.map(d => d.cost),
          borderColor: '#FFC185',
          backgroundColor: 'rgba(255, 193, 133, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left'
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating usage chart:', error);
  }
}

function renderModelChart() {
  const ctx = document.getElementById('modelChart');
  if (!ctx) return;

  try {
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: appData.analytics.topModels.map(m => m.name),
        datasets: [{
          data: appData.analytics.topModels.map(m => m.usage),
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating model chart:', error);
  }
}

function renderCostBreakdown() {
  const costBreakdown = document.getElementById('costBreakdown');
  
  if (costBreakdown) {
    costBreakdown.innerHTML = appData.aiServices.map(service => `
      <div class="cost-item">
        <span>${service.name}</span>
        <span>$${service.cost.toFixed(2)}</span>
      </div>
    `).join('');
  }
}

function renderPerformanceMetrics() {
  const performanceMetrics = document.getElementById('performanceMetrics');
  
  if (performanceMetrics) {
    const metrics = [
      { label: 'Average Response Time', value: `${appData.analytics.averageResponseTime}s` },
      { label: 'Total Requests', value: appData.analytics.totalRequests.toLocaleString() },
      { label: 'Success Rate', value: '99.2%' },
      { label: 'Uptime', value: '99.9%' }
    ];

    performanceMetrics.innerHTML = metrics.map(metric => `
      <div class="metric-item">
        <span class="metric-label">${metric.label}</span>
        <span class="metric-value">${metric.value}</span>
      </div>
    `).join('');
  }
}

function renderWorkflows() {
  console.log('Rendering workflows...');
  const workflowsGrid = document.getElementById('workflowsGrid');
  
  if (workflowsGrid) {
    workflowsGrid.innerHTML = appData.workflows.map(workflow => `
      <div class="workflow-card">
        <div class="workflow-header">
          <h3>${workflow.name}</h3>
          <div class="status status--${workflow.status === 'active' ? 'success' : 'info'}">
            ${workflow.status}
          </div>
        </div>
        <p>${workflow.description}</p>
        <div class="workflow-steps">
          ${workflow.steps.map((step, index) => `
            <div class="workflow-step">
              <div class="step-number">${index + 1}</div>
              <div>${step.type} using ${step.model}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }
}

function renderSettings() {
  console.log('Rendering settings...');
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    const savedTheme = localStorage.getItem('theme') || 'system';
    themeSelect.value = savedTheme;
    themeSelect.removeEventListener('change', handleThemeChange);
    themeSelect.addEventListener('change', handleThemeChange);
  }
}

function handleThemeChange(e) {
  applyTheme(e.target.value);
}

function openProject(projectId) {
  currentProject = projectId;
  showView('chat');
}

function selectChatProject(projectId) {
  currentProject = projectId;
  renderChat();
}

function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  if (!messageInput) return;
  
  const message = messageInput.value.trim();
  
  if (!message || !currentProject) return;

  // Add user message
  currentChatMessages.push({
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  });

  // Simulate AI response
  setTimeout(() => {
    const responses = [
      "I understand your request. Let me analyze this for you...",
      "Based on the data provided, here are my insights...",
      "I'll help you with that. Here's what I found...",
      "Great question! Let me break this down for you...",
      "I've processed your request and here are the results..."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    currentChatMessages.push({
      role: 'assistant',
      content: randomResponse,
      timestamp: new Date().toISOString()
    });

    renderChatMessages();
  }, 1000);

  messageInput.value = '';
  renderChatMessages();
}

function renderChatMessages() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  chatMessages.innerHTML = currentChatMessages.map(message => `
    <div class="message ${message.role === 'user' ? 'message--user' : ''}">
      <div class="message-avatar">
        ${message.role === 'user' ? 'U' : 'AI'}
      </div>
      <div class="message-content">
        ${message.content}
      </div>
    </div>
  `).join('');

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearChat() {
  currentChatMessages = [];
  renderChatMessages();
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-color-scheme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

function applyTheme(theme) {
  const themeToggle = document.getElementById('themeToggle');
  
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-color-scheme');
    if (themeToggle) themeToggle.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-color-scheme', theme);
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  
  localStorage.setItem('theme', theme);
}

function openModal() {
  console.log('Opening modal...');
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('modal--active');
  }
}

function closeModalHandler() {
  console.log('Closing modal...');
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('modal--active');
  }
  
  // Reset form
  const projectName = document.getElementById('projectName');
  const projectDescription = document.getElementById('projectDescription');
  
  if (projectName) projectName.value = '';
  if (projectDescription) projectDescription.value = '';
  
  document.querySelectorAll('#projectModal input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
}

function handleCreateProject() {
  const projectName = document.getElementById('projectName');
  const projectDescription = document.getElementById('projectDescription');
  
  if (!projectName || !projectDescription) {
    alert('Form elements not found');
    return;
  }
  
  const name = projectName.value.trim();
  const description = projectDescription.value.trim();
  const selectedModels = Array.from(document.querySelectorAll('#projectModal input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  if (!name || !description || selectedModels.length === 0) {
    alert('Please fill in all fields and select at least one AI model.');
    return;
  }

  // Create new project
  const newProject = {
    id: Date.now().toString(),
    name,
    description,
    aiModels: selectedModels,
    lastActivity: new Date().toISOString(),
    collaborators: [],
    conversations: 0,
    cost: 0
  };

  appData.projects.push(newProject);
  closeModalHandler();
  
  // Show success message
  alert('Project created successfully!');
  
  // Refresh current view
  if (currentView === 'projects') {
    renderProjects();
  } else if (currentView === 'dashboard') {
    renderDashboard();
  }
}

// Handle responsive navigation
function toggleMobileNav() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.classList.toggle('sidebar--open');
  }
}