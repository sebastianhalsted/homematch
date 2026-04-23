// State Management
let state = {
    currentApartmentIndex: 0,
    currentImageIndex: 0,
    likedApartments: [],
    userProfile: {
        name: '',
        age: '',
        bio: '',
        answers: {}
    },
    userListings: [],
    currentChatRoom: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initializeEventListeners();
    renderSwipePage();
});

// Load state from localStorage
function loadState() {
    const saved = localStorage.getItem('homematchState');
    if (saved) {
        state = { ...state, ...JSON.parse(saved) };
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('homematchState', JSON.stringify(state));
}

// Navigation
function initializeEventListeners() {
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageId = e.currentTarget.dataset.page;
            navigateTo(pageId);
        });
    });

    // Swipe page events
    document.getElementById('like-btn').addEventListener('click', () => handleSwipe('right'));
    document.getElementById('nope-btn').addEventListener('click', () => handleSwipe('left'));
    document.getElementById('prev-btn').addEventListener('click', goToPrevImage);
    document.getElementById('next-btn').addEventListener('click', goToNextImage);

    // Explore page events
    document.getElementById('price-filter').addEventListener('input', renderExplorePage);
    document.getElementById('size-filter').addEventListener('input', renderExplorePage);

    // Profile page events
    document.getElementById('save-profile-btn').addEventListener('click', saveProfile);
    document.getElementById('show-import-form-btn').addEventListener('click', showImportForm);
    document.getElementById('cancel-import-btn').addEventListener('click', hideImportForm);
    document.getElementById('submit-apartment-btn').addEventListener('click', submitApartment);
}

function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    // Remove active from all nav items
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

    // Render appropriate page
    if (pageId === 'swipe-page') renderSwipePage();
    if (pageId === 'explore-page') renderExplorePage();
    if (pageId === 'liked-page') renderLikedPage();
    if (pageId === 'chat-page') renderChatPage();
    if (pageId === 'profile-page') renderProfilePage();
}

// SWIPE PAGE
function renderSwipePage() {
    const apt = apartments[state.currentApartmentIndex];
    state.currentImageIndex = 0;

    document.getElementById('counter').textContent = `${state.currentApartmentIndex + 1} of ${apartments.length}`;

    // Set image and thumbnails
    updateMainImage();
    updateThumbnails();

    // Set details
    document.getElementById('apt-title').textContent = apt.title;
    document.getElementById('apt-location').textContent = apt.location;
    document.getElementById('apt-price').textContent = `${apt.price.toLocaleString()} DKK`;
    document.getElementById('apt-size').textContent = `${apt.size} m²`;
    document.getElementById('apt-beds').textContent = apt.bedrooms;
    document.getElementById('apt-baths').textContent = apt.bathrooms;
    document.getElementById('apt-furnished').textContent = apt.furnished ? '✓' : '✕';
    document.getElementById('apt-description').textContent = apt.description;

    // Amenities
    const amenitiesContainer = document.getElementById('amenities-container');
    if (apt.amenities.length > 0) {
        amenitiesContainer.innerHTML = `
            <span class="amenities-title">Amenities:</span>
            <div class="amenities">
                ${apt.amenities.map(a => `<span class="amenity">${a}</span>`).join('')}
            </div>
        `;
    }
}

function updateMainImage() {
    const apt = apartments[state.currentApartmentIndex];
    document.getElementById('main-image').src = apt.images[state.currentImageIndex];
    document.getElementById('image-counter').textContent = `${state.currentImageIndex + 1} / ${apt.images.length}`;
}

function updateThumbnails() {
    const apt = apartments[state.currentApartmentIndex];
    const thumbnailsContainer = document.getElementById('thumbnails');
    
    thumbnailsContainer.innerHTML = apt.images.map((img, idx) => `
        <button class="thumbnail ${idx === state.currentImageIndex ? 'active' : ''}" 
                onclick="selectImage(${idx})">
            <img src="${img}" alt="thumbnail ${idx + 1}">
        </button>
    `).join('');
}

function selectImage(idx) {
    state.currentImageIndex = idx;
    updateMainImage();
    updateThumbnails();
}

function goToPrevImage() {
    const apt = apartments[state.currentApartmentIndex];
    state.currentImageIndex = state.currentImageIndex === 0 ? apt.images.length - 1 : state.currentImageIndex - 1;
    updateMainImage();
    updateThumbnails();
}

function goToNextImage() {
    const apt = apartments[state.currentApartmentIndex];
    state.currentImageIndex = state.currentImageIndex === apt.images.length - 1 ? 0 : state.currentImageIndex + 1;
    updateMainImage();
    updateThumbnails();
}

function handleSwipe(direction) {
    if (direction === 'right') {
        if (!state.likedApartments.includes(apartments[state.currentApartmentIndex].id)) {
            state.likedApartments.push(apartments[state.currentApartmentIndex].id);
        }
    }

    state.currentApartmentIndex = (state.currentApartmentIndex + 1) % apartments.length;
    saveState();
    renderSwipePage();
}

// EXPLORE PAGE
function renderExplorePage() {
    const maxPrice = parseInt(document.getElementById('price-filter').value);
    const minSize = parseInt(document.getElementById('size-filter').value);

    document.getElementById('price-range').textContent = `0 - ${maxPrice}`;
    document.getElementById('size-value').textContent = minSize;

    const filtered = apartments.filter(apt => apt.price <= maxPrice && apt.size >= minSize);

    const grid = document.getElementById('apartments-grid');
    grid.innerHTML = filtered.map(apt => `
        <div class="apartment-card">
            <img src="${apt.images[0]}" class="apartment-card-image" alt="${apt.title}">
            <div class="apartment-card-info">
                <div class="apartment-card-title">${apt.title}</div>
                <div class="apartment-card-location">${apt.location}</div>
                <div class="apartment-card-details">
                    <span class="apartment-card-price">${apt.price.toLocaleString()} DKK</span>
                    <span>${apt.size} m²</span>
                </div>
            </div>
        </div>
    `).join('');
}

// LIKED PAGE
function renderLikedPage() {
    const liked = apartments.filter(apt => state.likedApartments.includes(apt.id));
    const likedList = document.getElementById('liked-list');

    if (liked.length === 0) {
        likedList.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 24px;">No liked apartments yet. Start swiping!</p>';
        return;
    }

    likedList.innerHTML = liked.map(apt => `
        <div class="liked-item" onclick="showLikedDetail('${apt.id}')">
            <div class="liked-item-title">${apt.title}</div>
            <div class="liked-item-details">
                <span>${apt.location}</span>
                <span>${apt.price.toLocaleString()} DKK • ${apt.size} m²</span>
            </div>
        </div>
    `).join('');
}

function showLikedDetail(aptId) {
    alert(`Viewing details for ${apartments.find(a => a.id === aptId).title}\n\nIn a full app, this would show the full apartment details and allow messaging interested roommates.`);
}

// CHAT PAGE
function renderChatPage() {
    const liked = apartments.filter(apt => state.likedApartments.includes(apt.id));
    const chatContainer = document.getElementById('chat-container');

    if (liked.length === 0) {
        chatContainer.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 24px;">Like apartments first to contact owners!</p>';
        return;
    }

    chatContainer.innerHTML = liked.map(apt => `
        <div class="chat-room" onclick="openChat('${apt.id}')">
            <div class="chat-room-title">${apt.title}</div>
            <div class="chat-room-owner">
                <strong>${apt.owner.name}</strong> • ${apt.owner.responseTime}
            </div>
            <div class="chat-room-preview">
                📞 ${apt.owner.phone} | 📧 ${apt.owner.email}
            </div>
        </div>
    `).join('');
}

function openChat(aptId) {
    state.currentChatRoom = aptId;
    const apt = apartments.find(a => a.id === aptId);
    
    alert(`📞 Contact ${apt.owner.name}\n\nPhone: ${apt.owner.phone}\nEmail: ${apt.owner.email}\n\n${apt.owner.responseTime}\n\nIn the backend version, you can chat in real-time here!`);
}

// PROFILE PAGE
function renderProfilePage() {
    document.getElementById('name-input').value = state.userProfile.name;
    document.getElementById('age-input').value = state.userProfile.age;
    document.getElementById('bio-input').value = state.userProfile.bio;

    // Render user listings
    const myListingsContainer = document.getElementById('my-listings');
    if (state.userListings.length > 0) {
        myListingsContainer.innerHTML = state.userListings.map(apt => `
            <div class="my-listing-item">
                <div class="my-listing-info">
                    <div class="my-listing-title">${apt.title}</div>
                    <div class="my-listing-price">${apt.price.toLocaleString()} DKK • ${apt.size} m²</div>
                </div>
                <button class="my-listing-btn" onclick="deleteUserListing('${apt.id}')">Delete</button>
            </div>
        `).join('');
    } else {
        myListingsContainer.innerHTML = '<p style="color: #9ca3af; text-align: center;">No listings yet. Add one to get started!</p>';
    }

    const questionsContainer = document.getElementById('personality-questions');
    questionsContainer.innerHTML = personalityQuestions.map(q => `
        <div class="question-card">
            <div class="question-title">${q.question}</div>
            <div class="question-options">
                ${q.options.map(opt => `
                    <button class="question-option ${state.userProfile.answers[q.id] === opt ? 'selected' : ''}" 
                            onclick="selectAnswer('${q.id}', '${opt}')">
                        ${state.userProfile.answers[q.id] === opt ? '✓ ' : ''}${opt}
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function selectAnswer(questionId, answer) {
    state.userProfile.answers[questionId] = answer;
    saveState();
    renderProfilePage();
}

function saveProfile() {
    state.userProfile.name = document.getElementById('name-input').value;
    state.userProfile.age = document.getElementById('age-input').value;
    state.userProfile.bio = document.getElementById('bio-input').value;
    saveState();
    alert('Profile saved successfully! ✓');
}

// IMPORT LISTINGS FUNCTIONS
function showImportForm() {
    document.getElementById('import-form-container').style.display = 'block';
}

function hideImportForm() {
    document.getElementById('import-form-container').style.display = 'none';
    clearImportForm();
}

function clearImportForm() {
    document.getElementById('apt-title-input').value = '';
    document.getElementById('apt-price-input').value = '';
    document.getElementById('apt-size-input').value = '';
    document.getElementById('apt-location-input').value = '';
    document.getElementById('apt-bedrooms-input').value = '';
    document.getElementById('apt-bathrooms-input').value = '';
    document.getElementById('apt-furnished-input').checked = false;
    document.getElementById('apt-description-input').value = '';
    document.getElementById('apt-amenities-input').value = '';
    document.getElementById('apt-images-input').value = '';
}

function submitApartment() {
    const title = document.getElementById('apt-title-input').value;
    const price = parseInt(document.getElementById('apt-price-input').value);
    const size = parseInt(document.getElementById('apt-size-input').value);
    const location = document.getElementById('apt-location-input').value;
    const bedrooms = parseInt(document.getElementById('apt-bedrooms-input').value);
    const bathrooms = parseInt(document.getElementById('apt-bathrooms-input').value);
    const furnished = document.getElementById('apt-furnished-input').checked;
    const description = document.getElementById('apt-description-input').value;
    const amenities = document.getElementById('apt-amenities-input').value.split(',').map(a => a.trim()).filter(a => a);
    const images = document.getElementById('apt-images-input').value.split(',').map(i => i.trim()).filter(i => i);

    if (!title || !price || !size || !location || !bedrooms || !bathrooms) {
        alert('Please fill in all required fields');
        return;
    }

    const newApartment = {
        id: `user-${Date.now()}`,
        title,
        price,
        size,
        location,
        bedrooms,
        bathrooms,
        furnished,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
        description,
        amenities,
        owner: {
            name: state.userProfile.name || 'You',
            email: 'your-email@example.com',
            phone: 'Your Phone',
            responseTime: 'ASAP'
        },
        isUserListing: true
    };

    state.userListings.push(newApartment);
    apartments.unshift(newApartment);
    
    saveState();
    hideImportForm();
    renderProfilePage();
    alert(`✓ "${title}" has been added to the platform!`);
}

function deleteUserListing(apartmentId) {
    if (confirm('Delete this listing?')) {
        state.userListings = state.userListings.filter(apt => apt.id !== apartmentId);
        apartments = apartments.filter(apt => apt.id !== apartmentId);
        saveState();
        renderProfilePage();
        alert('Apartment removed from your listings');
    }
}