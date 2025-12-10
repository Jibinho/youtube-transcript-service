# 🚀 Deploy Your Own YouTube Transcript Service

**Quick setup guide for non-technical users**  
**Time required:** 5 minutes  
**Cost:** $0 (100% free forever)

---

## 📋 What You'll Get

A personal service that:
- ✅ Extracts transcripts from any YouTube video (with subtitles)
- ✅ Includes timestamps for easy navigation
- ✅ Works on iPhone, iPad, Mac, and any web browser
- ✅ Completely free (125,000 requests/month)
- ✅ No technical knowledge required

---

## 🎯 Step-by-Step Deployment

### Step 1: Get the Files (1 minute)

You should have received a file called `youtube-transcript-service.tar.gz`

**On Mac/Linux:**
```bash
tar -xzf youtube-transcript-service.tar.gz
cd youtube-transcript-service
```

**On Windows:**
- Right-click the file → Extract All
- Open the extracted folder

---

### Step 2: Create a GitHub Account (2 minutes)

**If you already have GitHub, skip to Step 3**

1. Go to https://github.com/join
2. Enter your email and create a password
3. Choose a username
4. Verify your email
5. ✅ Done!

---

### Step 3: Create a GitHub Repository (2 minutes)

1. **Log in to GitHub** at https://github.com

2. **Create a new repository:**
   - Click the **"+"** in the top-right corner
   - Select **"New repository"**

3. **Fill in the details:**
   - Repository name: `youtube-transcript-service`
   - Description: `Personal YouTube transcript extraction service`
   - Make it **Public** (required for free Netlify)
   - ✅ Check "Add a README file"
   - Click **"Create repository"**

4. **Upload the files:**
   - Click **"Add file"** → **"Upload files"**
   - Drag all the files from the extracted folder
   - Add a commit message: `Initial commit`
   - Click **"Commit changes"**

✅ Your code is now on GitHub!

---

### Step 4: Deploy to Netlify (2 minutes)

1. **Create a Netlify account:**
   - Go to https://app.netlify.com/signup
   - Click **"Sign up with GitHub"**
   - Authorize Netlify to access GitHub
   - ✅ You're logged in!

2. **Connect your repository:**
   - Click **"Add new site"** → **"Import an existing project"**
   - Select **"Deploy with GitHub"**
   - Choose your repository: `youtube-transcript-service`

3. **Configure deployment:**
   - Build command: (leave empty)
   - Publish directory: (leave empty)
   - Click **"Deploy site"**

4. **Wait for deployment** (30 seconds)
   - You'll see "Site deploy in progress"
   - Then "Published" with a green checkmark
   - ✅ Your service is live!

---

### Step 5: Get Your Service URL (30 seconds)

1. **On your Netlify dashboard**, you'll see a URL like:
   ```
   https://wonderful-example-123abc.netlify.app
   ```

2. **Test it!** Click on the URL to open your service
   - You should see a nice purple interface
   - Try the test button with the example video

3. **(Optional) Customize the URL:**
   - Click **"Site settings"**
   - Click **"Change site name"**
   - Enter a custom name (e.g., `yourname-youtube-transcript`)
   - Your new URL: `https://yourname-youtube-transcript.netlify.app`

---

## 🎉 You're Done!

Your personal YouTube transcript service is now live at:
```
https://your-site-name.netlify.app
```

**Your API endpoint is:**
```
https://your-site-name.netlify.app/.netlify/functions/get-transcript
```

---

## 📱 Next Steps

### For iOS/Mac Users

Now you can create a Shortcut that uses your service:

1. **Get your API URL** (from Step 5)
2. **Get an Anthropic API key** for summaries:
   - Go to https://console.anthropic.com
   - Sign up (free credits included)
   - Create an API key
   - Copy it (starts with `sk-ant-api03-...`)

3. **Follow the iOS Shortcut guide** in `IOS_SHORTCUT_GUIDE.md`

### For Testing

Try your API in the browser:
```
https://your-site-name.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ
```

You should see a JSON response with the transcript!

---

## 🔧 Troubleshooting

### "Build failed" error
- Make sure all files were uploaded to GitHub
- Check that `netlify.toml` is in the root directory
- Try deploying again (click "Retry deploy")

### "No transcript available" error
- The video doesn't have subtitles
- Try adding `&lang=en` to test with English subtitles

### "Function timeout" error
- The video is very long (>2 hours)
- This is normal with long videos on the free plan

### Need help?
- Check the full documentation in `README.md`
- Open an issue on GitHub
- The service has a test page at your main URL

---

## 💰 Pricing & Limits

**Netlify Free Plan:**
- ✅ 125,000 function requests per month
- ✅ 100 GB bandwidth per month
- ✅ No credit card required
- ✅ No expiration

**What this means:**
- ~4,000 transcripts per day
- Enough for personal use and sharing with friends
- If you exceed limits, service pauses until next month (no charges)

---

## 🔄 Updating Your Service

If you want to update the code later:

1. Go to your GitHub repository
2. Edit the file you want to change
3. Commit the changes
4. Netlify will automatically redeploy (takes ~30 seconds)

---

## 🤝 Sharing with Others

**Option 1: Share your service**
- Give them your API URL
- They use it with their own Shortcut
- Note: All usage counts toward your 125k/month limit

**Option 2: They deploy their own** (recommended)
- Give them this guide
- They deploy in 5 minutes
- Everyone has their own 125k/month limit
- Completely independent services

---

## 🎓 Technical Details

### How It Works

1. **You share a YouTube URL** with the Shortcut
2. **The Shortcut calls your Netlify function** with the video ID
3. **Netlify extracts the transcript** from YouTube's subtitle API
4. **The Shortcut receives the transcript** with timestamps
5. **Claude AI generates a summary** (if you want)
6. **A Craft document is created** with all the content

### What's Included

- **Function:** `get-transcript.js` - Extracts YouTube transcripts
- **Web interface:** `index.html` - Test your service in the browser
- **Config:** `netlify.toml` - Netlify configuration
- **Docs:** Multiple markdown files with guides

### Privacy & Security

- ✅ Your service is public (anyone with the URL can use it)
- ✅ No data is stored (everything is processed in real-time)
- ✅ No logs or tracking
- ✅ Runs on Netlify's secure infrastructure
- ⚠️ Don't share your Anthropic API key (it's for your Shortcut only)

---

## 📚 Additional Resources

- **Full documentation:** See `README.md`
- **iOS Shortcut guide:** See `IOS_SHORTCUT_GUIDE.md`
- **Configuration options:** See `CONFIG_TEMPLATE.md`
- **API examples:** See `EXAMPLES.md`

---

## ✅ Quick Checklist

Before you start using your service, make sure:

- [ ] GitHub repository created and files uploaded
- [ ] Netlify site deployed successfully
- [ ] Service URL is accessible
- [ ] Test page loads correctly
- [ ] API responds to test requests
- [ ] Anthropic API key obtained (for summaries)
- [ ] iOS Shortcut created (optional)

---

## 🎊 Congratulations!

You now have your own YouTube transcript service running on professional infrastructure, completely free!

**Your service URL:** `https://________.netlify.app`

**Questions?** Check the documentation or open an issue on GitHub.

**Enjoy!** 🚀
