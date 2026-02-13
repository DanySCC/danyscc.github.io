# TradingView → Telegram Alert System

## ✅ Status: LIVE & TESTED

Your crypto alert system is running! Test notification sent to Telegram.

---

## 📍 Your Webhook URL

```
http://78.46.72.86/tradingview/webhook
```

**⚠️ IMPORTANT:** After nginx config below, this URL will be publicly accessible. Anyone with the URL can send you alerts. Consider adding authentication if you want extra security.

---

## 🔧 Setup Steps

### 1. Install Nginx Configuration (One-time)

Run these commands to add the webhook endpoint to nginx:

```bash
# Add webhook location block to nginx config
sudo nano /etc/nginx/sites-available/default
```

**Add this block INSIDE the `server { ... }` block**, right after the `server_name _;` line:

```nginx
	# TradingView Webhook Endpoint
	location /tradingview/webhook {
		proxy_pass http://127.0.0.1:3002/webhook;
		proxy_http_version 1.1;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		
		# Allow POST requests only
		limit_except POST {
			deny all;
		}
	}

	# Webhook Health Check (GET)
	location /tradingview/health {
		proxy_pass http://127.0.0.1:3002/health;
		proxy_http_version 1.1;
		proxy_set_header Host $host;
	}
```

**Test and reload nginx:**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### 2. Install Systemd Service (For Auto-Start on Reboot)

```bash
# Copy service file
sudo cp /tmp/tradingview-webhook.service /etc/systemd/system/

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable tradingview-webhook
sudo systemctl restart tradingview-webhook

# Check status
sudo systemctl status tradingview-webhook
```

---

### 3. Verify Installation

```bash
# Test health endpoint (should return {"status":"ok",...})
curl http://78.46.72.86/tradingview/health

# Test webhook (should send you a Telegram message)
curl -X POST http://78.46.72.86/tradingview/webhook \
  -H "Content-Type: application/json" \
  -d '{"ticker":"TEST","price":"1.23","message":"Test alert from server"}'
```

---

## 🎯 TradingView Alert Setup

### Step 1: Open TradingView Chart
- Go to TradingView.com
- Open the BERA/USDT chart (or any crypto pair)

### Step 2: Create Alert
1. Click the **Alert** button (🔔 icon) in the top toolbar
2. Or right-click on the chart → **Add alert**

### Step 3: Configure Alert
**Condition:**
- Choose your trigger (e.g., "Price crosses above", "RSI crosses 70", etc.)
- Set the value (e.g., $0.90 for BERA)

**Alert Name:**
- Give it a descriptive name (e.g., "BERA above $0.90")

**Message:**
- Customize your alert text. TradingView supports variables:
  ```
  🚨 {{ticker}} Alert!
  Price: {{close}}
  Exchange: {{exchange}}
  Time: {{time}}
  Interval: {{interval}}
  ```

**Webhook URL:**
```
http://78.46.72.86/tradingview/webhook
```

**Expiration:**
- Set to "Only Once" (for one-time alerts)
- Or "Every time" (for recurring alerts)

### Step 4: Click "Create"

---

## 📊 Advanced: Structured JSON Alerts

For better formatting, you can send structured JSON in the TradingView alert message:

```json
{
  "ticker": "{{ticker}}",
  "price": "{{close}}",
  "exchange": "{{exchange}}",
  "interval": "{{interval}}",
  "alertType": "Price Alert",
  "message": "BERA crossed above $0.90! 🚀",
  "time": "{{time}}"
}
```

The webhook will automatically parse this and format it nicely for Telegram.

---

## 🔍 Monitoring & Logs

**Check webhook server status:**
```bash
sudo systemctl status tradingview-webhook
```

**View live logs:**
```bash
sudo journalctl -u tradingview-webhook -f
```

**View log file:**
```bash
tail -f /var/log/tradingview-webhook.log
```

---

## 🛠️ Troubleshooting

**Alerts not arriving?**
1. Check webhook server is running: `systemctl status tradingview-webhook`
2. Check nginx config: `sudo nginx -t`
3. Test endpoint manually: `curl http://78.46.72.86/tradingview/health`
4. Check logs: `sudo journalctl -u tradingview-webhook -f`

**Telegram messages formatted weird?**
- Make sure your TradingView alert message is valid JSON
- Or just use plain text (works fine too)

---

## 🚀 What's Next?

1. **Set up your first BERA alert** (price, RSI, volume, whatever)
2. **Test it** — trigger the alert manually to see it work
3. **Add more coins** — repeat for any crypto you want to track
4. **Advanced**: Create indicator-based alerts (RSI, MACD, etc.)

---

## 💪 You're Done!

Your TradingView → Telegram pipeline is live. Every alert you create in TradingView will hit your server and land in Telegram instantly.

**Questions? Just ping me.** 💪
