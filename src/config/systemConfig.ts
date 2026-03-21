// src/config/systemConfig.ts

export const DEFAULT_SYSTEM_CONFIG = {
  mode: {
    kioskModeEnabled: false, 
  },
  infrastructure: {
    cache: {
      enableKvCache: true,
      publicPagesTtlSeconds: 3600, 
      menuTtlSeconds: 1800,        
    },
    media: {
      cloudinaryCloudName: "default_cloud_name",
      defaultFolder: "simple-cafe-assets",
    }
  },
  website: {
    siteName: "Default Site Name",
    logoUrl: "", 
    faviconUrl: "",
    contactEmail: "admin@default.com",
    contactPhone: "+000000000000",
    address: "Default Address",
    socialLinks: {
      instagram: "",
      facebook: ""
    },
    seo: {
      metaDescription: "Default Description",
      keywords: "default, keywords"
    },
    features: {
      allowSelfOrderViaTable: true, 
    }
  },
  operational: {
    currencyCode: "USD",
    currencySymbol: "$",
    taxRatePercentage: 0.0, 
    serviceChargePercentage: 0.0,
    kitchen: {
      autoAcceptOrders: false, 
      alertOverdueMinutes: 15,
    },
    receipt: {
      headerText: "Default Header",
      footerText: "Default Footer",
      showWifiPassword: false,
      wifiPassword: ""
    }
  }
};

export const SettingKeys = {
  KIOSK_MODE_ENABLED: "mode.kioskModeEnabled",
  KV_CACHE_ENABLED: "infrastructure.cache.enableKvCache",
  KV_PAGES_TTL: "infrastructure.cache.publicPagesTtlSeconds",
  KV_MENU_TTL: "infrastructure.cache.menuTtlSeconds",
  CLOUDINARY_CLOUD_NAME: "infrastructure.media.cloudinaryCloudName",
  CLOUDINARY_FOLDER: "infrastructure.media.defaultFolder",
  SITE_NAME: "website.siteName",
  LOGO_URL: "website.logoUrl",
  FAVICON_URL: "website.faviconUrl",
  CONTACT_EMAIL: "website.contactEmail",
  CONTACT_PHONE: "website.contactPhone",
  ADDRESS: "website.address",
  SOCIAL_INSTAGRAM: "website.socialLinks.instagram",
  SOCIAL_FACEBOOK: "website.socialLinks.facebook",
  SEO_DESCRIPTION: "website.seo.metaDescription",
  SEO_KEYWORDS: "website.seo.keywords",
  ALLOW_SELF_ORDER: "website.features.allowSelfOrderViaTable",
  CURRENCY_CODE: "operational.currencyCode",
  CURRENCY_SYMBOL: "operational.currencySymbol",
  TAX_RATE: "operational.taxRatePercentage",
  SERVICE_CHARGE: "operational.serviceChargePercentage",
  KITCHEN_AUTO_ACCEPT: "operational.kitchen.autoAcceptOrders",
  KITCHEN_ALERT_OVERDUE: "operational.kitchen.alertOverdueMinutes",
  RECEIPT_HEADER: "operational.receipt.headerText",
  RECEIPT_FOOTER: "operational.receipt.footerText",
  RECEIPT_SHOW_WIFI: "operational.receipt.showWifiPassword",
  RECEIPT_WIFI_PASS: "operational.receipt.wifiPassword",
} as const;

export type SystemConfig = typeof DEFAULT_SYSTEM_CONFIG;