# Modern GDPR Cookie Consent

A beautiful, modern, and fully customizable consent solution for websites, supporting multiple privacy regulations including GDPR, ePrivacy, UK GDPR, and CCPA. This solution provides an elegant way to obtain user consent for various cookie categories as required by global privacy regulations.

## Features

- 🎨 **Modern Design**: Sleek, minimalist interface with smooth animations
- 📱 **Responsive**: Looks great on all devices
- 🌓 **Themes**: Light and dark mode support
- 🔧 **Customizable**: Multiple position options, animations, and styling possibilities
- 🔄 **Cookie Categories**: Granular consent management for different cookie types
- 🌐 **Multilingual**: Support for multiple languages
- ✅ **Multi-Regulation Support**: 
  - EU GDPR (General Data Protection Regulation)
  - ePrivacy Directive (Cookie Law)
  - UK GDPR
  - CCPA (California Consumer Privacy Act)
- 🔍 **Accessibility**: Follows accessibility best practices
- 🔒 **Enhanced Security**: Advanced security features suitable for 2025 standards

## Installation

1. Download the three essential files:
   - `gdpr-cookie-consent.js`
   - `gdpr-cookie-consent.css`
   - `demo.html` (for reference)

2. Include the CSS in the `<head>` of your HTML:
   ```html
   <link rel="stylesheet" href="path/to/gdpr-cookie-consent.css">
   ```

3. Include the JavaScript before the closing `</body>` tag:
   ```html
   <script src="path/to/gdpr-cookie-consent.js"></script>
   ```

4. Initialize the consent manager:
   ```html
   <script>
     const gdprCookieConsent = new GDPRCookieConsent({
       // configuration options
     });
   </script>
   ```

## Configuration Options

```javascript
const gdprCookieConsent = new GDPRCookieConsent({
    // Appearance
    theme: 'light', // 'light' or 'dark'
    position: 'bottom', // 'bottom', 'bottom-right'
    animation: 'slide', // 'slide' or 'fade'
    
    // Regulatory Framework
    regulatory: 'gdpr', // 'gdpr', 'ccpa', or 'auto' (attempts to detect based on user's location)
    
    // Cookie Categories
    cookieCategories: [
        { id: 'necessary', name: 'Necessary', description: 'Essential cookies...', required: true },
        { id: 'analytics', name: 'Analytics', description: 'Analytics cookies...', required: false },
        // Add more categories as needed
    ],
    
    // Language & Text
    language: 'en',
    translations: {
        en: {
            title: 'Cookie Settings',
            description: 'We use cookies to...',
            // GDPR-specific text
            acceptAll: 'Accept All',
            customizeSettings: 'Customize Settings',
            // CCPA-specific text
            ccpaTitle: 'Your Privacy Choices',
            ccpaDescription: 'We and our partners use cookies...',
            doNotSell: 'Do Not Sell My Personal Information',
            optOut: 'Opt-Out',
            acceptNotice: 'Accept',
            ccpaRights: 'California residents have the right to opt out...'
            // More text options...
        },
        // Add more languages as needed
    },
    
    // Callbacks
    onAccept: function(preferences) {
        // Code to run when all cookies are accepted
    },
    onCustomize: function(preferences) {
        // Code to run when custom preferences are saved
    },
    onOptOut: function(preferences) {
        // Code to run when user opts out (CCPA)
    },
    
    // Additional options
    privacyPolicyLink: '/privacy-policy',
    
    // CCPA-specific options
    ccpaDoNotSellLink: '/do-not-sell',
    includeDoNotSellButton: true, // Whether to show the "Do Not Sell" button
    
    // Security Configuration (2025 Features)
    securityOptions: {
        cookieSecure: true,             // Ensure cookies use Secure flag when on HTTPS
        respectGPC: true,               // Honor Global Privacy Control signals
        storageEncryption: true,        // Encrypt locally stored consent data
        consentVerification: 'strong',  // Implement stronger consent verification
        fraudPrevention: true,          // Add consent fraud prevention measures
        autoDeleteInactive: 180         // Auto-delete inactive consent records (days)
    }
});
```

## Security Features (2025 Standards)

The cookie consent solution includes advanced security features suitable for 2025 standards:

### Encryption and Data Protection
- **Storage Encryption**: Uses Web Crypto API to encrypt consent data before storage
- **Secure Cookie Flags**: Automatically applies Secure, SameSite, and other protections
- **Cookie Partitioning**: Supports modern browser privacy features like Partitioned cookies
- **Auto-Expiration**: Automatically expires and renews consent after configurable period

### Fraud Prevention
- **Consent Verification**: Multiple levels of verification (basic, standard, strong)
- **Device Binding**: Optional binding of consent to device fingerprint
- **Cryptographic Signatures**: Signs consent records for later verification
- **CSRF Protection**: Uses nonces to prevent cross-site request forgery

### Privacy Features
- **Global Privacy Control**: Automatically respects GPC signals
- **Privacy Sandbox Integration**: Works with Google's Privacy Sandbox technologies
- **Post-Cookie Solutions**: Supports modern alternatives to third-party cookies
- **Consent Events**: Broadcasts consent status via custom events for integration

### Graceful Fallback
All security features implement graceful fallback when advanced browser features aren't available:
- Falls back to non-encrypted storage if Web Crypto API isn't available
- Detects and adapts to browser capabilities for cookie attributes
- Functions even in browsers with JavaScript restrictions
- Maintains privacy protection even when advanced features can't be used

## Cookie Categories

Define cookie categories to allow users to customize their consent:

```javascript
cookieCategories: [
    { 
        id: 'necessary', 
        name: 'Necessary', 
        description: 'These cookies are essential for the website to function properly.', 
        required: true // Cannot be disabled
    },
    { 
        id: 'analytics', 
        name: 'Analytics', 
        description: 'These cookies help us understand how visitors interact with the website.', 
        required: false 
    },
    // Add more categories
]
```

## Methods

```javascript
// Show the cookie banner
gdprCookieConsent.showBanner();

// Reset consent and show the banner again
gdprCookieConsent.resetConsent();

// Check if consent has been given
if (gdprCookieConsent.consentGiven) {
    // Do something
}

// CCPA-specific: Trigger "Do Not Sell My Personal Information" functionality
gdprCookieConsent.doNotSell();

// Advanced security methods
gdprCookieConsent.verifyConsent(consentData); // Verify a consent record
gdprCookieConsent.resetConsentVerification(); // Re-verify existing consent
```

## Regulatory Frameworks

The script supports different regulatory frameworks, each with its own interface and requirements:

### GDPR Mode
Shows a cookie consent banner with "Accept All" and "Customize Settings" options, allowing users to give granular consent for different cookie categories.

### CCPA Mode
Shows a privacy notice with "Accept" and "Do Not Sell My Personal Information" options, focusing on the right to opt out of personal information "sales" (which can include certain types of cookie sharing).

### Auto-detection
You can set `regulatory: 'auto'` to have the script attempt to determine which framework to use based on the user's timezone:
- EU timezones → GDPR
- US/California timezone → CCPA
- Other regions → Defaults to GDPR (as the more restrictive option)

## Styling Customization

You can customize the appearance by overriding CSS variables:

```css
:root {
  --gdpr-primary-color: #4a6cf7;
  --gdpr-secondary-color: #f8f9fa;
  --gdpr-text-color: #212529;
  --gdpr-light-text: #6c757d;
  --gdpr-border-color: #e9ecef;
  --gdpr-success-color: #28a745;
  --gdpr-radius: 12px;
  --gdpr-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
```

## Adding a Settings Button

To allow users to access cookie settings after their initial choice:

```html
<button id="open-cookie-settings">Cookie Settings</button>

<script>
    document.getElementById('open-cookie-settings').addEventListener('click', function() {
        gdprCookieConsent.showBanner();
    });
</script>
```

## Implementing Cookie Handling

**Important**: This solution provides the UI for collecting consent and storing user preferences, but does not directly manage cookies itself. Developers must implement the actual cookie handling logic.

### How Cookie Management Works

1. The script collects and stores user preferences (which cookie categories they accept or reject)
2. Developers must implement the cookie handling logic in the provided callback functions
3. The `applyConsent()` method is intentionally left as a placeholder for custom implementation

### Implementing the Logic

To make the solution fully functional, modify the `applyConsent()` method in the script or use the callback functions:

```javascript
// Example implementation for the applyConsent method
applyConsent(preferencesData) {
    // Handle different data structures (for backward compatibility)
    const preferences = preferencesData.preferences || preferencesData;
    
    // Analytics cookies (e.g., Google Analytics)
    if (preferences.analytics) {
        // Enable analytics
        window.enableAnalytics(); // Your function to enable analytics
    } else {
        // Disable analytics
        window.disableAnalytics(); // Your function to disable analytics
        this.removeCookiesByPrefix('_ga'); // Remove Google Analytics cookies
    }
    
    // Marketing cookies (e.g., ad tracking)
    if (preferences.marketing) {
        // Enable marketing cookies
        window.enableAdTracking(); // Your function to enable ad tracking
    } else {
        // Disable marketing cookies
        window.disableAdTracking(); // Your function to disable ad tracking
        this.removeCookiesByPrefix('_fb_'); // Remove Facebook cookies
    }
    
    // Preferences cookies
    if (preferences.preferences) {
        // Enable preferences cookies
        localStorage.setItem('preferences_enabled', 'true');
    } else {
        // Disable preferences cookies
        localStorage.removeItem('preferences_enabled');
        this.removeCookiesByPrefix('preferences_');
    }
    
    console.log('Applied consent preferences:', preferences);
}

// Helper method to remove cookies by prefix (add this to the class)
removeCookiesByPrefix(prefix) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(prefix) === 0) {
            const name = cookie.substring(0, cookie.indexOf('='));
            this.deleteCookie(name);
        }
    }
}
```

### Using Callback Functions

You can also implement cookie handling in the provided callbacks:

```javascript
const gdprCookieConsent = new GDPRCookieConsent({
    // ...other options...
    
    onAccept: function(preferences) {
        console.log('All cookies accepted!');
        
        // Initialize all your tracking scripts here
        initializeGoogleAnalytics();
        initializeFacebookPixel();
        initializeHotjar();
    },
    
    onCustomize: function(preferences) {
        console.log('Custom preferences saved:', preferences);
        
        // Conditionally load scripts based on preferences
        if (preferences.analytics) {
            initializeGoogleAnalytics();
        }
        
        if (preferences.marketing) {
            initializeFacebookPixel();
        }
    },
    
    onOptOut: function(preferences) {
        console.log('User opted out of sale of personal information');
        
        // Implement CCPA-specific opt-out logic
        disableAllMarketingCookies();
        removeAllMarketingCookies();
        updatePrivacyControlSignal();
    }
});
```

### Script Loading Strategy

For the most effective implementation, avoid loading tracking scripts until consent is given:

```html
<script>
    // Check if consent already exists and analytics are allowed
    if (gdprCookieConsent.consentGiven) {
        const preferences = JSON.parse(gdprCookieConsent.getCookie('gdpr_cookie_consent')).preferences;
        
        if (preferences.analytics) {
            // Load analytics script
            const script = document.createElement('script');
            script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXX-X';
            document.body.appendChild(script);
            
            // Initialize analytics
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-XXXXXXXX-X');
        }
    }
</script>
```

## Regulatory Compliance

This solution is designed to help websites comply with major privacy regulations worldwide and includes advanced security features suitable for 2025 standards.

### EU GDPR (General Data Protection Regulation)
- ✅ Requires explicit, informed consent before storing non-essential cookies
- ✅ Allows granular control over different cookie categories
- ✅ Provides clear information about each cookie's purpose
- ✅ Stores consent records with timestamps
- ✅ Makes it as easy to withdraw consent as to give it

### ePrivacy Directive (Cookie Law)
- ✅ Ensures prior consent for all non-essential cookies
- ✅ Distinguishes between necessary cookies and other categories
- ✅ Provides clear and comprehensive information about cookie usage
- ✅ Allows users to access the website even if they decline non-essential cookies

### UK GDPR
- ✅ Complies with requirements similar to EU GDPR with post-Brexit adaptations
- ✅ Uses clear and plain language specific to UK audiences (when configured)
- ✅ Provides specific UK-focused privacy information options

### CCPA (California Consumer Privacy Act)
- ✅ Informs users about collected personal information
- ✅ Provides the right to opt-out of the "sale" of personal information
- ✅ Includes a clear "Do Not Sell My Personal Information" option
- ✅ Records user preferences with timestamps
- ⚠️ Note: CCPA compliance requires additional implementation of data request handling systems beyond this cookie consent tool

### 2025 Security Standards
- ✅ **Crypto Storage**: Uses Web Crypto API for secure storage of consent
- ✅ **Strong Consent Verification**: Implements cryptographic verification of consent
- ✅ **Privacy Sandbox Compatibility**: Works with post-cookie technologies
- ✅ **Enhanced Anti-Fraud Measures**: Prevents consent fraud and tampering
- ✅ **Global Privacy Control**: Respects global privacy signals automatically
- ✅ **Secure by Default**: All cookies have proper security attributes
- ✅ **Graceful Fallback**: Maintains security when advanced features aren't available

### Important Compliance Note
While this tool helps you implement the technical aspects of cookie compliance, proper configuration and legal documentation are essential for full compliance:

1. Work with legal experts to ensure your privacy policy accurately reflects your data practices
2. Customize cookie descriptions to match your specific usage
3. Implement appropriate data processing agreements with third-party services
4. Regularly audit your cookie usage to ensure the consent tool remains accurate

This tool is part of a compliance strategy but does not guarantee complete legal compliance on its own.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, feature requests, or bug reports, please open an issue on the GitHub repository.
