import Script from "next/script";
import { SITE } from "@/lib/config";

/** Pixels client-side. CAPI/Events API server-side se agregan en /lib/tracking cuando haya tokens. */
export function Pixels() {
  return (
    <>
      {SITE.metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${SITE.metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
      {SITE.tiktokPixelId && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${SITE.tiktokPixelId}');
            ttq.page();
          `}
        </Script>
      )}
    </>
  );
}

/** Helpers cliente-side para disparar eventos custom desde componentes */
export function trackLead(value: number, currency = "GTQ") {
  if (typeof window === "undefined") return;
  // @ts-expect-error fbq inyectado por el script
  if (window.fbq) window.fbq("track", "Lead", { value, currency });
  // @ts-expect-error ttq inyectado por el script
  if (window.ttq) window.ttq.track("submit_form", { value, currency });
}

export function trackInitiateCheckout() {
  if (typeof window === "undefined") return;
  // @ts-expect-error
  if (window.fbq) window.fbq("track", "InitiateCheckout");
  // @ts-expect-error
  if (window.ttq) window.ttq.track("click_button", { description: "checkout" });
}
