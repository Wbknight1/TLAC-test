class CatalogManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.currentCategory = 'trainers';
        this.apiBase = 'http://localhost:5171/api';
        this.searchQuery = '';
        this.sortBy = 'name';
        this.filters = {
            rating: { min: 0, max: 5 },
            price: { min: 0, max: 1000 },
            location: '',
            workoutTypes: []
        };
    }

    async init() {
        this.initializeEventListeners();
        await this.loadCards();
    }

    async loadCards() {
        try {
            await Promise.all([
                this.loadTrainers(),
                this.loadGyms(),
                this.loadWorkouts()
            ]);
        } catch (error) {
            console.error('Error loading cards:', error);
            this.handleError(error);
        }
    }

    async loadTrainers() {
        try {
          const trainersResponse = await fetch(`${this.apiBase}/Trainer`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache",
            },
          });

          if (!trainersResponse.ok) {
            throw new Error("Failed to fetch trainers");
          }

          const trainers = await trainersResponse.json();

          // Try to get ratings, but don't fail if unavailable
          let ratings = [];
          try {
            const ratingsResponse = await fetch(`${this.apiBase}/Rating`, {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            });
            if (ratingsResponse.ok) {
              ratings = await ratingsResponse.json();
            }
          } catch (error) {
            console.warn("Ratings unavailable:", error);
          }

          // Calculate average ratings
          const trainerRatings = trainers.map((trainer) => {
            const trainerRatings = ratings.filter(
              (r) => r.trainerID === trainer.trainerID
            );
            const avgRating =
              trainerRatings.length > 0
                ? (
                    trainerRatings.reduce(
                      (sum, r) => sum + (r.ratingNumber || 0),
                      0
                    ) / trainerRatings.length
                  ).toFixed(1)
                : "New";
            return { ...trainer, avgRating };
          });
          // let ratings = [];

          // try {
          //     const ratingsResponse = await fetch(`${this.apiBase}/Rating`, {
          //         method: 'GET',
          //         headers: {
          //             'Accept': 'application/json',
          //         }
          //     });

          //     if (ratingsResponse.ok) {
          //         ratings = await ratingsResponse.json();
          //         console.log('Raw ratings:', ratings); // Debug log

          //         // Update property names to match C# model
          //         ratings = ratings.filter(r => {
          //             const isValid = r &&
          //                 typeof r.ratingID !== 'undefined' &&  // Changed from ratingId
          //                 r.trainerID !== null &&              // Changed from trainerId
          //                 r.ratingNumber !== null &&
          //                 !isNaN(Number(r.ratingNumber)) &&
          //                 Number(r.ratingNumber) >= 0 &&
          //                 Number(r.ratingNumber) <= 5;

          //             if (!isValid) {
          //                 console.warn('Invalid rating found:', r);
          //             }
          //             return isValid;
          //         });
          //     } else {
          //         console.warn(`Ratings service error: ${ratingsResponse.status}`);
          //         // Add user-visible warning
          //         const warningDiv = document.createElement('div');
          //         warningDiv.className = 'alert alert-warning alert-dismissible fade show';
          //         warningDiv.innerHTML = `
          //             <strong>Notice:</strong> Rating information is temporarily unavailable.
          //             <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          //         `;
          //         document.querySelector('main')?.prepend(warningDiv);
          //     }
          // } catch (ratingError) {
          //     console.warn('Error fetching ratings:', ratingError);
          //     ratings = []; // Ensure ratings is empty on error
          // }

          // const trainerResults = document.getElementById('trainerResults');
          // if (!trainerResults) return;

          // // Map trainers with ratings, update property names
          // const trainersWithRatings = trainers.map(trainer => {
          //     let avgRating = 'New';
          //     if (ratings.length > 0 && trainer && trainer.trainerID) {
          //         const trainerRatings = ratings.filter(r =>
          //             r &&
          //             r.trainerID &&
          //             r.trainerID === trainer.trainerID &&
          //             r.ratingNumber !== null
          //         );
          //         if (trainerRatings.length > 0) {
          //             const validRatings = trainerRatings.filter(r => !isNaN(Number(r.ratingNumber)));
          //             if (validRatings.length > 0) {
          //                 const sum = validRatings.reduce((acc, r) => acc + Number(r.ratingNumber), 0);
          //                 avgRating = (sum / validRatings.length).toFixed(1);
          //             }
          //         }
          //     }
          //     return { ...trainer, avgRating };
          // });

          const filteredTrainers = this.filterAndSortData(trainerRatings);

          const trainerCards = filteredTrainers
            .map(
              (trainer) => `
                <div class="col">
                    <div class="card shadow-sm h-100">
                        <div class="card-img-wrapper" style="height: 200px; overflow: hidden;">
                            <img src="/TLAC-test/assets/images/trainers/${
                              trainer.trainerID
                            }.jpg" 
                                 class="card-img-top w-100 h-100" style="object-fit: cover;" 
                                 onerror="this.onerror=null; this.src='/TLAC-test/assets/images/defaults/profile-placeholder.jpg';"
                                 alt="${trainer.fName} ${trainer.lName}">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title mb-1">${trainer.fName} ${
                trainer.lName
              }</h5>
                            <p class="card-text">
                                <i class="ri-mail-line me-2"></i>${
                                  trainer.email
                                }<br>
                                <i class="ri-focus-2-line me-2"></i>${
                                  trainer.specialityGroup
                                }<br>
                                <i class="ri-star-line me-2"></i>Rating: ${
                                  trainer.avgRating
                                }${trainer.avgRating !== "New" ? "/5.0" : ""}
                            </p>
                            <a href="/TLAC-test/pages/traineeproductpage.html?type=trainer&id=${
                              trainer.trainerID
                            }" 
                               class="btn btn-brand mt-auto">View Profile</a>
                        </div>
                    </div>
                </div>
            `
            )
            .join("");

          trainerResults.innerHTML =
            trainerCards ||
            '<div class="col-12 text-center">No trainers found</div>';
        } catch (error) {
            console.error('Error loading trainers:', error);
            this.displayErrorMessage('trainers');
        }
    }

    async loadGyms() {
        try {
            const response = await fetch(`${this.apiBase}/Gym`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const gyms = await response.json();
            const gymResults = document.getElementById('gymResults');
            if (!gymResults) return;

            const filteredGyms = this.filterAndSortData(gyms);
            const gymCards = filteredGyms.map(gym => `
                <div class="col">
                    <div class="card shadow-sm h-100">
                        <div class="card-img-wrapper" style="height: 200px; overflow: hidden;">
                            <img src="/TLAC-test/assets/images/gyms/${gym.checkOutID}.jpg" 
                                 class="card-img-top w-100 h-100" style="object-fit: cover;" 
                                 onerror="this.onerror=null; this.src='/TLAC-test/assets/images/defaults/gym-placeholder.jpg';"
                                 alt="${gym.gymName}">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title mb-1">${gym.gymName}</h5>
                            <p class="card-text">
                                <i class="ri-map-pin-line me-2"></i>${gym.address}<br>
                                <i class="ri-money-dollar-box-line me-2"></i>${gym.gymCost}/month
                            </p>
                            <a href="/TLAC-test/pages/traineeproductpage.html?type=gym&id=${gym.checkOutID}" 
                               class="btn btn-brand mt-auto">View Details</a>
                        </div>
                    </div>
                </div>
            `).join('');

            gymResults.innerHTML = gymCards || '<div class="col-12 text-center">No gyms found</div>';
        } catch (error) {
            console.error('Error loading gyms:', error);
            this.displayErrorMessage('gyms');
        }
    }

    async loadWorkouts() {
        try {
            const response = await fetch(`${this.apiBase}/Trainer`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch trainers');
            }

            const trainers = await response.json();
            const workoutTypes = [...new Set(trainers.map(t => t.specialityGroup))];
            
            const workoutResults = document.getElementById('workoutResults');
            if (!workoutResults) return;

            const workoutCards = workoutTypes.map((workout, index) => `
                <div class="col">
                    <div class="card shadow-sm h-100">
                        <div class="card-img-wrapper" style="height: 200px; overflow: hidden;">
                            <img src="/TLAC-test/assets/images/workouts/workout${(index % 5) + 1}.jpg" 
                                 class="card-img-top w-100 h-100" style="object-fit: cover;" 
                                 alt="${workout}">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title mb-1">${workout}</h5>
                            <p class="card-text">
                                <i class="ri-user-line me-2"></i>${trainers.filter(t => t.specialityGroup === workout).length} Trainers<br>
                                <i class="ri-focus-2-line me-2"></i>Specialized Training
                            </p>
                            <a href="/TLAC-test/pages/traineeproductpage.html?type=workout&category=${encodeURIComponent(workout)}" 
                               class="btn btn-brand mt-auto">View Workouts</a>
                        </div>
                    </div>
                </div>
            `).join('');

            workoutResults.innerHTML = workoutCards || '<div class="col-12 text-center">No workout categories available</div>';
        } catch (error) {
            console.error('Error loading workouts:', error);
            this.displayErrorMessage('workouts');
        }
    }

    handleError(error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.textContent = 'Failed to load data. Please try again later.';
        document.querySelector('main').prepend(errorDiv);
        console.error('Error:', error);
    }

    initializeEventListeners() {
        // Tab change handler
        document.querySelectorAll('#catalogTabs button').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-bs-target').replace('#', '');
                this.currentCategory = category;
                this.currentPage = 1;
                this.refreshCurrentView(); // Fix: Changed from loadCatalogData to refreshCurrentView
            });
        });

        // Search handler
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => this.handleSearch(), 300));
        }

        // Sort handler
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));
        }

        // Filter modal apply button
        const applyFiltersBtn = document.querySelector('#filterModal .btn-brand');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                const minRating = document.getElementById('minRating')?.value;
                const maxRating = document.getElementById('maxRating')?.value;
                const minPrice = document.getElementById('minPrice')?.value;
                const maxPrice = document.getElementById('maxPrice')?.value;
                
                const filters = {
                    rating: {
                        min: minRating ? parseFloat(minRating) : 0,
                        max: maxRating ? parseFloat(maxRating) : 5
                    },
                    price: {
                        min: minPrice ? parseFloat(minPrice) : 0,
                        max: maxPrice ? parseFloat(maxPrice) : 1000
                    },
                    location: document.getElementById('locationSelect')?.value || '',
                    workoutTypes: Array.from(document.querySelectorAll('input[name="workoutType"]:checked'))
                        .map(cb => cb.value)
                };
                this.handleFilter(filters);
                
                // Close the modal after applying filters
                const modalElement = document.getElementById('filterModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal?.hide();
            });
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleSearch() {
        this.searchQuery = document.getElementById('searchInput').value.toLowerCase();
        this.refreshCurrentView();
    }

    handleSort(sortBy) {
        this.sortBy = sortBy;
        this.refreshCurrentView();
    }

    handleFilter(filters) {
        this.filters = { ...this.filters, ...filters };
        this.refreshCurrentView();
    }

    async refreshCurrentView() {
        switch (this.currentCategory) {
            case 'trainers':
                await this.loadTrainers();
                break;
            case 'gyms':
                await this.loadGyms();
                break;
            case 'workouts':
                await this.loadWorkouts();
                break;
        }
    }

    filterAndSortData(data) {
        let filtered = [...data];

        // Apply search
        if (this.searchQuery) {
            filtered = filtered.filter(item => {
                const searchStr = this.searchQuery.toLowerCase();
                if ('fName' in item) { // Trainer
                    return `${item.fName} ${item.lName}`.toLowerCase().includes(searchStr) ||
                           item.email.toLowerCase().includes(searchStr) ||
                           item.specialityGroup.toLowerCase().includes(searchStr);
                } else if ('gymName' in item) { // Gym
                    return item.gymName.toLowerCase().includes(searchStr) ||
                           item.address.toLowerCase().includes(searchStr);
                }
                return true;
            });
        }

        // Apply filters
        filtered = filtered.filter(item => {
            let passes = true;

            // Rating filter (for trainers)
            if ('avgRating' in item && item.avgRating !== 'New') {
                const rating = parseFloat(item.avgRating);
                if (rating < this.filters.rating.min || rating > this.filters.rating.max) {
                    passes = false;
                }
            }

            // Price filter (for gyms)
            if ('gymCost' in item) {
                const price = parseFloat(item.gymCost);
                if (price < this.filters.price.min || price > this.filters.price.max) {
                    passes = false;
                }
            }

            // Location filter
            if (this.filters.location && 'address' in item) {
                if (!item.address.toLowerCase().includes(this.filters.location.toLowerCase())) {
                    passes = false;
                }
            }

            // Workout type filter
            if (this.filters.workoutTypes.length > 0 && 'specialityGroup' in item) {
                if (!this.filters.workoutTypes.includes(item.specialityGroup)) {
                    passes = false;
                }
            }

            return passes;
        });

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'rating':
                    const ratingA = a.avgRating === 'New' ? -1 : parseFloat(a.avgRating || 0);
                    const ratingB = b.avgRating === 'New' ? -1 : parseFloat(b.avgRating || 0);
                    return ratingB - ratingA;
                case 'price':
                    const priceA = parseFloat(a.gymCost || a.cost || 0);
                    const priceB = parseFloat(b.gymCost || b.cost || 0);
                    return priceB - priceA;
                case 'name':
                    const nameA = (a.fName && a.lName) ? `${a.fName} ${a.lName}` : (a.gymName || '');
                    const nameB = (b.fName && b.lName) ? `${b.fName} ${b.lName}` : (b.gymName || '');
                    return nameA.localeCompare(nameB);
                case 'location':
                    return (a.address || '').localeCompare(b.address || '');
                default:
                    return 0;
            }
        });

        return filtered;
    }

    displayErrorMessage(type) {
        const container = type === 'gyms' ? document.getElementById('gymResults') : document.getElementById('trainerResults');
        if (container) {
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const catalog = new CatalogManager();
    catalog.init().catch(error => {
        console.error('Failed to initialize catalog:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.innerHTML = `
            <strong>Error:</strong> Unable to load catalog data. Please try again later.
            <button onclick="window.location.reload()" class="btn btn-sm btn-outline-danger ms-3">
                <i class="ri-refresh-line"></i> Retry
            </button>
        `;
        document.querySelector('main')?.prepend(errorDiv);
    });
});
