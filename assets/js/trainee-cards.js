class CardManager {
    constructor() {
        this.trainerContainer = document.getElementById('trainerCards');
        this.gymContainer = document.getElementById('gymCards');
        this.apiBase = 'http://localhost:5171/api';
    }

    async loadCards() {
        try {
            await Promise.all([
                this.loadTrainers(),
                this.loadGyms()
            ]);
        } catch (error) {
            console.error('Error loading cards:', error);
        }
    }

    async loadTrainers() {
        try {
            // Get trainers
            const trainersResponse = await fetch(`${this.apiBase}/Trainer`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            // Get ratings
            const ratingsResponse = await fetch(`${this.apiBase}/Rating`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!trainersResponse.ok || !ratingsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const trainers = await trainersResponse.json();
            const ratings = await ratingsResponse.json();

            // Calculate average ratings
            const trainerRatings = trainers.map(trainer => {
                const trainerRatings = ratings.filter(r => r.trainerID === trainer.trainerID);
                const avgRating = trainerRatings.length > 0
                    ? (trainerRatings.reduce((sum, r) => sum + r.ratingNumber, 0) / trainerRatings.length).toFixed(1)
                    : 'New';
                return { ...trainer, avgRating };
            });

            const shuffledTrainers = [...trainerRatings].sort(() => Math.random() - 0.5);
            const newTrainers = shuffledTrainers.slice(0, 6);
            

            const trainerCards = newTrainers.map(trainer => `
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <div class="card-img-wrapper" style="height: 200px; overflow: hidden;">
                            <img src="/TLAC-test/assets/images/trainers/${trainer.trainerID}.jpg" 
                                 class="card-img-top h-100 w-100"
                                 style="object-fit: cover;"
                                 onerror="this.src='/TLAC-test/assets/images/default-gym.jpg'"
                                 alt="Default Image">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title mb-1">${trainer.fName} ${trainer.lName}</h5>
                            <p class="card-text">
                                <i class="ri-mail-line me-2"></i>${trainer.email}<br>
                                <i class="ri-focus-2-line me-2"></i>${trainer.specialityGroup}<br>
                                <i class="ri-star-line me-2"></i>Rating: ${trainer.avgRating}${trainer.avgRating !== 'New' ? '/5.0' : ''}
                            </p>
                            <a href="/TLAC-test/pages/traineeproductpage.html?type=trainer&id=${trainer.trainerID}" 
                               class="btn btn-brand">Profile</a>
                        </div>
                    </div>
                </div>
            `).join('');

            this.trainerContainer.innerHTML = trainerCards;
        } catch (error) {
            console.error('Error loading trainers:', error);
            this.trainerContainer.innerHTML = '<div class="col"><p>Error loading trainers</p></div>';
        }
    }

    async loadGyms() {
        try {
            const response = await fetch(`${this.apiBase}/Gym`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('Gym response status:', response.status);
            const responseText = await response.text();
            console.log('Gym response body:', responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const gyms = JSON.parse(responseText);
            if (!Array.isArray(gyms)) {
                throw new Error('Expected array of gyms');
            }

            // Get top 3 gyms for preview
            const previewGyms = gyms.slice(0, 3); // Only show first 3 gyms
            
            const gymCards = previewGyms.map(gym => `
                <div class="col">
                    <div class="card shadow-sm h-100">
                        <div class="card-img-wrapper" style="height: 200px; overflow: hidden;">
                            <img src="/TLAC-test/assets/images/gyms/${gym.checkOutID}.jpg" 
                                 class="card-img-top h-100 w-100"
                                 style="object-fit: cover;"
                                 onerror="this.src='/TLAC-test/assets/images/default-gym.jpg'"
                                 alt="Gym Image">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="mb-3">
                                <h5 class="card-title mb-1">${gym.gymName}</h5>
                            <p class="card-text">
                                <i class="ri-map-pin-line me-2"></i>${gym.address}<br>
                                <i class="ri-money-dollar-circle-line me-2"></i>${gym.gymCost}/month<br>
                            </p>
                            </div>
                            <div class="text-end mt-auto">
                                <a href="/TLAC-test/pages/traineeproductpage.html?type=gym&id=${gym.checkOutID}" 
                                   class="btn btn-brand">View Details</a>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            this.gymContainer.innerHTML = gymCards || '<div class="col-12 text-center">No gyms available</div>';
        } catch (error) {
            console.error('Error loading gyms:', error);
            this.displayErrorMessage('gyms');
        }
    }

    displayErrorMessage(type) {
        const container = type === 'gyms' ? this.gymContainer : this.trainerContainer;
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">Temporarily Unavailable</h4>
                    <p>We're having trouble loading the ${type} data right now. Please try again in a few moments.</p>
                    <button onclick="window.location.reload()" class="btn btn-sm btn-outline-warning">
                        <i class="ri-refresh-line"></i> Retry
                    </button>
                </div>
            </div>`;
    }
}

// Initialize with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        const cardManager = new CardManager();
        cardManager.loadCards();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});