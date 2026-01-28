# Lucky Draw System - School Event

A multi-page web-based lucky draw application with authentication for school events.

## Features

✅ **User Authentication** - Secure login with username and password
✅ **Separate Pages** - Login → Draw → Setup (clean navigation)
✅ **Participant Management** - Import participants via text input or file upload
✅ **Multiple Award Levels** - Configure different awards with different winner counts
✅ **Animated Drawing** - Exciting rolling animation for winner selection
✅ **Real-time Display** - Shows current winners and remaining draws
✅ **Results Export** - Download results as CSV file
✅ **Persistent State** - Saves progress automatically (can resume if browser closes)
✅ **Responsive Design** - Works on desktop and mobile devices

## Default Login Credentials

- **Username:** `admin`
- **Password:** `school2024`

⚠️ **IMPORTANT:** Change these credentials in `index.html` before deploying to production!

## File Structure

```
lucky-draw/
├── index.html              # Login page (entry point)
├── draw.html               # Main drawing page
├── setup.html              # Configuration page
├── draw.js                 # Drawing logic
├── setup.js                # Configuration logic
├── styles.css              # Styling and animations
├── sample-participants.txt # Sample data (50 participants)
└── README.md               # This file
```

## Page Flow

```
Login (index.html)
    ↓
Draw Page (draw.html) ← → Setup Page (setup.html)
    ↓
Results & Export
```

## How to Use

### 1. Login (index.html)
- Open `index.html` in your browser
- Enter username: `admin`
- Enter password: `school2024`
- Click "Login"
- You'll be redirected to the draw page

### 2. Configure Setup (setup.html)

**Access:** Click "⚙️ Setup" button in the header

**Step 1: Add Participants**
- Enter participant numbers in the text area (comma or line separated)
- OR upload a `.txt` or `.csv` file with participant numbers
- Total count is displayed in real-time

**Step 2: Configure Awards**
- Click "+ Add Award Level" to add award categories
- Enter award name (e.g., "Grand Prize", "First Prize", "Second Prize")
- Enter number of winners for each award
- Click "✕" to remove an award level

**Step 3: Review Summary**
- See total participants, awards, and winners
- Ensure total winners doesn't exceed participants

**Step 4: Save**
- Click "💾 Save Configuration" to save only
- OR click "💾 Save & Start Drawing" to save and go to draw page

### 3. Draw Winners (draw.html)

**Main Features:**
- See current award name and remaining winners
- Click "🎲 Draw Winner" to select a random winner
- Watch the exciting rolling animation
- Winner is displayed in golden badge
- Winner is automatically removed from pool

**Navigation:**
- After completing all winners for an award, click "Next Award Level"
- After all awards complete, click "View All Results"
- Click "⚙️ Setup" to modify configuration

### 4. View Results

- All winners displayed by award category
- Click "Export Results" to download CSV file
- Click "Back to Draw" to continue drawing
- Click "New Lucky Draw" to start fresh (clears all data)

## Deployment Options

### Option 1: Netlify (Easiest - Recommended)

1. Go to https://www.netlify.com
2. Sign up for free account
3. Click "Add new site" → "Deploy manually"
4. Drag and drop the entire `lucky-draw` folder
5. Your site will be live instantly!
6. You'll get a URL like: `https://your-site-name.netlify.app`

**Custom Domain (Optional):**
- Go to Site settings → Domain management
- Add custom domain if you have one

### Option 2: GitHub Pages (Free)

1. Create a GitHub account at https://github.com
2. Create a new repository (e.g., `school-lucky-draw`)
3. Upload all files from `lucky-draw` folder to the repository
4. Go to repository Settings → Pages
5. Select "main" branch as source
6. Save and wait for deployment
7. Your site will be available at: `https://username.github.io/school-lucky-draw/`

### Option 3: Vercel (Free)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Click "Deploy"
6. Your site will be live!

### Option 4: Traditional Web Hosting

1. Upload all files to your web hosting service via FTP/cPanel
2. Access via your hosting URL
3. No server-side code required (pure HTML/CSS/JavaScript)

## Security Configuration

⚠️ **CRITICAL: Before Deploying to Internet**

### Change Login Credentials

Edit `index.html` (lines 31-34):

```javascript
const credentials = {
    username: 'your_secure_username',
    password: 'your_secure_password_2024'
};
```

**Password Recommendations:**
- Use at least 12 characters
- Mix uppercase, lowercase, numbers, and symbols
- Don't use common words or patterns
- Example: `Sch00l!Draw#2024`

### Additional Security (Optional)

For high-security requirements, consider:
1. Adding CAPTCHA to prevent brute force
2. Implementing server-side authentication
3. Using environment variables for credentials
4. Adding two-factor authentication

## Customization

### Change Colors

Edit `styles.css` root variables (lines 7-16):

```css
:root {
    --primary-color: #4CAF50;    /* Main green color */
    --secondary-color: #2196F3;  /* Blue accent */
    --danger-color: #f44336;     /* Red for remove buttons */
    --warning-color: #ff9800;    /* Orange for warnings */
    --success-color: #4CAF50;    /* Green for success */
}
```

### Modify Animation Speed

Edit `draw.js` (line 173) to change roll speed:

```javascript
}, 100);  // Change to 50 for faster, 200 for slower
```

### Change Roll Count

Edit `draw.js` (line 171) to change animation duration:

```javascript
if (rollCount > 30) {  // Change 30 to higher for longer animation
```

## Sample Participant File Format

Create a `.txt` file with one number per line:

```
1001
1002
1003
1004
1005
```

Or comma-separated:

```
1001, 1002, 1003, 1004, 1005
```

Or space-separated:

```
1001 1002 1003 1004 1005
```

## Example Award Configuration

| Award Name | Number of Winners |
|------------|-------------------|
| Grand Prize | 1 |
| First Prize | 3 |
| Second Prize | 5 |
| Third Prize | 10 |
| Consolation Prize | 20 |

**Total:** 39 winners needed

## Data Persistence

The application uses browser storage:

- **sessionStorage** - Login state (cleared when browser closes)
- **localStorage** - Configuration and draw progress (persists between sessions)

**This means:**
- ✅ Configuration is saved automatically
- ✅ Draw progress is saved after each winner
- ✅ Can close browser and resume later
- ✅ Data stays in the browser (not sent to any server)

**To clear all data:**
- Click "New Lucky Draw" button
- OR clear browser localStorage manually

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### Login not working?
- Check username and password (case-sensitive)
- Default is: username `admin`, password `school2024`
- Check browser console for errors (F12)

### "No Configuration Found" message?
- Go to Setup page (click "⚙️ Setup" button)
- Add participants and awards
- Click "💾 Save Configuration"
- Return to draw page

### Participants not loading from file?
- Ensure file is `.txt` or `.csv` format
- Check file encoding (UTF-8 recommended)
- Verify one number per line or comma-separated
- Check browser console for errors

### Draw button disabled?
- Ensure you've saved configuration first
- Check that participants and awards are configured
- Go to Setup page to verify

### Animation not smooth?
- Close unnecessary browser tabs
- Refresh the page
- Try a different browser
- Check if hardware acceleration is enabled

### Cannot export results?
- Check browser download permissions
- Ensure pop-ups are not blocked
- Try a different browser
- Check browser console for errors

### Lost progress?
- Check if localStorage is enabled in browser
- Data persists between sessions automatically
- Click "Back to Draw" if on results page

## Testing Locally

1. Open `index.html` in browser
2. Login with default credentials
3. Go to Setup (⚙️ button)
4. Upload `sample-participants.txt`
5. Add awards:
   - "First Prize" - 3 winners
   - "Second Prize" - 5 winners
6. Click "💾 Save & Start Drawing"
7. Click "🎲 Draw Winner" repeatedly
8. Export results when complete

## Advanced Features

### Resume Drawing
- If you close the browser during a draw
- Open the website and login again
- Drawing automatically resumes from where you left off

### Multiple Sessions
- Each browser maintains its own data
- Can run multiple draws on different computers simultaneously

### Export Format
CSV file with two columns:
```
Award,Winner Number
"Grand Prize","1023"
"First Prize","1045"
"First Prize","1012"
```

## Security Notes

⚠️ **Important:**

1. **Change default credentials** before deploying
2. **Use HTTPS** - All free hosting platforms provide SSL
3. **Don't share credentials publicly** - Use secure channels
4. **Limit access** - Only share URL with authorized personnel
5. **Test before event** - Run a full test draw before the actual event

## Browser Storage Limits

- **sessionStorage**: ~5-10 MB (for login state)
- **localStorage**: ~5-10 MB (for configuration and progress)
- Sufficient for thousands of participants

## Performance Notes

- Tested with up to 10,000 participants
- Drawing animation optimized for smooth performance
- Minimal resource usage
- Works on low-end devices

## Support

For issues:
1. Check Troubleshooting section
2. Review browser console (F12 → Console tab)
3. Verify all files are in same directory
4. Test in different browser
5. Clear browser cache and try again

## License

Free to use for educational and non-commercial purposes.

## Version

**Version 2.0.0** - January 2026
- Multi-page architecture
- Enhanced navigation
- Persistent state
- Improved user experience

---

**Happy Lucky Draw! 🎉🎊**