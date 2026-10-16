/*
  Keeps an agent's link (?agent=rey, ?agent=job, ...) attached as the visitor
  moves around the site, so a "Talk to an Agent" request always routes to the
  agent whose link they came in on.

  Before this, internal links (Home, Browse Plans, Talk to an Agent, etc.)
  dropped the ?agent= part and the site relied only on sessionStorage to
  remember it. That memory is easily lost (Facebook/Instagram in-app browser
  hand-offs, new tabs, privacy modes), and the lead then fell back to the
  default info@ form. Now the agent key is carried in the URL of every
  internal link as well.
*/
(function () {
  function currentAgent() {
    var fromUrl = '';
    new URLSearchParams(window.location.search).forEach(function (v, k) {
      if (!fromUrl && k.trim().toLowerCase() === 'agent') fromUrl = (v || '').toLowerCase().replace(/[^a-z]/g, '');
    });
    try {
      if (fromUrl) {
        sessionStorage.setItem('ascendAgent', fromUrl);
        return fromUrl;
      }
      return sessionStorage.getItem('ascendAgent') || '';
    } catch (e) {
      return fromUrl;
    }
  }

  function withAgent(href, agent) {
    if (!href || !agent) return href;
    var url;
    try { url = new URL(href, window.location.href); } catch (e) { return href; }
    if (url.origin !== window.location.origin) return href; // external link
    if (!/(\.html|\/)$/i.test(url.pathname)) return href;    // PDFs, images, etc.
    var hasAgent = false;
    url.searchParams.forEach(function (v, k) { if (k.trim().toLowerCase() === 'agent') hasAgent = true; });
    if (!hasAgent) url.searchParams.set('agent', agent);
    return url.pathname.replace(/^\//, '') + url.search + url.hash;
  }

  var agent = currentAgent();
  if (!agent) return;

  function tagLinks(root) {
    (root || document).querySelectorAll('a[href]').forEach(function (a) {
      var tagged = withAgent(a.getAttribute('href'), agent);
      if (tagged !== a.getAttribute('href')) a.setAttribute('href', tagged);
    });
  }

  // Tag links already on the page...
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { tagLinks(); });
  } else {
    tagLinks();
  }
  // ...and any added later (plan cards, the plan details popup), right before
  // they're followed.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var tagged = withAgent(a.getAttribute('href'), agent);
    if (tagged !== a.getAttribute('href')) a.setAttribute('href', tagged);
  }, true);
})();
