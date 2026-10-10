# Onchain Truth

Public landing page and portfolio for onchaintruth.xyz. Buildless HTML, CSS, and JavaScript. Open index.html locally or serve this directory using `python -m http.server 8080`.

The homepage links to the existing HCASH and MOAT applications. The lead comparison combines the supplied historical BTC entry with a public spot quote and an assumed alt loss. Other presets are hypothetical scenarios. No private indexer, RPC calls, API credentials, backend code, or wallet data are included. The only browser request is the public, unauthenticated Coinbase BTC/USD spot price; this is not a proprietary data pipeline. The calculator uses a standard public relative-return formula. Anything delivered to a browser is public; keep proprietary queries and calculation pipelines on a private server. Future homepage live data should come from an intentionally public, sanitized summary endpoint; keep credentials and upstream calls server-side and display freshness and unavailable states.



## Publish to GitHub Pages

1. Authenticate GitHub CLI with `gh auth login`.
2. Create a public repository containing only this directory, then push main. Do not publish the parent workspace or the existing dashboard backends.
3. In repository Settings → Pages, select Deploy from a branch, then main and / (root). This buildless site needs no Actions workflow or dotfiles.
4. Verify the published github.io URL before updating DNS.
5. Verify domain ownership in GitHub Pages, then set the custom domain to `onchaintruth.xyz` in repository Pages settings. Use the exact DNS records in the current GitHub Pages documentation: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site . Replace only the apex records that conflict with the chosen host. Preserve the hcash and moat subdomain records, MX, and unrelated TXT records.
6. Enable HTTPS once the certificate is ready. Add www only if desired and configure its redirect.

No DNS changes have been made by preparing these files. No CNAME is staged until the target repository and hosting configuration are confirmed.

Contact links were derived from public HCASH metadata (@willisdeving) and the existing MOAT repository remote (addicted2crypto). Confirm before publishing if these identities have changed.

## Repository preferences

No co-author trailers in commits. Publish only the visible project files, with no dotfiles or hidden configuration folders. The local .git directory stores Git history and is never uploaded as site content. DNS is managed through Namecheap; preserve the HCASH and MOAT subdomain records when connecting the apex domain.

The lead example uses $10,000 capital, BTC entry $44,164.93 from the supplied CoinGecko chart at Jan 5, 2024, 4 PM PST, and an assumed alt loss of 99%. BTC spot refreshes on load and on request through Coinbase. If refresh fails, the timestamped saved CoinGecko quote of $82,700 from Oct 9, 2026, 11:16 PM PDT is retained with a visible failure status. Editing the calculator or choosing another preset creates a custom scenario. The alt is hypothetical; no historical alt-price series or universal outperformance claim is implied.
