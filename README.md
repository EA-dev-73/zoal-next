## Lancer les webhooks stripe en local

`stripe listen --forward-to localhost:3000/api/webhook`

## Todo list

- [ ] accueil : l'image est coupée selon la taille decran (ex sur mon telephone)
- [ ] chargement des images ralentissent les pages shop | shop?:category | article/:id
- [ ] update images => interface non refresh (demande un f5)
- [ ] fix suppression des images du bucket quand un productType est supprimé
- [ ] pouvoir fermer les toasts en cliquant dessus
- [ ] nom de domaine
- [ ] mettre a jour l'accueil (texte + lien insta)
- [ ] style
- [ ] améliorer le référencement naturel
- [ ] sécuriser stripe (var d'env server sur vercel OK ??) + supabase (RLS UPDATE/INSERT products, validatedOrder)
- [ ] setter les var d'envs de prod sur vercel (supabase, stripe, stripe webhooks)
