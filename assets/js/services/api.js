const API_BASE_URL = 'http://localhost:5171/api';

export async function fetchTrainers() {
    try {
        const [trainersResponse, ratingsResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/Trainer`),
            fetch(`${API_BASE_URL}/Rating`)
        ]);

        if (!trainersResponse.ok || !ratingsResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const trainers = await trainersResponse.json();
        const ratings = await ratingsResponse.json();

        // Calculate average ratings for each trainer
        return trainers.map(trainer => {
            const trainerRatings = ratings.filter(r => r.trainerID === trainer.trainerID);
            const avgRating = trainerRatings.length > 0
                ? (trainerRatings.reduce((sum, r) => sum + r.rating, 0) / trainerRatings.length).toFixed(1)
                : 'New';
            return { ...trainer, avgRating };
        });
    } catch (error) {
        console.error('Error fetching trainers:', error);
        throw error;
    }
}

export async function fetchGyms() {
    try {
        const response = await fetch(`${API_BASE_URL}/Gym`);
        if (!response.ok) throw new Error('Failed to fetch gyms');
        return await response.json();
    } catch (error) {
        console.error('Error fetching gyms:', error);
        throw error;
    }
}
