# PHP REST API untuk Mabrur AI

Backend API untuk menggantikan Next.js API Routes.

## 📁 Struktur

```
api-php/
├── config/
│   └── database.php       # Database connection & helpers
├── auth/
│   └── login.php          # Admin login
├── jamaah/
│   ├── verify.php         # Verify jamaah token
│   └── status.php         # Get jamaah status
└── content/
    ├── manasik.php        # Get manasik content
    └── chatbot.php        # Chatbot API
```

## 🔧 Setup

### 1. Upload ke cPanel

Upload folder `api-php/` ke `public_html/`

### 2. Konfigurasi Database

Edit `config/database.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'mabx3556_mabrur_ai');
define('DB_USER', 'mabx3556_mabrur_user');
define('DB_PASS', 'YOUR_PASSWORD');
```

### 3. Set Permissions

```
Folders: 755
Files: 644
```

### 4. Test API

Buka di browser:
```
https://yourdomain.com/api-php/content/manasik.php
```

## 📡 API Endpoints

### Auth

**POST** `/api-php/auth/login.php`
```json
{
  "email": "admin@mabrur.ai",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "user": {...},
  "token": "..."
}
```

### Jamaah

**POST** `/api-php/jamaah/verify.php`
```json
{
  "token": "DEMO1234"
}
```

**GET** `/api-php/jamaah/status.php?token=DEMO1234`

### Content

**GET** `/api-php/content/manasik.php`

**POST** `/api-php/content/chatbot.php`
```json
{
  "message": "Apa itu umroh?"
}
```

## 🔒 Security

### Protect Config Files

Create `.htaccess` in `api-php/config/`:

```apache
<Files "*.php">
  Order Allow,Deny
  Deny from all
</Files>
```

### Enable CORS

Already configured in `database.php`:
```php
header('Access-Control-Allow-Origin: *');
```

For production, restrict to your domain:
```php
header('Access-Control-Allow-Origin: https://yourdomain.com');
```

## 🐛 Debugging

### Enable Error Display

In `database.php`, add:
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

**Remove in production!**

### Check PHP Version

Minimum: PHP 7.4

Check in cPanel → PHP Selector

### Check Logs

cPanel → Error Log

## 📝 Adding New Endpoints

1. Create new PHP file in appropriate folder
2. Include `database.php`:
   ```php
   require_once '../config/database.php';
   ```
3. Use helper functions:
   - `getDBConnection()` - Get PDO connection
   - `sendResponse($data, $code)` - Send JSON response
   - `getJSONInput()` - Get POST JSON data

Example:
```php
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

try {
    $db = getDBConnection();
    $stmt = $db->query("SELECT * FROM YourTable");
    $data = $stmt->fetchAll();
    
    sendResponse(['success' => true, 'data' => $data]);
} catch(Exception $e) {
    sendResponse(['error' => $e->getMessage()], 500);
}
?>
```

## ✅ Testing Checklist

- [ ] Database connection works
- [ ] Login API returns token
- [ ] Jamaah verify works with token
- [ ] Manasik content returns data
- [ ] Chatbot responds to messages
- [ ] CORS headers present
- [ ] Error handling works
- [ ] No PHP errors in log

## 🚀 Performance Tips

1. **Enable OPcache** (ask hosting support)
2. **Use prepared statements** (already implemented)
3. **Add caching** for static content
4. **Optimize database queries**

## 📞 Support

If API not working:
1. Check PHP error log in cPanel
2. Test database connection via phpMyAdmin
3. Verify file permissions
4. Check PHP version (min 7.4)
