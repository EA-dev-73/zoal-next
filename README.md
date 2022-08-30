## Lancer les webhooks stripe en local

`stripe listen --forward-to localhost:3000/api/webhook`

## Todo list

- [ ] les commandes ne sont pas enregistrées en PROD
- [ ] admin => bug suppresion d'une image
- [ ] brancher react-query + cache partout
- [ ] pouvoir update les images d'un product type sans editer le reste du product type
- [ ] fix suppression des images du bucket quand un productType est supprimé
- [ ] mise a jour de laffichage des images apres suppresion d'une image
- [ ] email stripe en francais
- [ ] style
- [ ] ameliorer page post commande (success, cancel)
- [ ] améliorer le référencement naturel
- [ ] utiliser une lib pour meilleure gestion des images coté admin (ex: cliquer pour agrandir)
- [ ] sécuriser stripe (var d'env server sur vercel OK ??) + supabase (RLS UPDATE/INSERT products, validatedOrder)
- [ ] setter les var d'envs de prod sur vercel (supabase, stripe, stripe webhooks)
