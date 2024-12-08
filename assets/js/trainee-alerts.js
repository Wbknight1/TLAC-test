async function checkUpcomingSession() {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        // Show indicator immediately with loading state
        document.getElementById('upcomingSessionIndicator').classList.remove('d-none');

        const response = await fetch('http://localhost:5171/api/TrainerBooking');
        const bookings = await response.json();
        
        // Filter bookings for current user only
        const userBookings = bookings.filter(booking => booking.customerID === parseInt(userId))
            .sort((a, b) => {
                const dateA = new Date(a.bookingDate);
                const dateB = new Date(b.bookingDate);
                return dateA - dateB;
            });

        const sessionText = document.getElementById('upcomingSessionText');
        const indicatorIcon = document.getElementById('indicatorIcon');

        if (userBookings.length > 0) {
            const nextSession = userBookings[0];
            const sessionDate = new Date(nextSession.bookingDate);
            const timeString = nextSession.startTime.slice(0, 5); // Get HH:MM format
            const formattedDate = sessionDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            
            sessionText.innerHTML = `${formattedDate} at ${timeString} with ${nextSession.trainerName} • ${nextSession.gymAddress}`;
            indicatorIcon.classList.remove('text-muted');
            indicatorIcon.classList.add('text-brand');
        } else {
            sessionText.innerHTML = 'No upcoming sessions scheduled';
            indicatorIcon.classList.remove('text-brand');
            indicatorIcon.classList.add('text-muted');
        }
    } catch (error) {
        console.error('Error checking upcoming sessions:', error);
        document.getElementById('upcomingSessionText').innerHTML = 'Unable to load session information';
    }
}

// Check for upcoming sessions when page loads
document.addEventListener('DOMContentLoaded', checkUpcomingSession);