# Onchain Truth

Public landing page and portfolio for onchaintruth.xyz. Buildless HTML, CSS, and JavaScript. Open index.html locally or serve this directory using `python -m http.server 8080`.

The homepage links to the existing HCASH and MOAT applications. Its chart and calculator are explicitly illustrative, not a live feed. No private indexer, RPC calls, API credentials, backend code, or wallet data are included. The calculator uses a standard public relative-return formula. Anything delivered to a browser is public; keep proprietary queries and calculation pipelines on a private server. Future homepage live data should come from an intentionally public, sanitized summary endpoint; keep credentials and upstream calls server-side and display freshness and unavailable states.

## Publish to GitHub Pages

1. Authenticate GitHub CLI with `gh auth login`.
2. Create a public repository containing only this directory, then push main. Do not publish the parent workspace or the existing dashboard backends.
3. In repository Settings → Pages, select GitHub Actions as the deployment source. Run the included Deploy landing page workflow if needed.
4. Verify the published github.io URL before updating DNS.
5. Verify domain ownership in GitHub Pages, then set the custom domain to `onchaintruth.xyz` in repository Pages settings. Use the exact DNS records in the current GitHub Pages documentation: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site . Replace only the apex records that conflict with the chosen host. Preserve the hcash and moat subdomain records, MX, and unrelated TXT records.
6. Enable HTTPS once the certificate is ready. Add www only if desired and configure its redirect.

No DNS changes have been made by preparing these files. No CNAME is staged until the target repository and hosting configuration are confirmed.

Contact links were derived from public HCASH metadata (@willisdeving) and the existing MOAT repository remote (addicted2crypto). Confirm before publishing if these identities have changed.
