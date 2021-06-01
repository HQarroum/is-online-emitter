/**
 * Proxy variables.
 */
const GLOBAL_AGENT_HTTP_PROXY = process.env.HTTP_PROXY || process.env.http_proxy;
const GLOBAL_AGENT_HTTPS_PROXY = process.env.HTTPS_PROXY || process.env.https_proxy;
const GLOBAL_AGENT_NO_PROXY = process.env.NO_PROXY || process.env.no_proxy;

if (typeof GLOBAL_AGENT_HTTP_PROXY !== 'undefined') {
  process.env.GLOBAL_AGENT_HTTP_PROXY = GLOBAL_AGENT_HTTP_PROXY;
}

if (typeof GLOBAL_AGENT_HTTPS_PROXY !== 'undefined') {
  process.env.GLOBAL_AGENT_HTTPS_PROXY = GLOBAL_AGENT_HTTPS_PROXY;
}

if (typeof GLOBAL_AGENT_NO_PROXY !== 'undefined') {
  process.env.GLOBAL_AGENT_NO_PROXY = GLOBAL_AGENT_NO_PROXY;
}
