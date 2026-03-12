# 05 Database Schema

## 1. Overview
The **Tooleva** platform utilizes a **Static-First, Client-Side Architecture**. Because all file processing (e.g., PDF compression, image resizing) and calculator logic execute securely within the user's browser, there is **no requirement for a centralized database** in the MVP phase. 

## 2. Rationale for No Database
- **Privacy & Security:** Files are never uploaded across the network, sidestepping complex privacy storage regulations like GDPR or HIPAA.
- **Cost Reduction:** Removing a database tier ensures hosting costs approach $0/month while handling substantial traffic natively via CDNs.
- **Performance:** No server round-trips for document manipulation means tools operate instantly based on the user's device speed.

## 3. Client-Side Storage (Future Proofing)
While no SQL/NoSQL schema exists on a server, Tooleva may utilize browser-native storage mechanisms for improving UX over subsequent visits:

### 3.1 LocalStorage / SessionStorage usage:
- **`tooleva_theme`**: Stores a boolean or string (e.g., "dark", "light") for user UI preferences.
- **`recent_tools`**: Stores a lightweight JSON array of recently accessed tool URLs to pre-populate the "Recent Tools" UI component.
  ```json
  [
    { "name": "Compress PDF", "url": "/tools/compress-pdf", "lastUsed": 1690123456789 }
  ]
  ```

## 4. Analytics Data
All persistent relational data tracking user behavior and page hits are offloaded externally to:
- **Google Analytics** (Behavioral Data)
- **Google Search Console** (Organic SEO Data)
- **Google AdSense** (Monetization & Impression Data)

No proprietary schema is maintained for these services on Tooleva's infrastructure.
