# Creación de Edge function "generate-qr"

- Ir a supabase "Edge Functions" y crear una nueva edge function. Llamarla `generate-qr` y pegar el codigo de `index.ts`.
- En el tab de "Settings" de la edge function: deshabilitar `Verify JWT with legacy secret` y guardar.
- Ir a "Project Settings" > seccion "API Keys" > tab "Publishable and secret API keys" y ahi "Create new secret API key". Nombrar la nueva key: `generate_qr_edge_to_db`.