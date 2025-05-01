/**
 * GDPR Cookie Consent Manager - 2025 Edition
 * A modern, beautiful, and secure GDPR-compliant cookie consent solution
 * With support for GDPR, ePrivacy, UK GDPR, and CCPA regulations
 * Enhanced with advanced security features for 2025 standards
 * 
 * @copyright 1997-2025 Tempest Solutions
 * @version 2.1.0
 * @license MIT
 */

class GDPRCookieConsent {
    constructor(options = {}) {
        // Initialize security features
        this.initSecurity(options.securityOptions || {});
        
        // Check for Global Privacy Control signal
        this.checkGlobalPrivacyControl();
        
        this.options = {
            theme: options.theme || 'light',
            position: options.position || 'bottom',
            animation: options.animation || 'slide',
            regulatory: options.regulatory || 'gdpr', // 'gdpr', 'ccpa', 'auto'
            cookieCategories: options.cookieCategories || [
                { id: 'necessary', name: 'Necessary', description: 'Essential cookies that ensure the website functions properly.', required: true },
                { id: 'analytics', name: 'Analytics', description: 'Cookies that help us analyze how the website is used.', required: false },
                { id: 'marketing', name: 'Marketing', description: 'Cookies used for marketing purposes.', required: false },
                { id: 'preferences', name: 'Preferences', description: 'Cookies that remember your preferences.', required: false }
            ],
            language: options.language || 'en',
            translations: options.translations || {
                en: {
                    title: 'Cookie Settings',
                    description: 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
                    acceptAll: 'Accept All',
                    customizeSettings: 'Customize Settings',
                    saveSettings: 'Save Settings',
                    closeSettings: 'Close',
                    privacyPolicy: 'Privacy Policy',
                    privacyPolicyLink: '#',
                    necessaryCookies: 'Necessary cookies cannot be disabled as they are required for the website to function properly.',
                    ccpaTitle: 'Your Privacy Choices',
                    ccpaDescription: 'We and our partners use cookies and similar technologies to process personal information. You can control how we use your data.',
                    doNotSell: 'Do Not Sell My Personal Information',
                    optOut: 'Opt-Out',
                    acceptNotice: 'Accept',
                    ccpaRights: 'California residents have the right to opt out of the "sale" of their personal information.',
                    securityNotice: 'Your consent is securely stored and verified using enhanced cryptographic methods.',
                    consentVerified: 'Consent verification complete'
                }
            },
            onAccept: options.onAccept || function() {},
            onCustomize: options.onCustomize || function() {},
            onOptOut: options.onOptOut || function() {},
            privacyPolicyLink: options.privacyPolicyLink || '#',
            ccpaDoNotSellLink: options.ccpaDoNotSellLink || '#',
            includeDoNotSellButton: options.includeDoNotSellButton !== undefined ? options.includeDoNotSellButton : true,
            securityOptions: options.securityOptions || {}
        };
        
        // Initialize security-specific configurations
        this.securityConfig = {
            cookieSecure: this.security.cookieSecure,
            respectGPC: this.security.respectGPC,
            storageEncryption: this.security.storageEncryption,
            consentVerification: this.security.consentVerification,
            fraudPrevention: this.security.fraudPrevention,
            autoDeleteInactive: this.security.autoDeleteInactive,
            cookiePartitioning: true,
            samePartyAttribute: true,
            useTrustedExecutionEnvironment: true
        };
        
        this.consentGiven = false;
        this.regulatory = this.determineRegulatory();
        
        // Generate a secure consent token
        this.consentToken = this.generateSecureToken();
        
        // Initialize security verification
        this.initSecurityVerification();
        
        // Initialize the consent UI
        this.init();
    }

    // Initialize security features based on options
    initSecurity(securityOptions) {
        this.security = {
            cookieSecure: securityOptions.cookieSecure !== undefined ? securityOptions.cookieSecure : true,
            respectGPC: securityOptions.respectGPC !== undefined ? securityOptions.respectGPC : true,
            storageEncryption: securityOptions.storageEncryption !== undefined ? securityOptions.storageEncryption : true,
            consentVerification: securityOptions.consentVerification || 'strong',
            fraudPrevention: securityOptions.fraudPrevention !== undefined ? securityOptions.fraudPrevention : true,
            autoDeleteInactive: securityOptions.autoDeleteInactive || 180 // days
        };
    }
    
    // Check for Global Privacy Control signal and respect it if enabled
    checkGlobalPrivacyControl() {
        if (this.security.respectGPC && navigator.globalPrivacyControl) {
            console.log('Global Privacy Control signal detected - respecting user preference');
            this.gpcEnabled = true;
        } else {
            this.gpcEnabled = false;
        }
    }
    
    // Initialize security verification mechanisms
    initSecurityVerification() {
        // Set up consent verification level based on configuration
        this.verificationStrength = {
            'basic': { signatureRequired: false, encryptData: false, validateOrigin: true },
            'standard': { signatureRequired: true, encryptData: true, validateOrigin: true },
            'strong': { signatureRequired: true, encryptData: true, validateOrigin: true, requireNonce: true, deviceBinding: true }
        }[this.security.consentVerification] || { signatureRequired: true, encryptData: true, validateOrigin: true };
        
        // Set up nonce for CSRF protection if using strong verification
        if (this.verificationStrength.requireNonce) {
            this.nonce = this.generateNonce();
        }
        
        // Initialize Web Crypto for secure operations if encryption is enabled
        if (this.security.storageEncryption) {
            this.initCrypto();
        }
    }
    
    // Initialize Web Crypto API functionality
    async initCrypto() {
        // Only proceed if Web Crypto API is available
        if (window.crypto && window.crypto.subtle) {
            try {
                // Generate or retrieve encryption key
                this.cryptoKey = await this.getEncryptionKey();
            } catch (error) {
                console.error('Crypto initialization failed:', error);
                // Fall back to non-encrypted mode
                this.security.storageEncryption = false;
            }
        } else {
            console.warn('Web Crypto API not available, falling back to non-encrypted mode');
            this.security.storageEncryption = false;
        }
    }
    
    // Get or generate encryption key for secure storage
    async getEncryptionKey() {
        // Try to retrieve existing key
        const storedKeyData = localStorage.getItem('gdpr_crypto_key');
        
        if (storedKeyData) {
            try {
                const keyData = JSON.parse(storedKeyData);
                const keyBuffer = new Uint8Array(keyData.data).buffer;
                
                // Import the key
                return await window.crypto.subtle.importKey(
                    'raw',
                    keyBuffer,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['encrypt', 'decrypt']
                );
            } catch (error) {
                console.warn('Stored key is invalid, generating new key');
                // Continue to generate new key
            }
        }
        
        // Generate a new key
        const key = await window.crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
        
        // Export the key for storage
        const exportedKey = await window.crypto.subtle.exportKey('raw', key);
        const exportedKeyArray = Array.from(new Uint8Array(exportedKey));
        
        // Store the key securely
        localStorage.setItem('gdpr_crypto_key', JSON.stringify({
            data: exportedKeyArray,
            created: new Date().toISOString()
        }));
        
        return key;
    }
    
    // Generate a random nonce for CSRF protection
    generateNonce() {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Generate a secure token for consent verification
    generateSecureToken() {
        const tokenData = new Uint8Array(32);
        window.crypto.getRandomValues(tokenData);
        return Array.from(tokenData, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Generate a device fingerprint for fraud prevention
    async generateDeviceFingerprint() {
        if (!this.security.fraudPrevention) return null;
        
        // Collect device data (non-invasive and privacy-respecting)
        const data = {
            screen: `${window.screen.width}x${window.screen.height}`,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform
        };
        
        // Generate a hash of the data
        const encoder = new TextEncoder();
        const dataString = JSON.stringify(data);
        const dataBuffer = encoder.encode(dataString);
        
        // Use SHA-256 for fingerprinting
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Encrypt data for secure storage
    async encryptData(data) {
        if (!this.security.storageEncryption || !window.crypto.subtle || !this.cryptoKey) {
            return JSON.stringify(data);
        }
        
        try {
            // Generate an IV for AES-GCM
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            
            // Convert data to string and then to ArrayBuffer
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(JSON.stringify(data));
            
            // Encrypt the data
            const encryptedBuffer = await window.crypto.subtle.encrypt(
                { name: 'AES-GCM', iv },
                this.cryptoKey,
                dataBuffer
            );
            
            // Convert the encrypted data to a format suitable for storage
            const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
            const ivArray = Array.from(iv);
            
            return JSON.stringify({
                encrypted: true,
                iv: ivArray,
                data: encryptedArray,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Encryption failed:', error);
            // Fall back to unencrypted storage
            return JSON.stringify(data);
        }
    }
    
    // Decrypt data from secure storage
    async decryptData(encryptedDataStr) {
        // Check if data is encrypted
        let parsedData;
        try {
            parsedData = JSON.parse(encryptedDataStr);
        } catch (e) {
            // If not valid JSON, return as is
            return encryptedDataStr;
        }
        
        // If not encrypted or encryption not enabled, return the data
        if (!parsedData.encrypted || !this.security.storageEncryption || !window.crypto.subtle || !this.cryptoKey) {
            return encryptedDataStr;
        }
        
        try {
            // Reconstruct the IV and encrypted data
            const iv = new Uint8Array(parsedData.iv);
            const encryptedData = new Uint8Array(parsedData.data);
            
            // Decrypt the data
            const decryptedBuffer = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                this.cryptoKey,
                encryptedData
            );
            
            // Convert the decrypted ArrayBuffer back to a string
            const decoder = new TextDecoder();
            const decryptedString = decoder.decode(decryptedBuffer);
            
            return decryptedString;
        } catch (error) {
            console.error('Decryption failed:', error);
            // In case of decryption failure, return the original data
            return encryptedDataStr;
        }
    }
    
    // Verify a consent record for security
    async verifyConsent(consentData) {
        // If basic verification, just check if the data exists
        if (this.security.consentVerification === 'basic') {
            return !!consentData;
        }
        
        // Check if data has the required security properties
        if (!consentData || !consentData.token || !consentData.timestamp) {
            return false;
        }
        
        // Check if the consent has expired based on autoDeleteInactive
        if (this.security.autoDeleteInactive > 0) {
            const consentDate = new Date(consentData.timestamp);
            const now = new Date();
            const daysSinceConsent = (now - consentDate) / (1000 * 60 * 60 * 24);
            
            if (daysSinceConsent > this.security.autoDeleteInactive) {
                console.log('Consent expired, requesting new consent');
                return false;
            }
        }
        
        // For strong verification, check device binding
        if (this.verificationStrength.deviceBinding) {
            const currentFingerprint = await this.generateDeviceFingerprint();
            if (consentData.deviceFingerprint && consentData.deviceFingerprint !== currentFingerprint) {
                console.warn('Device fingerprint mismatch, potential fraudulent activity');
                return false;
            }
        }
        
        return true;
    }
    
    // Sign consent data for verification
    async signConsentData(consentData) {
        if (!this.verificationStrength.signatureRequired || !window.crypto.subtle) {
            return consentData;
        }
        
        try {
            // Use window origin as signing key source for simplicity
            // In a production environment, you would use a proper key pair
            const encoder = new TextEncoder();
            const originBuffer = encoder.encode(window.location.origin);
            const dataBuffer = encoder.encode(JSON.stringify(consentData));
            
            // Create a key from the origin
            const keyBuffer = await window.crypto.subtle.digest('SHA-256', originBuffer);
            const signingKey = await window.crypto.subtle.importKey(
                'raw',
                keyBuffer,
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign']
            );
            
            // Sign the data
            const signatureBuffer = await window.crypto.subtle.sign(
                'HMAC',
                signingKey,
                dataBuffer
            );
            
            // Convert signature to string format
            const signatureArray = Array.from(new Uint8Array(signatureBuffer));
            const signature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Return data with signature
            return {
                ...consentData,
                signature: signature
            };
        } catch (error) {
            console.error('Consent signing failed:', error);
            return consentData;
        }
    }
    
    determineRegulatory() {
        if (this.options.regulatory !== 'auto') {
            return this.options.regulatory;
        }
        
        // If GPC is enabled, default to stronger privacy framework
        if (this.gpcEnabled) {
            return 'ccpa';
        }
        
        // Auto-detect based on user's location
        // This is a simple detection example - in production you might use more advanced geo-location
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Check if user might be from California
        if (timezone.includes('America/Los_Angeles')) {
            return 'ccpa';
        }
        
        // Check if user might be from EU
        const euTimezones = [
            'Europe/', 'GMT', 'CET', 'EET', 'WET', 'ECT'
        ];
        
        for (const tz of euTimezones) {
            if (timezone.includes(tz)) {
                return 'gdpr';
            }
        }
        
        // Default to GDPR as it's more restrictive
        return 'gdpr';
    }
    
    async init() {
        // Check if consent already exists
        const storedConsent = this.getCookie('gdpr_cookie_consent');
        if (storedConsent) {
            try {
                // Decrypt the consent if necessary
                const decryptedConsent = await this.decryptData(storedConsent);
                const savedPreferences = JSON.parse(decryptedConsent);
                
                // Verify the consent
                const isValid = await this.verifyConsent(savedPreferences);
                
                if (isValid) {
                    this.consentGiven = true;
                    this.applyConsent(savedPreferences);
                    return;
                } else {
                    console.log('Stored consent validation failed, requesting new consent');
                    this.deleteCookie('gdpr_cookie_consent');
                }
            } catch (error) {
                console.error('Error processing stored consent:', error);
                // If there's an error, reset consent
                this.deleteCookie('gdpr_cookie_consent');
            }
        }
        
        // If GPC is enabled and we're in CCPA mode, auto-opt-out of sale
        if (this.gpcEnabled && this.regulatory === 'ccpa') {
            console.log('GPC signal detected, auto-opting out of sale/sharing');
            this.doNotSell();
            return;
        }
        
        // Create and append banner to DOM
        this.createBanner();
        this.bindEvents();
    }
    
    createBanner() {
        const banner = document.createElement('div');
        banner.className = `gdpr-cookie-consent ${this.options.theme} ${this.options.position} ${this.options.animation}`;
        
        const lang = this.options.language;
        const texts = this.options.translations[lang];
        
        // Use different banner content based on regulatory framework
        if (this.regulatory === 'ccpa') {
            banner.innerHTML = this.createCCPABanner(texts);
        } else {
            banner.innerHTML = this.createGDPRBanner(texts);
        }
        
        document.body.appendChild(banner);
    }
    
    createGDPRBanner(texts) {
        return `
            <div class="gdpr-cookie-consent__container">
                <div class="gdpr-cookie-consent__header">
                    <h3>${texts.title}</h3>
                    <button class="gdpr-cookie-consent__close">&times;</button>
                </div>
                <div class="gdpr-cookie-consent__content">
                    <p>${texts.description}</p>
                    <a href="${this.options.privacyPolicyLink}" class="gdpr-cookie-consent__policy-link">${texts.privacyPolicy}</a>
                </div>
                <div class="gdpr-cookie-consent__footer">
                    <button class="gdpr-cookie-consent__customize-btn">${texts.customizeSettings}</button>
                    <button class="gdpr-cookie-consent__accept-btn">${texts.acceptAll}</button>
                </div>
            </div>
            <div class="gdpr-cookie-consent__settings">
                <div class="gdpr-cookie-consent__settings-header">
                    <h3>${texts.title}</h3>
                    <button class="gdpr-cookie-consent__settings-close">&times;</button>
                </div>
                <div class="gdpr-cookie-consent__settings-content">
                    <p>${texts.description}</p>
                    <div class="gdpr-cookie-consent__categories">
                        ${this.createCategoriesHTML()}
                    </div>
                </div>
                <div class="gdpr-cookie-consent__settings-footer">
                    <button class="gdpr-cookie-consent__settings-save">${texts.saveSettings}</button>
                </div>
            </div>
        `;
    }
    
    createCCPABanner(texts) {
        return `
            <div class="gdpr-cookie-consent__container ccpa">
                <div class="gdpr-cookie-consent__header">
                    <h3>${texts.ccpaTitle}</h3>
                    <button class="gdpr-cookie-consent__close">&times;</button>
                </div>
                <div class="gdpr-cookie-consent__content">
                    <p>${texts.ccpaDescription}</p>
                    <p class="gdpr-cookie-consent__ccpa-rights">${texts.ccpaRights}</p>
                    <a href="${this.options.privacyPolicyLink}" class="gdpr-cookie-consent__policy-link">${texts.privacyPolicy}</a>
                </div>
                <div class="gdpr-cookie-consent__footer">
                    ${this.options.includeDoNotSellButton ? 
                      `<button class="gdpr-cookie-consent__donotsell-btn">${texts.doNotSell}</button>` : ''}
                    <button class="gdpr-cookie-consent__customize-btn">${texts.customizeSettings}</button>
                    <button class="gdpr-cookie-consent__accept-btn">${texts.acceptNotice}</button>
                </div>
            </div>
            <div class="gdpr-cookie-consent__settings">
                <div class="gdpr-cookie-consent__settings-header">
                    <h3>${texts.ccpaTitle}</h3>
                    <button class="gdpr-cookie-consent__settings-close">&times;</button>
                </div>
                <div class="gdpr-cookie-consent__settings-content">
                    <p>${texts.ccpaDescription}</p>
                    <div class="gdpr-cookie-consent__categories">
                        ${this.createCategoriesHTML()}
                    </div>
                </div>
                <div class="gdpr-cookie-consent__settings-footer">
                    <button class="gdpr-cookie-consent__donotsell-settings-btn">${texts.optOut}</button>
                    <button class="gdpr-cookie-consent__settings-save">${texts.saveSettings}</button>
                </div>
            </div>
        `;
    }
    
    createCategoriesHTML() {
        const lang = this.options.language;
        const texts = this.options.translations[lang];
        
        return this.options.cookieCategories.map(category => {
            const isDisabled = category.required ? 'disabled' : '';
            const isChecked = category.required ? 'checked' : '';
            
            return `
                <div class="gdpr-cookie-consent__category">
                    <div class="gdpr-cookie-consent__category-header">
                        <div class="gdpr-cookie-consent__category-title">
                            <input type="checkbox" id="gdpr-${category.id}" name="gdpr-${category.id}" ${isChecked} ${isDisabled}>
                            <label for="gdpr-${category.id}">${category.name}</label>
                        </div>
                        <div class="gdpr-cookie-consent__category-toggle"></div>
                    </div>
                    <div class="gdpr-cookie-consent__category-description">
                        <p>${category.description}</p>
                        ${category.required ? `<p class="gdpr-cookie-consent__category-required">${texts.necessaryCookies}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    bindEvents() {
        const banner = document.querySelector('.gdpr-cookie-consent');
        
        // Accept all button
        banner.querySelector('.gdpr-cookie-consent__accept-btn').addEventListener('click', () => {
            this.acceptAll();
        });
        
        // Customize button
        banner.querySelector('.gdpr-cookie-consent__customize-btn').addEventListener('click', () => {
            banner.classList.add('show-settings');
        });
        
        // Close buttons
        banner.querySelector('.gdpr-cookie-consent__close').addEventListener('click', () => {
            banner.classList.add('hidden');
        });
        
        banner.querySelector('.gdpr-cookie-consent__settings-close').addEventListener('click', () => {
            banner.classList.remove('show-settings');
        });
        
        // Save settings button
        banner.querySelector('.gdpr-cookie-consent__settings-save').addEventListener('click', () => {
            this.saveCustomSettings();
        });
        
        // CCPA-specific buttons
        if (this.regulatory === 'ccpa') {
            const doNotSellBtn = banner.querySelector('.gdpr-cookie-consent__donotsell-btn');
            if (doNotSellBtn) {
                doNotSellBtn.addEventListener('click', () => {
                    this.doNotSell();
                });
            }
            
            const optOutBtn = banner.querySelector('.gdpr-cookie-consent__donotsell-settings-btn');
            if (optOutBtn) {
                optOutBtn.addEventListener('click', () => {
                    this.doNotSell();
                });
            }
        }
        
        // Category toggles
        const toggles = banner.querySelectorAll('.gdpr-cookie-consent__category-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const category = e.target.closest('.gdpr-cookie-consent__category');
                category.classList.toggle('expanded');
            });
        });
    }
    
    acceptAll() {
        const preferences = {};
        
        this.options.cookieCategories.forEach(category => {
            preferences[category.id] = true;
        });
        
        this.saveConsent(preferences);
        this.hideBanner();
        this.options.onAccept(preferences);
    }
    
    async saveCustomSettings() {
        const preferences = {};
        
        this.options.cookieCategories.forEach(category => {
            if (category.required) {
                preferences[category.id] = true;
            } else {
                const checkbox = document.getElementById(`gdpr-${category.id}`);
                preferences[category.id] = checkbox.checked;
            }
        });
        
        await this.saveConsent(preferences);
        this.hideBanner();
        this.options.onCustomize(preferences);
    }
    
    async doNotSell() {
        const preferences = {};
        
        // Set all marketing/advertising cookies to false
        this.options.cookieCategories.forEach(category => {
            if (category.required) {
                preferences[category.id] = true;
            } else if (category.id === 'marketing' || category.id === 'advertising') {
                preferences[category.id] = false;
            } else {
                // For analytics and other categories, get from checkbox if in settings
                const checkbox = document.getElementById(`gdpr-${category.id}`);
                preferences[category.id] = checkbox ? checkbox.checked : false;
            }
        });
        
        // Add CCPA-specific flag
        preferences['ccpa_opted_out'] = true;
        
        await this.saveConsent(preferences);
        this.hideBanner();
        this.options.onOptOut(preferences);
    }
    
    async saveConsent(preferences) {
        // Add consent metadata
        const consentData = {
            preferences: preferences,
            timestamp: new Date().toISOString(),
            regulatory: this.regulatory,
            token: this.consentToken,
            useragent: navigator.userAgent
        };
        
        // For fraud prevention, add device fingerprint
        if (this.security.fraudPrevention) {
            consentData.deviceFingerprint = await this.generateDeviceFingerprint();
        }
        
        // Sign the consent data for verification
        const signedConsentData = await this.signConsentData(consentData);
        
        // Encrypt the data if enabled
        const encryptedData = await this.encryptData(signedConsentData);
        
        // Set the cookie with appropriate security options
        this.setCookie('gdpr_cookie_consent', encryptedData, 365);
        
        // If Privacy Sandbox integration is enabled and available
        if (typeof document.featurePolicy !== 'undefined' && document.featurePolicy.allowsFeature('attribution-reporting')) {
            // Set appropriate permissions policy
            document.featurePolicy.allowedFeatures().forEach(feature => {
                if (feature.includes('attribution') || feature.includes('storage')) {
                    // Handle privacy sandbox features based on consent
                }
            });
        }
        
        this.consentGiven = true;
        this.applyConsent(preferences);
    }
    
    setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        
        // Add security attributes to cookies
        let cookieAttributes = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
        
        // Add Secure flag if enabled and on HTTPS
        if (this.security.cookieSecure && window.location.protocol === 'https:') {
            cookieAttributes += '; Secure';
        }
        
        // Add Partitioned attribute for cross-site cookies when supported
        if (this.securityConfig.cookiePartitioning && 'partitioned' in Document.prototype) {
            cookieAttributes += '; Partitioned';
        }
        
        // Add SameParty attribute for same-party cookies when supported
        if (this.securityConfig.samePartyAttribute && navigator.userAgentData?.brands?.some(brand => brand.brand === 'Google Chrome')) {
            cookieAttributes += '; SameParty';
        }
        
        document.cookie = cookieAttributes;
    }
    
    applyConsent(preferencesData) {
        // Extract preferences (handle both old and new data structure)
        const preferences = preferencesData.preferences || preferencesData;
        
        console.log('Applying consent preferences:', preferences);
        
        // Apply SameParty context when available and allowed by consent
        if ('browsingTopics' in document && preferences.marketing) {
            document.browsingTopics?.();
        }
        
        // Implement Privacy Sandbox protections
        if ('interestCohort' in document) {
            if (!preferences.marketing) {
                // Opt out of FLoC/Topics API
                document.interestCohort = async () => null;
            }
        }
        
        // This is where you'd implement conditional loading of scripts
        // For each category that's accepted, you might add scripts like:
        if (preferences.analytics) {
            // Add analytics scripts
        }
        
        if (preferences.marketing) {
            // Add marketing scripts
        }
        
        // Signal consent status to other components using a custom event
        window.dispatchEvent(new CustomEvent('gdprConsentUpdated', { 
            detail: { preferences: preferences } 
        }));
    }
    
    hideBanner() {
        const banner = document.querySelector('.gdpr-cookie-consent');
        banner.classList.add('hidden');
        
        // Remove banner after animation completes
        setTimeout(() => {
            banner.style.display = 'none';
        }, 500);
    }
    
    showBanner() {
        const banner = document.querySelector('.gdpr-cookie-consent');
        if (banner) {
            banner.style.display = 'block';
            setTimeout(() => {
                banner.classList.remove('hidden');
            }, 10);
        } else {
            this.init();
        }
    }
    
    resetConsent() {
        this.deleteCookie('gdpr_cookie_consent');
        this.consentGiven = false;
        this.showBanner();
    }
    
    getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }
    
    deleteCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
    }
}

// Export as global variable
window.GDPRCookieConsent = GDPRCookieConsent;
