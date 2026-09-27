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

- Keep public catalog data in Lovable Cloud and member records behind RLS; this prevents cross-account data access.
- Store admin privileges only in user_roles and use database-enforced RPCs for circulation; browser role checks alone are not security.
- Use TanStack file routes rather than React Router because the project is a TanStack Start application.
