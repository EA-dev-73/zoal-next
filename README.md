## Lancer les webhooks stripe en local

`stripe listen --forward-to localhost:3000/api/webhook`

## Todo list

- [ ] admin => bug suppresion d'une image
- [ ] les commandes ne sont pas enregistrees ?
- [ ] les stocks ne sont pas deduis apres commande
- [ ] brancher react-query + cache partout
- [ ] pouvoir update les images d'un product type sans editer le reste du product type
- [ ] fix suppression des images du bucket quand un productType est supprimé
- [ ] mise a jour de laffichage des images apres suppresion d'une image
- [ ] email stripe en francais
- [ ] style
- [ ] ameliorer page post commande (success, cancel)
- [ ] améliorer le référencement naturel
- [ ] utiliser une lib pour meilleure gestion des images coté admin (ex: cliquer pour agrandir)
- [ ] setter les var d'envs de prod sur vercel (supabase, stripe, stripe webhooks)
