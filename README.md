## Lancer les webhooks stripe en local

`stripe listen --forward-to localhost:3000/api/webhook`

## Todo list

- [ ] admin => bug suppresion d'une image
- [ ] fix suppression des images du bucket quand un productType est supprimé
- [ ] style
- [ ] améliorer le référencement naturel
- [ ] sécuriser stripe (var d'env server sur vercel OK ??) + supabase (RLS UPDATE/INSERT products, validatedOrder)
- [ ] setter les var d'envs de prod sur vercel (supabase, stripe, stripe webhooks)
