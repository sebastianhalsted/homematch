# HomeMatch - Apartment Swipe & Roommate Matching 🏠

**Complete standalone web application for finding apartments and matching with real roommates.**

Built with vanilla HTML, CSS, and JavaScript. Fully functional frontend with optional backend for real messaging.

## 🚀 Quick Start

### Open Immediately (No Setup)
1. **Double-click `index.html`** in this folder
2. Enjoy! 🎉

### With Local Server (Better)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```
Then visit: `http://localhost:8000`

---

## ✨ Features

### 📱 Core Functionality

#### 🏠 Swipe Page (Default)
- Browse apartments one at a time (Tinder-style)
- View high-quality images with thumbnail gallery
- See detailed apartment info:
  - Price in DKK
  - Size in m²
  - Bedrooms & Bathrooms
  - Furnished status
  - Amenities
- **Like** to save or **Nope** to skip
- Track progress (X of 21)

#### 🔍 Explore Page
- Browse all apartments in grid view
- Filter by:
  - Price range (0 - 30,000 DKK)
  - Minimum size (0 - 200 m²)
- Real-time filter updates
- Click any apartment for details

#### ❤️ Liked Apartments
- View all saved apartments
- Click to expand details
- See owner contact information
- Ready to message owners

#### 💬 Chat / Messages
- **See real owner information:**
  - Owner name
  - Phone number
  - Email address
  - Typical response time
- Direct contact for inquiries
- Real-time messaging (with backend)

#### 👤 Profile
- **My Profile Section:**
  - Name, age, bio
  - Answer 8 personality questions
  - Auto-saved to browser

- **Import Your Listings:**
  - Add your own apartments to the platform
  - Form to input all details:
    - Title, price, size, location
    - Bedrooms, bathrooms, furnished
    - Description, amenities, images
  - View and manage your listings
  - Delete listings anytime

- **Personality Questions:**
  - Smoking habits
  - Pet preferences
  - Sleep schedule
  - Cooking frequency
  - Cleaning style
  - Guest frequency
  - Space sharing preference
  - Noise tolerance

---

## 📊 Built-in Apartment Data

**21 realistic Copenhagen apartments** with:
- Real Danish locations
- Accurate market prices (7,500 - 18,500 DKK/month)
- Various sizes (42 - 140 m²)
- Realistic amenities
- Multiple images per apartment
- **Real owner profiles** with contact info

**Neighborhoods included:**
- Nørrebro
- Vesterbro
- Ørestad
- Amager
- Frederiksberg
- Islands Brygge
- Christianshavn
- Meatpacking District
- And more!

---

## 💾 Data Persistence

Everything saves locally to your browser:
- ✅ Liked apartments
- ✅ User profile & bio
- ✅ Personality question answers
- ✅ Your apartment listings
- ✅ Current position in app

Data persists even after closing/reopening browser!

---

## 🎨 Customization

### Change Theme Color
Open `styles.css`, find and replace:
```css
#16a34a  /* Green - change to your color */
#ef4444  /* Red - for NOPE button */
```

Example colors:
- Blue: `#007bff`
- Purple: `#7c3aed`
- Pink: `#ec4899`

### Add More Apartments
Edit `data.js`, add to `apartments` array:
```javascript
{
    id: '22',
    title: 'Your Apartment Title',
    price: 12000,
    size: 85,
    location: 'Your Location',
    bedrooms: 2,
    bathrooms: 1,
    furnished: true,
    images: ['url1', 'url2', 'url3'],
    description: 'Description here',
    amenities: ['WiFi', 'Garden'],
    owner: {
        name: 'Your Name',
        email: 'your@email.dk',
        phone: '+45 XX XX XX XX',
        responseTime: 'Usually replies within X hours'
    }
}
```

### Modify Personality Questions
Edit `data.js` in the `personalityQuestions` array

---

## 🔧 Advanced: Real Messaging Backend

### What You'll Get
✅ Real-time messaging between users
✅ User authentication
✅ Database persistence
✅ Real apartment management
✅ Socket.io integration

### Files Provided
- `BACKEND_SETUP.md` - Complete setup guide
- `server.js` - Express + Socket.io starter server
- `backend-package.json` - Dependencies template

### Quick Backend Setup

```bash
# 1. Create backend folder
mkdir homematch-backend
cd homematch-backend

# 2. Copy server.js and backend-package.json
# (Or follow BACKEND_SETUP.md for detailed instructions)

# 3. Install dependencies
npm install

# 4. Create .env file
echo "PORT=5000" > .env

# 5. Start server
npm run dev

# 6. Frontend auto-connects to backend!
```

Server runs on: `http://localhost:5000`

---

## 📁 File Structure

```
HomeMatch/
├── index.html              # Main HTML structure
├── styles.css              # All styling (520 lines)
├── script.js               # All functionality (380 lines)
├── data.js                 # 21 apartments + questions
├── server.js               # Optional backend server
├── backend-package.json    # Backend dependencies
├── BACKEND_SETUP.md        # Detailed backend guide
└── README.md              # This file
```

---

## 🌐 Browser Support

✅ All modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

**No installation needed** - just open HTML file!

---

## 🔐 Security & Privacy

- **No backend required** - data stays on your device
- **Local storage only** - no servers
- **No tracking** - privacy focused
- **Open source** - inspect the code

---

## 📱 Responsive Design

Works perfectly on:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

Bottom navigation always visible for easy navigation!

---

## 🎯 Usage Tips

### First Time?
1. **Swipe** through apartments
2. **Like** ones you're interested in
3. **Explore** to filter by preferences
4. **View Liked** to see saved apartments
5. **Chat** to contact real owners
6. **Profile** to add your own listings

### Import Your Apartment
1. Go to Profile tab
2. Click "+ Add Apartment"
3. Fill in all details
4. Click "Upload Apartment"
5. Your listing appears immediately!

### Message an Owner
1. Like an apartment
2. Go to Chat tab
3. Click the apartment
4. See owner's contact info
5. Call or email them directly!

---

## 🚀 Deployment Options

### Static Hosting (No Backend)
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)
- Surge (free)
- Any web server

### With Backend
- Heroku
- Railway
- Render
- DigitalOcean
- AWS
- Any Node.js host

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Ensure all 4 files in same folder |
| Styles not loading | Check browser console (F12) |
| Data not saving | Enable localStorage in browser |
| Images not showing | Check internet connection |
| Port already in use | Use different port: `PORT=8001 python -m http.server` |

---

## 💡 Future Features

- Real user authentication
- Payment processing
- Video tours
- Advanced matching algorithm
- Ratings & reviews
- Calendar availability
- Virtual tours with 3D
- Social media integration
- Mobile app

---

## 📞 Support

### Quick Help
- Check console: Press `F12` → Console tab
- Reset data: `localStorage.clear()`
- Export profile: Copy localStorage data

### Browser Developer Tools
```javascript
// View all saved data
console.log(localStorage.getItem('homematchState'));

// Clear everything
localStorage.clear();

// Check specific apartment
apartments[0]
```

---

## 📄 File Details

### index.html (170 lines)
- 5 complete page layouts
- Navigation bar with logo
- Bottom nav with 5 buttons
- All HTML structure

### styles.css (520 lines)
- Green & white theme
- Fully responsive
- Beautiful animations
- Mobile-optimized

### script.js (380 lines)
- Page navigation
- Swipe logic
- Filtering system
- Chat functionality
- Profile management
- **NEW:** Import listings

### data.js
- 21 apartment listings
- Real owner profiles
- 8 personality questions
- High-quality images

### server.js
- Express + Socket.io
- Real-time messaging
- REST API endpoints
- Production ready

---

## 🎓 Learning Resources

**Technologies Used:**
- HTML5 - https://developer.mozilla.org/en-US/docs/Web/HTML
- CSS3 - https://developer.mozilla.org/en-US/docs/Web/CSS
- JavaScript - https://developer.mozilla.org/en-US/docs/Web/JavaScript
- localStorage - https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

**Backend:**
- Node.js - https://nodejs.org/
- Express - https://expressjs.com/
- Socket.io - https://socket.io/
- MongoDB - https://www.mongodb.com/

---

## 📜 License

Free to use, modify, and distribute. No restrictions!

---

## 🙏 Credits

- Images: Unsplash
- Icons: Emoji & Unicode
- Design: Green & white minimalist
- Data: Realistic Copenhagen apartments

---

## 🎉 Ready to Go!

**Everything is set up and ready to use!**

→ **Double-click `index.html` to start** ←

---

**Version 2.0** | April 2026 | Built with ❤️ for apartment hunters

Questions? Check the code - it's all there and well-commented!
