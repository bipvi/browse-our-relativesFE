# Browse Your Relatives — Frontend

Applicazione web per esplorare la tassonomia del regno animale in modo interattivo e visivo. Costruita con **Next.js 14**, **Tailwind CSS** e **shadcn/ui**.

---

## Repository collegati

| Ruolo | Repository |
|-------|-----------|
| **Frontend** (questo repo) | `git@github.com:bipvi/browse-our-relativesFE.git` |
| **Backend** | `git@github.com:bipvi/Browse-our-Parents.git` |

---

## Stack tecnologico

- **Framework**: Next.js 14 (App Router)
- **Stile**: Tailwind CSS v3 + glassmorphism design
- **Componenti UI**: shadcn/ui, Radix UI
- **Icone**: Lucide React, React Icons
- **State management**: Zustand
- **Linguaggio**: TypeScript

---

## Funzionalità principali

- **Curiosone** — navigazione gerarchica della tassonomia (regno → phylum → classe → ordine → famiglia → genere → specie)
- **Esplora** — pagina di dettaglio per ogni elemento tassonomico
- **Preferiti** — salvataggio degli elementi preferiti
- **Commenti** — sistema di commenti per ogni elemento
- **Autenticazione** — login e registrazione utente
- **Admin** — creazione e modifica di elementi tassonomici a qualsiasi livello

---

## Avvio in sviluppo

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

### Variabili d'ambiente

Crea un file `.env.local` nella root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Struttura del progetto

```
src/
├── app/                  # Route Next.js (App Router)
├── components/
│   ├── admin/            # Modali creazione/modifica elementi
│   ├── curiosone/        # Navigatore tassonomico
│   ├── detail/           # Modale di dettaglio + commenti
│   ├── esplora/          # Pagina esplora
│   ├── footer/
│   ├── hero/
│   ├── login/
│   ├── navbar/
│   └── preferiti/
├── store/                # Zustand store (auth, preferiti)
└── lib/                  # Utility
```
