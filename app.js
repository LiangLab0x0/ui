// Mock data bindings
const mockData = {
  gpu_util: 78,
  targets_validated: 124,
  seq_designed: 3120,
  lnp_pool: 842,
  dbtl_cycles: 9,
  viewer: "JAK3_AF3_model.cif",
  safety: { immunogenicity: "low", toxicity: "medium" }
};

// Initialize interactivity
document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Here we would switch tab content
      console.log(`Switched to ${tab.textContent} tab`);
    });
  });

  // Sidebar navigation
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // KPI card hover effects
  const kpiCards = document.querySelectorAll('.kpi-card');
  kpiCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const delta = card.querySelector('.kpi-delta');
      if (delta) delta.style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', () => {
      const delta = card.querySelector('.kpi-delta');
      if (delta) delta.style.opacity = '0.7';
    });
  });

  // Editable inputs
  const editableInputs = document.querySelectorAll('.editable');
  editableInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      console.log(`Updated ${input.previousElementSibling.textContent}: ${e.target.value}`);
      // Here we would save to backend
    });
  });

  // Timeline nodes
  const timelineNodes = document.querySelectorAll('.timeline-node');
  timelineNodes.forEach(node => {
    node.addEventListener('click', () => {
      console.log(`Clicked timeline node: ${node.querySelector('text').textContent}`);
      // Here we would open timeline drawer
    });
  });

  // Viewer controls
  const viewerControls = document.querySelectorAll('.viewer-controls button');
  viewerControls.forEach(control => {
    control.addEventListener('click', () => {
      console.log(`Viewer control clicked: ${control.dataset.tooltip}`);
    });
  });

  // Project switcher
  const projectSwitcher = document.querySelector('.project-switcher');
  projectSwitcher.addEventListener('click', () => {
    console.log('Project switcher clicked');
    // Here we would show project dropdown
  });

  // Search functionality
  const searchInput = document.querySelector('.search-bar input');
  searchInput.addEventListener('input', (e) => {
    if (e.target.value.length > 2) {
      console.log(`Searching for: ${e.target.value}`);
      // Here we would trigger search
    }
  });

  // Simulate real-time GPU updates
  setInterval(() => {
    const gpuValue = 70 + Math.floor(Math.random() * 20);
    const gpuStatus = document.querySelector('.gpu-status span');
    if (gpuStatus) {
      gpuStatus.textContent = `GPU ${gpuValue}%`;
    }
  }, 5000);

  // Simulate viewer loading
  setTimeout(() => {
    const hint = document.querySelector('.viewer-hint');
    if (hint) {
      hint.textContent = 'JAK3 structure loaded';
      setTimeout(() => {
        hint.style.opacity = '0';
      }, 2000);
    }
  }, 3000);
});