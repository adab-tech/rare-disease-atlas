<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the Constellation prototype's illustrative biomedical entities and relationships in a local typed data module; this makes demo claims auditable and avoids implying a live evidence feed.
- Render the knowledge atlas as an SVG driven by d3-force; this keeps pan, zoom, selection, and semantic interaction lightweight and inspectable.
- Keep clinical note extraction and ranked overlap local to the browser with an explicit, limited HPO vocabulary; this avoids sending sensitive descriptions to outside services and prevents diagnostic claims.
- Run Bright Data requests only in a server function and label official-feed or curated fallbacks separately; source limitations must remain visible to users.
