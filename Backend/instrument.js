// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://5d77cce1b262ab75011fa1ce92206d7e@o4511510956343296.ingest.us.sentry.io/4511511014604800",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true, 
  sendDefaultPii: true,
}); 