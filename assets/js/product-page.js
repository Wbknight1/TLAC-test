// Get product type and ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const productType = urlParams.get('type');
const productId = urlParams.get('id');
const baseApi = 'http://localhost:5171/api'
// Configure dynamic content based on product type
function configureDynamicContent(data) {
    const dynamicContent = document.getElementById('dynamicContent');
    
    switch(productType) {
        case 'trainer':
            // Create ratings HTML
            const ratingsHTML = data.ratings && data.ratings.length > 0 
                ? data.ratings.map(rating => `
                    <div class="rating-item mb-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="text-warning">
                                    ${'★'.repeat(rating.ratingNumber)}${'☆'.repeat(5-rating.ratingNumber)}
                                </span>
                                <small class="text-muted ms-2">${new Date(rating.ratingDate).toLocaleDateString()}</small>
                            </div>
                        </div>
                        <p class="mb-0 mt-1">${rating.comment || 'No comment provided'}</p>
                    </div>
                `).join('')
                : '<p class="text-muted">No ratings yet</p>';

            dynamicContent.innerHTML = `
                <div class="trainer-details">
                    <p class="mb-2"><strong>Full Name:</strong> ${data.fName || ''} ${data.lName || ''}</p>
                    <p class="mb-2"><strong>Username:</strong> ${data.username || 'N/A'}</p>
                    <p class="mb-2"><strong>Email:</strong> ${data.email || 'N/A'}</p>
                    <p class="mb-2"><strong>Specialty:</strong> ${data.specialityGroup || 'N/A'}</p>
                    <p class="mb-2"><strong>Cost per Session:</strong> $${data.cost || 50}</p>
                    
                    <div class="ratings-section mt-4">
                        <h4>Ratings & Reviews</h4>
                        <div class="rating-summary mb-3">
                            <h2 class="mb-0">${data.rating} <small class="text-muted">/ 5</small></h2>
                            <p class="text-muted">${data.ratings?.length || 0} reviews</p>
                        </div>
                        <div class="ratings-list">
                            ${ratingsHTML}
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'gym':
            dynamicContent.innerHTML = `
                <div class="gym-details">
                    <p class="mb-2"><strong>Location:</strong> ${data.address}</p>
                    <p class="mb-2"><strong>Hours:</strong> ${data.hours}</p>
                    <p class="mb-2"><strong>Equipment:</strong> ${data.equipment.join(', ')}</p>
                    <p class="mb-2"><strong>Amenities:</strong> ${data.amenities.join(', ')}</p>
                </div>
            `;
            break;
            
        case 'workout':
            // Show available trainers for this workout type
            const trainerCards = data.trainers.map(trainer => `
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="/TLAC-test/assets/images/trainers/${trainer.trainerID}.jpg" 
                                     class="img-fluid rounded-start h-100"
                                     style="object-fit: cover;"
                                     onerror="this.src='/TLAC-test/assets/images/defaults/profile-placeholder.jpg';"
                                     alt="${trainer.fName} ${trainer.lName}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${trainer.fName} ${trainer.lName}</h5>
                                    <p class="card-text">Specialty: ${trainer.specialityGroup}</p>
                                    <a href="traineeproductpage.html?type=trainer&id=${trainer.trainerID}" 
                                       class="btn btn-outline-brand">View Profile</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            
            dynamicContent.innerHTML = `
                <div class="trainer-list">
                    <h3 class="mb-4">Available Trainers</h3>
                    <div class="row">
                        ${trainerCards}
                    </div>
                </div>
            `;
            break;
    }
}

// Handle booking button visibility and modal configuration
function configureBooking() {
    const bookButton = document.getElementById('bookButton');
    const bookingModal = document.getElementById('bookingModal');
    
    if (productType !== 'trainer') {
        bookButton.style.display = 'none';
        return;
    }
    
    bookButton.addEventListener('click', () => {
        const modal = new bootstrap.Modal(bookingModal);
        modal.show();
    });
}

// Fetch product data from API
async function fetchProductData() {
    try {
        let data;
        
        switch(productType) {
            case 'trainer':
                console.log('Fetching trainer:', `${baseApi}/trainer/${productId}`);
                const response = await fetch(`${baseApi}/trainer/${productId}`);
                if (!response.ok) throw new Error('Failed to fetch trainer data');
                const trainerData = await response.json();
                console.log('Raw trainer data:', trainerData); // Debug log
                
                // If trainerData is an array with one item, take the first item
                const trainer = Array.isArray(trainerData) ? trainerData[0] : trainerData;
                
                // Fetch ratings for this trainer
                const ratings = await fetchRatings(trainer.trainerID);
                const avgRating = calculateAverageRating(ratings);
                
                data = {
                    ...trainer,
                    imageUrl: `/TLAC-test/assets/images/trainers/${trainer.trainerID || 'default'}.jpg`,
                    description: `Professional trainer specializing in ${trainer.specialityGroup}`,
                    fullName: `${trainer.fName} ${trainer.lName}`,
                    rating: avgRating,
                    ratings: ratings, // Store all ratings for display
                    price: trainer.cost || 50 // Use trainer's cost if available
                };
                break;
                
            case 'gym':
                const gymResponse = await fetch(`${baseApi}/gym/${productId}`);
                if (!gymResponse.ok) throw new Error('Failed to fetch gym data');
                const gymData = await gymResponse.json();
                const gym = Array.isArray(gymData) ? gymData[0] : gymData;
                
                data = {
                    ...gym,
                    imageUrl: `/TLAC-test/assets/images/gyms/gym1.jpg`,
                    description: gym.address ? `Located at ${gym.address}` : 'Location information not available',
                    rating: 'N/A',
                    price: gym.cost || 30,
                    equipment: ['Treadmills', 'Weight Machines', 'Free Weights'],
                    amenities: ['Showers', 'Lockers', 'Parking']
                };
                break;
                
            case 'workout':
                const workoutCategory = urlParams.get('category');
                const trainersResponse = await fetch(`${baseApi}/trainer`);
                if (!trainersResponse.ok) throw new Error('Failed to fetch trainers');
                const trainers = await trainersResponse.json();
                
                data = {
                    name: workoutCategory,
                    description: `Find specialized trainers for ${workoutCategory} training.`,
                    trainers: trainers.filter(t => t.specialityGroup === workoutCategory),
                    imageUrl: `/TLAC-test/assets/images/workouts/workout1.jpg`
                };
                break;
                
            default:
                throw new Error('Invalid product type');
        }

        if (!data) throw new Error('No data received');
        console.log('Processed data:', data); // Debug log
        return data;
    } catch (error) {
        console.error('Error fetching product data:', error);
        document.getElementById('productDetails').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Failed to load product details. Please try again later.
            </div>`;
        throw error; // Re-throw to handle in initializePage
    }
}

// Populate page content with data
function populatePageContent(data) {
    console.log('Populating content with:', data); // Debug log
    
    // Set basic product info with better fallbacks
    document.getElementById('productName').textContent = 
        (data.name || `${data.fName || ''} ${data.lName || ''}` || 'Name Not Available').trim();
    
    document.getElementById('productImage').src = data.imageUrl;
    document.getElementById('productImage').onerror = function() {
        this.src = '/TLAC-test/assets/images/defaults/profile-placeholder.jpg';
    };
    
    document.getElementById('productRating').textContent = data.rating || 'N/A';
    document.getElementById('productDescription').textContent = data.description || 'No description available';
    
    const priceElement = document.getElementById('productPrice');
    const price = data.price || data.cost;
    if (price) {
        priceElement.textContent = `$${Number(price).toFixed(2)}`;
    } else {
        priceElement.style.display = 'none';
    }
    
    configureDynamicContent(data);
}

// Load similar suggestions based on product type
async function loadSuggestions() {
    try {
        let suggestions = [];
        
        switch(productType) {
            case 'trainer':
                // Get all trainers and filter out current one
                const trainerResponse = await fetch(`${baseApi}/trainer`);
                if (!trainerResponse.ok) throw new Error('Failed to fetch trainers');
                const trainers = await trainerResponse.json();
                
                // Get ratings for all trainers
                const trainerPromises = trainers
                    .filter(t => t.trainerID != productId)
                    .slice(0, 6)
                    .map(async trainer => {
                        const ratings = await fetchRatings(trainer.trainerID);
                        return {
                            id: trainer.trainerID,
                            fullName: `${trainer.fName} ${trainer.lName}`,
                            imageUrl: `/TLAC-test/assets/images/trainers/${trainer.trainerID}.jpg`,
                            shortDescription: `Specializes in ${trainer.specialityGroup}`,
                            rating: calculateAverageRating(ratings)
                        };
                    });
                
                suggestions = await Promise.all(trainerPromises);
                break;

            case 'gym':
                // Get all gyms and filter out current one
                const gymResponse = await fetch(`${baseApi}/gym`);
                const gyms = await gymResponse.json();
                suggestions = gyms
                    .filter(g => g.gymID != productId)
                    .slice(0, 6)
                    .map(gym => ({
                        id: gym.gymID,
                        name: gym.name,
                        imageUrl: `/TLAC-test/assets/images/gyms/${gym.gymID}.jpg`,
                        shortDescription: gym.address,
                        rating: gym.rating || 'N/A'
                    }));
                break;

            case 'workout':
                // For workouts, get other workout types from trainers
                const workoutResponse = await fetch(`${baseApi}/trainer`);
                const allTrainers = await workoutResponse.json();
                const currentCategory = urlParams.get('category');
                const workoutTypes = [...new Set(allTrainers.map(t => t.specialityGroup))]
                    .filter(type => type !== currentCategory)
                    .slice(0, 6);
                    
                suggestions = workoutTypes.map(type => ({
                    id: encodeURIComponent(type),
                    name: type,
                    imageUrl: `/TLAC-test/assets/images/workouts/workout1.jpg`,
                    shortDescription: `Find ${type} training specialists`,
                    rating: null // Workouts don't have ratings
                }));
                break;
        }

        // Populate suggestion cards
        const cards1 = document.getElementById('suggestionCards1');
        const cards2 = document.getElementById('suggestionCards2');
        
        cards1.innerHTML = ''; // Clear existing cards
        cards2.innerHTML = '';

        suggestions.slice(0, 3).forEach(item => {
            cards1.innerHTML += createSuggestionCard(item);
        });
        
        suggestions.slice(3, 6).forEach(item => {
            cards2.innerHTML += createSuggestionCard(item);
        });
    } catch (error) {
        console.error('Error loading suggestions:', error);
    }
}

// Create HTML for suggestion cards
function createSuggestionCard(item) {
    return `
        <div class="col">
            <div class="card h-100">
                <img src="${item.imageUrl}" 
                     class="card-img-top" 
                     alt="${item.name || item.fullName}"
                     onerror="this.src='/TLAC-test/assets/images/defaults/profile-placeholder.jpg';">
                <div class="card-body">
                    <h5 class="card-title">${item.name || item.fullName}</h5>
                    <p class="card-text">${item.shortDescription || ''}</p>
                    ${item.rating ? `
                    <div class="rating">
                        <span>${item.rating} <i class="ri-star-fill text-warning"></i></span>
                    </div>
                    ` : ''}
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    ${productType === 'workout' 
                        ? `<a href="traineeproductpage.html?type=workout&category=${item.id}" class="btn btn-outline-brand w-100">View Trainers</a>`
                        : `<a href="traineeproductpage.html?type=${productType}&id=${item.id}" class="btn btn-outline-brand w-100">View Details</a>`
                    }
                </div>
            </div>
        </div>
    `;
}

// New function to fetch ratings
async function fetchRatings(trainerID) {
    try {
        const response = await fetch(`${baseApi}/Rating/trainer/${trainerID}`);
        if (!response.ok) return [];
        const ratings = await response.json();
        return ratings;
    } catch (error) {
        console.error('Error fetching ratings:', error);
        return [];
    }
}

// New function to calculate average rating
function calculateAverageRating(ratings) {
    if (!ratings || ratings.length === 0) return 'N/A';
    const sum = ratings.reduce((acc, rating) => acc + rating.ratingNumber, 0);
    return (sum / ratings.length).toFixed(1);
}

// Initialize page
async function initializePage() {
    try {
        const data = await fetchProductData();
        if (data) {
            populatePageContent(data);
            configureBooking();
            await loadSuggestions();
        }
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

// Start initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);