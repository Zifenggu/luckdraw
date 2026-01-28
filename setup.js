// Setup Page Logic
class SetupManager {
    constructor() {
        this.checkAuth();
        this.init();
    }

    checkAuth() {
        const isLoggedIn = sessionStorage.getItem('luckyDrawLoggedIn');
        if (isLoggedIn !== 'true') {
            window.location.href = 'index.html';
        }
    }

    init() {
        this.setupEventListeners();
        this.loadExistingConfig();
        this.addAwardItem();
    }

    setupEventListeners() {
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.removeItem('luckyDrawLoggedIn');
            window.location.href = 'index.html';
        });

        // Participant input
        document.getElementById('participantNumbers').addEventListener('input', () => {
            this.updateCounts();
        });

        // File upload
        document.getElementById('participantFile').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });

        // Add award
        document.getElementById('addAwardBtn').addEventListener('click', () => {
            this.addAwardItem();
        });

        // Save configuration
        document.getElementById('saveConfigBtn').addEventListener('click', () => {
            this.saveConfiguration();
        });

        // Save and start drawing
        document.getElementById('saveAndDrawBtn').addEventListener('click', () => {
            this.saveConfiguration(true);
        });
    }

    loadExistingConfig() {
        const config = localStorage.getItem('luckyDrawConfig');
        if (config) {
            try {
                const data = JSON.parse(config);
                
                // Load participants
                if (data.participants) {
                    document.getElementById('participantNumbers').value = data.participants.join('\n');
                }
                
                // Load awards
                if (data.awards && data.awards.length > 0) {
                    document.getElementById('awardsList').innerHTML = '';
                    data.awards.forEach(award => {
                        this.addAwardItem(award.name, award.count);
                    });
                }
                
                this.updateCounts();
            } catch (e) {
                console.error('Error loading config:', e);
            }
        }
    }

    updateCounts() {
        const participants = this.parseParticipantNumbers();
        const awards = this.getAwardsConfig();
        const totalWinners = awards.reduce((sum, award) => sum + award.count, 0);

        document.getElementById('participantCount').textContent = participants.length;
        document.getElementById('summaryParticipants').textContent = participants.length;
        document.getElementById('summaryAwards').textContent = awards.length;
        document.getElementById('summaryWinners').textContent = totalWinners;
    }

    parseParticipantNumbers() {
        const text = document.getElementById('participantNumbers').value;
        if (!text.trim()) return [];
        
        const numbers = text.split(/[\s,\n]+/)
            .map(n => n.trim())
            .filter(n => n.length > 0)
            .filter((v, i, a) => a.indexOf(v) === i);
        
        return numbers;
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            document.getElementById('participantNumbers').value = text;
            this.updateCounts();
        };
        reader.readAsText(file);
    }

    addAwardItem(name = '', count = '') {
        const awardsList = document.getElementById('awardsList');
        const awardId = Date.now();
        
        const awardItem = document.createElement('div');
        awardItem.className = 'award-item';
        awardItem.dataset.id = awardId;
        awardItem.innerHTML = `
            <input type="text" placeholder="Award Name (e.g., First Prize)" class="award-name" value="${name}" required>
            <input type="number" placeholder="Number of Winners" class="award-count" min="1" value="${count}" required>
            <button type="button" class="btn-remove" onclick="setupManager.removeAwardItem(${awardId})">✕</button>
        `;
        
        // Add event listeners for real-time updates
        const inputs = awardItem.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateCounts());
        });
        
        awardsList.appendChild(awardItem);
        this.updateCounts();
    }

    removeAwardItem(awardId) {
        const item = document.querySelector(`[data-id="${awardId}"]`);
        if (item) {
            item.remove();
            this.updateCounts();
        }
    }

    getAwardsConfig() {
        const awards = [];
        const awardItems = document.querySelectorAll('.award-item');
        
        awardItems.forEach(item => {
            const name = item.querySelector('.award-name').value.trim();
            const count = parseInt(item.querySelector('.award-count').value);
            
            if (name && count > 0) {
                awards.push({ name, count, winners: [] });
            }
        });
        
        return awards;
    }

    saveConfiguration(startDrawing = false) {
        const participants = this.parseParticipantNumbers();
        const awards = this.getAwardsConfig();

        // Validation
        if (participants.length === 0) {
            this.showStatus('❌ Please enter participant numbers!', 'error');
            return false;
        }

        if (awards.length === 0) {
            this.showStatus('❌ Please configure at least one award!', 'error');
            return false;
        }

        const totalWinners = awards.reduce((sum, award) => sum + award.count, 0);
        if (totalWinners > participants.length) {
            this.showStatus(`❌ Total winners (${totalWinners}) cannot exceed total participants (${participants.length})!`, 'error');
            return false;
        }

        // Save to localStorage
        const config = {
            participants: participants,
            awards: awards,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('luckyDrawConfig', JSON.stringify(config));
        
        // Clear any existing draw state
        localStorage.removeItem('luckyDrawState');
        
        this.showStatus('✅ Configuration saved successfully!', 'success');

        if (startDrawing) {
            setTimeout(() => {
                window.location.href = 'draw.html';
            }, 1000);
        }

        return true;
    }

    showStatus(message, type) {
        const statusEl = document.getElementById('statusMessage');
        statusEl.textContent = message;
        statusEl.className = `status-message ${type}`;
        statusEl.style.display = 'block';

        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);
    }
}

// Initialize
const setupManager = new SetupManager();