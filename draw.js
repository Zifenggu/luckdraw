// Draw Page Logic
class DrawManager {
    constructor() {
        this.checkAuth();
        this.participants = [];
        this.awards = [];
        this.currentAwardIndex = 0;
        this.currentAwardWinners = [];
        this.allResults = [];
        this.isDrawing = false;
        
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
        this.loadConfiguration();
    }

    setupEventListeners() {
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.removeItem('luckyDrawLoggedIn');
            window.location.href = 'index.html';
        });

        // Draw button
        document.getElementById('drawBtn').addEventListener('click', () => {
            this.drawWinner();
        });

        // Next award
        document.getElementById('nextAwardBtn').addEventListener('click', () => {
            this.nextAward();
        });

        // View results
        document.getElementById('viewResultsBtn').addEventListener('click', () => {
            this.showResults();
        });

        // Export results
        document.getElementById('exportResultsBtn').addEventListener('click', () => {
            this.exportResults();
        });

        // Back to draw
        document.getElementById('backToDrawBtn').addEventListener('click', () => {
            this.showSection('drawingSection');
        });

        // New draw
        document.getElementById('newDrawBtn').addEventListener('click', () => {
            this.newDraw();
        });
    }

    loadConfiguration() {
        const config = localStorage.getItem('luckyDrawConfig');
        
        if (!config) {
            this.showNoConfigMessage();
            return;
        }

        try {
            const data = JSON.parse(config);
            
            // Check if there's an existing draw state
            const savedState = localStorage.getItem('luckyDrawState');
            if (savedState) {
                this.loadDrawState(JSON.parse(savedState));
            } else {
                // Start fresh draw
                this.participants = [...data.participants];
                this.awards = data.awards.map(a => ({ ...a, winners: [] }));
                this.currentAwardIndex = 0;
                this.allResults = [];
                this.startAward(0);
            }
        } catch (e) {
            console.error('Error loading configuration:', e);
            this.showNoConfigMessage();
        }
    }

    loadDrawState(state) {
        this.participants = state.participants;
        this.awards = state.awards;
        this.currentAwardIndex = state.currentAwardIndex;
        this.allResults = state.allResults;
        
        if (this.currentAwardIndex < this.awards.length) {
            this.startAward(this.currentAwardIndex);
        } else {
            this.showResults();
        }
    }

    saveDrawState() {
        const state = {
            participants: this.participants,
            awards: this.awards,
            currentAwardIndex: this.currentAwardIndex,
            allResults: this.allResults
        };
        localStorage.setItem('luckyDrawState', JSON.stringify(state));
    }

    showNoConfigMessage() {
        document.getElementById('noConfigMessage').style.display = 'block';
        document.getElementById('drawBtn').disabled = true;
        document.getElementById('currentAwardName').textContent = '-';
        document.getElementById('remainingCount').textContent = '-';
    }

    startAward(index) {
        this.currentAwardIndex = index;
        this.currentAwardWinners = this.awards[index].winners || [];
        
        const award = this.awards[index];
        document.getElementById('currentAwardName').textContent = award.name;
        document.getElementById('currentAwardWinnersTitle').textContent = award.name;
        document.getElementById('remainingCount').textContent = award.count - this.currentAwardWinners.length;
        
        // Display existing winners
        document.getElementById('currentWinners').innerHTML = '';
        this.currentAwardWinners.forEach(winner => {
            this.displayCurrentWinner(winner);
        });
        
        document.getElementById('drawBtn').disabled = false;
        document.getElementById('nextAwardBtn').style.display = 'none';
        document.getElementById('viewResultsBtn').style.display = 'none';
        document.getElementById('noConfigMessage').style.display = 'none';
    }

    async drawWinner() {
        if (this.isDrawing) return;
        
        const award = this.awards[this.currentAwardIndex];
        
        if (this.participants.length === 0) {
            alert('No more participants available!');
            return;
        }
        
        if (this.currentAwardWinners.length >= award.count) {
            alert('All winners for this award have been drawn!');
            return;
        }
        
        this.isDrawing = true;
        document.getElementById('drawBtn').disabled = true;
        
        // Rolling animation
        const rollingNumber = document.getElementById('rollingNumber');
        rollingNumber.classList.add('rolling');
        
        let rollCount = 0;
        const rollInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * this.participants.length);
            rollingNumber.textContent = this.participants[randomIndex];
            rollCount++;
            
            if (rollCount > 30) {
                clearInterval(rollInterval);
                this.selectWinner(rollingNumber);
            }
        }, 100);
    }

    selectWinner(rollingNumber) {
        // Select random winner
        const randomIndex = Math.floor(Math.random() * this.participants.length);
        const winner = this.participants[randomIndex];
        
        // Remove from participants pool
        this.participants.splice(randomIndex, 1);
        
        // Display winner
        rollingNumber.textContent = winner;
        rollingNumber.classList.remove('rolling');
        rollingNumber.classList.add('winner');
        
        setTimeout(() => {
            rollingNumber.classList.remove('winner');
        }, 500);
        
        // Add to current award winners
        this.currentAwardWinners.push(winner);
        this.awards[this.currentAwardIndex].winners = [...this.currentAwardWinners];
        this.displayCurrentWinner(winner);
        
        // Update remaining count
        const award = this.awards[this.currentAwardIndex];
        const remaining = award.count - this.currentAwardWinners.length;
        document.getElementById('remainingCount').textContent = remaining;
        
        // Save state
        this.saveDrawState();
        
        // Check if award is complete
        if (remaining === 0) {
            // Add to results if not already there
            const existingResult = this.allResults.find(r => r.name === award.name);
            if (!existingResult) {
                this.allResults.push({
                    name: award.name,
                    winners: [...this.currentAwardWinners]
                });
            } else {
                existingResult.winners = [...this.currentAwardWinners];
            }
            
            this.saveDrawState();
            
            // Check if there are more awards
            if (this.currentAwardIndex < this.awards.length - 1) {
                document.getElementById('nextAwardBtn').style.display = 'inline-block';
            } else {
                // All awards complete
                document.getElementById('viewResultsBtn').style.display = 'inline-block';
            }
        } else {
            document.getElementById('drawBtn').disabled = false;
        }
        
        this.isDrawing = false;
    }

    displayCurrentWinner(winner) {
        const winnersContainer = document.getElementById('currentWinners');
        const badge = document.createElement('div');
        badge.className = 'winner-badge';
        badge.textContent = winner;
        winnersContainer.appendChild(badge);
    }

    nextAward() {
        this.startAward(this.currentAwardIndex + 1);
    }

    showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    showResults() {
        const resultsContainer = document.getElementById('allResults');
        resultsContainer.innerHTML = '';
        
        // Use awards array which has the winners
        this.awards.forEach(award => {
            if (award.winners && award.winners.length > 0) {
                const awardDiv = document.createElement('div');
                awardDiv.className = 'award-result';
                
                const title = document.createElement('h3');
                title.textContent = `${award.name} (${award.winners.length} winners)`;
                awardDiv.appendChild(title);
                
                const winnersList = document.createElement('div');
                winnersList.className = 'winners-list';
                
                award.winners.forEach(winner => {
                    const badge = document.createElement('div');
                    badge.className = 'winner-badge';
                    badge.textContent = winner;
                    winnersList.appendChild(badge);
                });
                
                awardDiv.appendChild(winnersList);
                resultsContainer.appendChild(awardDiv);
            }
        });
        
        this.showSection('resultsSection');
    }

    exportResults() {
        let csvContent = "Award,Winner Number\n";
        
        this.awards.forEach(award => {
            if (award.winners && award.winners.length > 0) {
                award.winners.forEach(winner => {
                    csvContent += `"${award.name}","${winner}"\n`;
                });
            }
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.setAttribute('href', url);
        link.setAttribute('download', `lucky_draw_results_${timestamp}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    newDraw() {
        if (confirm('Start a new lucky draw? This will clear all current data and return to setup.')) {
            localStorage.removeItem('luckyDrawState');
            localStorage.removeItem('luckyDrawConfig');
            window.location.href = 'setup.html';
        }
    }
}

// Initialize
const drawManager = new DrawManager();