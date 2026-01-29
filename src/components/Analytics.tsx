'use client';

import Script from 'next/script';

// Analytics provider component that supports multiple platforms
// Configure via environment variables:
// - NEXT_PUBLIC_UMAMI_WEBSITE_ID + NEXT_PUBLIC_UMAMI_URL for Umami
// - NEXT_PUBLIC_PLAUSIBLE_DOMAIN + NEXT_PUBLIC_PLAUSIBLE_URL for Plausible
// - NEXT_PUBLIC_GA_ID for Google Analytics
// - NEXT_PUBLIC_POSTHOG_KEY + NEXT_PUBLIC_POSTHOG_HOST for PostHog

export default function Analytics() {
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_URL || 'https://plausible.io';

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

  return (
    <>
      {/* Umami Analytics - Self-hosted, privacy-focused */}
      {umamiWebsiteId && umamiUrl && (
        <Script
          src={`${umamiUrl}/script.js`}
          data-website-id={umamiWebsiteId}
          strategy="afterInteractive"
        />
      )}

      {/* Plausible Analytics - Privacy-focused */}
      {plausibleDomain && (
        <Script
          src={`${plausibleUrl}/js/script.js`}
          data-domain={plausibleDomain}
          strategy="afterInteractive"
        />
      )}

      {/* Google Analytics */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* PostHog Analytics */}
      {posthogKey && (
        <Script id="posthog-analytics" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('${posthogKey}', {
              api_host: '${posthogHost}',
              loaded: (posthog) => {
                if (process.env.NODE_ENV === 'development') posthog.debug();
              }
            });
          `}
        </Script>
      )}
    </>
  );
}

// Helper function to track events across all configured analytics platforms
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  // Umami
  if (typeof window !== 'undefined' && (window as Window & { umami?: { track: (name: string, data?: Record<string, unknown>) => void } }).umami) {
    (window as Window & { umami?: { track: (name: string, data?: Record<string, unknown>) => void } }).umami?.track(eventName, properties);
  }

  // Plausible
  if (typeof window !== 'undefined' && (window as Window & { plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void }).plausible) {
    (window as Window & { plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void }).plausible?.(eventName, { props: properties });
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', eventName, properties);
  }

  // PostHog
  if (typeof window !== 'undefined' && (window as Window & { posthog?: { capture: (name: string, properties?: Record<string, unknown>) => void } }).posthog) {
    (window as Window & { posthog?: { capture: (name: string, properties?: Record<string, unknown>) => void } }).posthog?.capture(eventName, properties);
  }
}
