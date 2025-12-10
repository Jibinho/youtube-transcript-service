# YouTube Transcript Service

**Extract transcripts from YouTube videos with timestamps**

A free, self-hosted service that extracts transcripts from any YouTube video and formats them beautifully for note-taking apps like Craft, Notion, or Obsidian.

---

## ✨ Features

- 📝 **Extract full transcripts** from any YouTube video (with subtitles)
- ⏱️ **Timestamps included** for easy navigation
- 🌍 **Multi-language support** (French, English, Spanish, German, etc.)
- 🎨 **Beautiful web interface** for testing
- 📱 **iOS Shortcuts integration** for seamless workflow
- 🤖 **Claude AI integration** for automatic summaries
- 🆓 **100% free** - deploy on Netlify (125,000 requests/month)

---

## 🚀 Quick Start

**5-minute deployment (no technical knowledge required):**

1. Download this repository
2. Create a free GitHub account
3. Upload files to a new repository
4. Deploy to Netlify (1-click)
5. Get your API URL

**👉 Full instructions:** See `DEPLOYMENT_GUIDE.md`

---

## 📱 iOS Shortcut

Once deployed, create an iOS Shortcut that:
1. Takes a YouTube URL
2. Calls your API to get the transcript
3. Uses Claude AI to generate a summary
4. Creates a formatted document in Craft

**👉 Step-by-step guide:** See `IOS_SHORTCUT_GUIDE.md`

---

## 🎯 Use Cases

- **Research:** Quickly extract key points from educational videos
- **Content creation:** Get transcripts for repurposing content
- **Accessibility:** Read video content instead of watching
- **Note-taking:** Save video transcripts with timestamps to your notes
- **Learning:** Review video content at your own pace

---

## 📊 API Usage

**Endpoint:**
```
https://your-site.netlify.app/.netlify/functions/get-transcript
```

**Parameters:**
- `url` or `videoId` (required) - YouTube video
- `lang` (optional) - Language code (default: `fr`)
- `format` (optional) - `detailed`, `timestamped`, or `plain`

**Example:**
```bash
curl "https://your-site.netlify.app/.netlify/functions/get-transcript?videoId=dQw4w9WgXcQ"
```

**Response:**
```json
{
  "videoId": "dQw4w9WgXcQ",
  "language": "en",
  "entryCount": 42,
  "transcript": [
    {
      "timestamp": "0:00",
      "seconds": 0.0,
      "text": "We're no strangers to love"
    }
  ],
  "formattedTranscript": "[0:00] We're no strangers to love\n...",
  "plainText": "We're no strangers to love..."
}
```

---

## 💻 Technical Stack

- **Backend:** Netlify Functions (Node.js serverless)
- **Frontend:** Static HTML/CSS/JavaScript
- **APIs:** YouTube subtitle API, Anthropic Claude API
- **Deployment:** Netlify (automatic deployments via GitHub)

---

## 📖 Documentation

- **`DEPLOYMENT_GUIDE.md`** - Deploy your own instance (start here!)
- **`README.md`** - Full technical documentation
- **`IOS_SHORTCUT_GUIDE.md`** - Create iOS Shortcuts integration
- **`CONFIG_TEMPLATE.md`** - Customization options
- **`EXAMPLES.md`** - API examples and testing

---

## 🤝 Sharing Options

### Option 1: Share Your Deployed Service
- Give others your API URL
- They use it with their own Shortcuts
- Your 125k/month limit is shared

### Option 2: Share This Repository (Recommended)
- Give them this code
- They deploy their own instance (5 minutes)
- Everyone has their own 125k/month limit
- Completely independent

---

## 💰 Cost

**Completely free forever:**
- Netlify Free: 125,000 function requests/month
- No credit card required
- No expiration
- Enough for ~4,000 transcripts/day

**Claude AI summaries (optional):**
- ~$0.001 per summary (~100 tokens)
- 1,000 summaries = $1
- Very affordable

---

## 🔒 Privacy & Security

- ✅ No data stored (everything processed in real-time)
- ✅ No logs or tracking
- ✅ No authentication required
- ✅ Runs on Netlify's secure infrastructure
- ⚠️ Service is public (anyone with URL can use it)
- ⚠️ Keep your Claude API key private (not in the service)

---

## 🐛 Troubleshooting

**"No subtitles available"**
- Video doesn't have subtitles
- Try `lang=en` for English subtitles

**"Function timeout"**
- Video is very long (>2 hours)
- Normal on free plan, try shorter videos

**API not responding**
- Check your Netlify deployment status
- Test the web interface first
- Verify the video ID is correct

---

## 📝 License

MIT License - Free to use, modify, and share

---

## 🌟 Credits

Created for personal use and shared with the community.

Built with:
- Netlify Functions for serverless backend
- YouTube subtitle extraction
- Claude AI for intelligent summaries
- iOS Shortcuts for seamless mobile integration

---

## 🤖 About Claude AI Integration

This service works great with Claude AI (by Anthropic) to generate summaries:

1. Get a free API key at https://console.anthropic.com
2. Use it in your iOS Shortcut to generate summaries
3. Each summary costs ~$0.001 (very cheap!)
4. Perfect for quickly understanding video content

---

## 📞 Support

- **Questions?** Open an issue on GitHub
- **Bug reports?** Open an issue with details
- **Feature requests?** Open an issue with your idea

---

## 🎉 Get Started Now!

1. **Download** this repository
2. **Read** `DEPLOYMENT_GUIDE.md`
3. **Deploy** in 5 minutes
4. **Enjoy** your free transcript service!

**Happy transcribing!** 🚀
