// Calendar state and configuration
const config = {
    baseUrl: 'http://localhost:5171/api/TrainerBooking',
    currentDate: new Date(),
    currentView: '3day', // '3day', 'week', 'month'
    traineeId: null // Will be set during initialization
};

// Add authentication check
function checkAuth() {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    
    if (!userId || !userRole || userRole !== 'trainee') {
        window.location.href = '/TLAC-test/pages/login.html';
        return false;
    }

    // Parse userId as integer and validate
    const parsedId = parseInt(userId);
    if (isNaN(parsedId)) {
        console.error('Invalid user ID:', userId);
        localStorage.clear();
        window.location.href = '/TLAC-test/pages/login.html';
        return false;
    }

    config.traineeId = parsedId;
    return true;
}

let bookings = [];

// Initialize calendar with auth check
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        initializeDropdowns();
        setupEventListeners();
        fetchBookings();
    }
});

// Initialize date selection dropdowns
function initializeDropdowns() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthDropdown = document.querySelector('.month-dropdown');
    const dayDropdown = document.querySelector('.day-dropdown');
    const yearDropdown = document.querySelector('.year-dropdown');

    // Populate months
    months.forEach((month, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="dropdown-item" data-month="${index}">${month}</a>`;
        monthDropdown.appendChild(li);
    });

    // Populate days (1-31)
    for (let i = 1; i <= 31; i++) {
        const li = document.createElement('li');
        li.innerHTML = `<a class="dropdown-item" data-day="${i}">${i}</a>`;
        dayDropdown.appendChild(li);
    }

    // Populate years (current year ± 2)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 2; year <= currentYear + 2; year++) {
        const li = document.createElement('li');
        li.innerHTML = `<a class="dropdown-item" data-year="${year}">${year}</a>`;
        yearDropdown.appendChild(li);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Date navigation buttons
    document.getElementById('prevDate').addEventListener('click', () => navigateDate('prev'));
    document.getElementById('nextDate').addEventListener('click', () => navigateDate('next'));

    // View switching buttons
    document.querySelectorAll('[data-view]').forEach(button => {
        button.addEventListener('click', (e) => {
            config.currentView = e.target.dataset.view;
            updateViewButtons();
            renderCalendar();
        });
    });

    // Dropdown selections
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', handleDateSelection);
    });
}

// Handle date selection from dropdowns
function handleDateSelection(e) {
    const value = e.target.textContent;
    const type = Object.keys(e.target.dataset)[0]; // month, day, or year
    const button = document.getElementById(`${type}Dropdown`);
    button.textContent = value;
    
    // Update currentDate based on selection
    const newDate = new Date(config.currentDate);
    if (type === 'month') newDate.setMonth(e.target.dataset.month);
    if (type === 'day') newDate.setDate(parseInt(e.target.dataset.day));
    if (type === 'year') newDate.setFullYear(parseInt(e.target.dataset.year));
    
    config.currentDate = newDate;
    renderCalendar();
}

// Navigate between dates
function navigateDate(direction) {
    if (config.currentView === '3day') {
        config.currentDate.setDate(config.currentDate.getDate() + (direction === 'prev' ? -3 : 3));
    } else if (config.currentView === 'week') {
        config.currentDate.setDate(config.currentDate.getDate() + (direction === 'prev' ? -7 : 7));
    } else {
        config.currentDate.setMonth(config.currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
    }
    updateDateDisplay();
    renderCalendar();
}

// Update date display in dropdowns
function updateDateDisplay() {
    document.getElementById('monthDropdown').textContent = config.currentDate.toLocaleString('default', { month: 'long' });
    document.getElementById('dayDropdown').textContent = config.currentDate.getDate();
    document.getElementById('yearDropdown').textContent = config.currentDate.getFullYear();
}

// Update view buttons active state
function updateViewButtons() {
    document.querySelectorAll('[data-view]').forEach(button => {
        button.classList.toggle('active', button.dataset.view === config.currentView);
    });
}

// Render calendar grid
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // Create header row
    const headerRow = createCalendarHeader();
    grid.appendChild(headerRow);

    // Create time slots
    const timeSlots = createTimeSlots();
    grid.appendChild(timeSlots);

    // Update date display
    updateDateDisplay();
}

// Create calendar header with dates
function createCalendarHeader() {
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-header-row';
    
    // Add empty cell for time column in week/day views
    if (config.currentView !== 'month') {
        const timeHeaderCell = document.createElement('div');
        timeHeaderCell.className = 'calendar-header-cell time-header';
        headerRow.appendChild(timeHeaderCell);
    }

    const gridClass = config.currentView === 'month' ? 'month-grid' : 
                     config.currentView === 'week' ? 'week-grid' : 'three-day-grid';
    headerRow.classList.add(gridClass);

    // For month view, just show weekday names
    if (config.currentView === 'month') {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            const headerCell = document.createElement('div');
            headerCell.className = 'calendar-header-cell';
            headerCell.innerHTML = `
                <div class="date-label">
                    <span class="day-name">${day}</span>
                </div>
            `;
            headerRow.appendChild(headerCell);
        });
    } else {
        // For other views, show dates as before
        const dates = getDisplayDates();
        dates.forEach(date => {
            const headerCell = document.createElement('div');
            headerCell.className = 'calendar-header-cell';
            headerCell.innerHTML = `
                <div class="date-label">
                    <span class="day-name">${date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span class="date">${date.getDate()}</span>
                </div>
            `;
            headerRow.appendChild(headerCell);
        });
    }

    return headerRow;
}

// Add function to fetch bookings from API
async function fetchBookings() {
    try {
        if (!checkAuth()) return;
        
        const response = await fetch(`${config.baseUrl}`);
        const allBookings = await response.json();
        // Filter bookings for current trainee
        bookings = allBookings.filter(booking => booking.customerID === config.traineeId);
        
        // Convert API data format to calendar format
        bookings = bookings.map(booking => ({
            id: booking.bookingID,
            title: "Training Session",
            start: combineDateTime(booking.bookingDate, booking.startTime),
            end: combineDateTime(booking.bookingDate, booking.endTime),
            trainer: booking.trainerName,
            location: booking.gymAddress,
            customerName: booking.customerName
        }));
        
        renderCalendar(); // Refresh calendar with new data
    } catch (error) {
        console.error('Error fetching bookings:', error);
        if (error.status === 401) {
            window.location.href = '/TLAC-test/pages/login.html';
        }
    }
}

// Helper function to combine date and time
function combineDateTime(dateStr, timeStr) {
    const date = new Date(dateStr);
    const [hours, minutes, seconds] = timeStr.split(':');
    date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
    return date.toISOString();
}

// Create time slots
function createTimeSlots() {
    const timeContainer = document.createElement('div');
    timeContainer.className = 'calendar-body';

    if (config.currentView === 'month') {
        return createMonthView(timeContainer);
    }

    const dates = getDisplayDates();
    const columnCount = config.currentView === 'week' ? 7 : 3;

    for (let hour = 6; hour <= 22; hour++) {
        const timeRow = document.createElement('div');
        timeRow.className = `calendar-row ${config.currentView === 'week' ? 'week-grid' : 'three-day-grid'}`;

        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.textContent = `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
        timeRow.appendChild(timeLabel);

        for (let i = 0; i < columnCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            
            // Add cell date data for booking reference
            const cellDate = new Date(dates[i]);
            cellDate.setHours(hour);
            cell.dataset.datetime = cellDate.toISOString();
            
            // Check for bookings in this time slot
            const bookings = findBookingsForTimeSlot(cellDate);
            bookings.forEach(booking => {
                const bookingElement = createBookingElement(booking);
                cell.appendChild(bookingElement);
            });

            timeRow.appendChild(cell);
        }

        timeContainer.appendChild(timeRow);
    }

    return timeContainer;
}

// Add new functions for booking handling
function findBookingsForTimeSlot(dateTime) {
    return bookings.filter(booking => {
        const bookingStart = new Date(booking.start);
        return bookingStart.getFullYear() === dateTime.getFullYear() &&
               bookingStart.getMonth() === dateTime.getMonth() &&
               bookingStart.getDate() === dateTime.getDate() &&
               bookingStart.getHours() === dateTime.getHours();
    });
}

function createBookingElement(booking) {
    const bookingDiv = document.createElement('div');
    bookingDiv.className = 'booking-card';
    bookingDiv.dataset.bookingId = booking.id;

    bookingDiv.innerHTML = `
        <div class="booking-title">${booking.title}</div>
        <div class="booking-details">
            <div>${new Date(booking.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                 ${new Date(booking.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div>Trainer: ${booking.trainer}</div>
        </div>
    `;

    // Add tooltip using Bootstrap
    const tooltip = new bootstrap.Tooltip(bookingDiv, {
        title: `
            <strong>${booking.title}</strong><br>
            Time: ${new Date(booking.start).toLocaleTimeString()} - ${new Date(booking.end).toLocaleTimeString()}<br>
            Trainer: ${booking.trainer}<br>
            Location: ${booking.location}
        `,
        html: true,
        placement: 'top'
    });

    // Add click handler for modal
    bookingDiv.addEventListener('click', () => showBookingModal(booking));

    return bookingDiv;
}

function showBookingModal(booking) {
    // Remove existing modal if any
    const existingModal = document.getElementById('bookingModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create and append modal
    const modalHtml = `
        <div class="modal fade" id="bookingModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${booking.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Date:</strong> ${new Date(booking.start).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${new Date(booking.start).toLocaleTimeString()} - ${new Date(booking.end).toLocaleTimeString()}</p>
                        <p><strong>Trainer:</strong> ${booking.trainer}</p>
                        <p><strong>Location:</strong> ${booking.location}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-danger" onclick="cancelBooking(${booking.id})">Cancel Booking</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
}

// Add function to cancel booking
async function cancelBooking(bookingId) {
    try {
        const response = await fetch(`${config.baseUrl}/${bookingId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
            modal.hide();
            
            // Refresh bookings
            await fetchBookings();
        } else {
            console.error('Error canceling booking');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get dates to display based on current view
function getDisplayDates() {
    const dates = [];
    const startDate = new Date(config.currentDate);

    if (config.currentView === 'month') {
        // Start from the first day of the week (Monday) that contains the 1st
        startDate.setDate(1);
        const firstDay = startDate.getDay();
        startDate.setDate(startDate.getDate() - (firstDay === 0 ? 6 : firstDay - 1));
        
        // Get only 7 days for the week header
        for (let i = 0; i < 7; i++) {
            dates.push(new Date(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }
    } else if (config.currentView === 'week') {
        // Start from Monday of the current week
        const day = startDate.getDay();
        startDate.setDate(startDate.getDate() - (day === 0 ? 6 : day - 1));
        
        for (let i = 0; i < 7; i++) {
            dates.push(new Date(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }
    } else {
        // 3-day view
        for (let i = 0; i < 3; i++) {
            dates.push(new Date(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }
    }
    return dates;
}

// New function to create month view
function createMonthView(container) {
    const monthStart = new Date(config.currentDate.getFullYear(), config.currentDate.getMonth(), 1);
    const monthEnd = new Date(config.currentDate.getFullYear(), config.currentDate.getMonth() + 1, 0);
    
    // Find the first day to display (Sunday before month start)
    const firstDay = new Date(monthStart);
    firstDay.setDate(1 - monthStart.getDay());
    
    // Create all weeks needed
    const weeks = [];
    let currentWeek = [];
    const iterationDate = new Date(firstDay); // Renamed from currentDate to iterationDate
    
    // Generate 6 weeks to ensure we cover all month layouts
    for (let week = 0; week < 6; week++) {
        currentWeek = [];
        for (let day = 0; day < 7; day++) {
            currentWeek.push(new Date(iterationDate));
            iterationDate.setDate(iterationDate.getDate() + 1);
        }
        weeks.push(currentWeek);
    }

    // Create week rows
    weeks.forEach(week => {
        const weekRow = document.createElement('div');
        weekRow.className = 'calendar-row month-grid';

        week.forEach(date => {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell month-cell';
            
            // Add out-of-month class if date is outside current month
            if (date.getMonth() !== monthStart.getMonth()) {
                cell.classList.add('out-of-month');
            }
            
            // Add date number to top of cell
            const dateLabel = document.createElement('div');
            dateLabel.className = 'month-date-label';
            dateLabel.textContent = date.getDate();
            cell.appendChild(dateLabel);

            // Add bookings for this day
            const dayBookings = findBookingsForDay(date);
            dayBookings.forEach(booking => {
                const bookingElement = createBookingElement(booking);
                cell.appendChild(bookingElement);
            });

            weekRow.appendChild(cell);
        });

        container.appendChild(weekRow);
    });

    return container;
}

// Helper function to find bookings for entire day
function findBookingsForDay(date) {
    return bookings.filter(booking => {
        const bookingDate = new Date(booking.start);
        return bookingDate.getFullYear() === date.getFullYear() &&
               bookingDate.getMonth() === date.getMonth() &&
               bookingDate.getDate() === date.getDate();
    });
}
