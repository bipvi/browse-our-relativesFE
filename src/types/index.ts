// ─── Utente ────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  avatar: string;
  ruolo: "USER" | "ADMIN";
  favourites: Favourite[];
}

export interface AuthResponse {
  accessToken: string;
}

export interface UserData {
  id: string
  username: string
  avatar: string
  ruolo: string
  favourites: Favourite[]
}

export interface UserStore extends UserData {
  token: string
  login: (username: string, password: string) => Promise<void>
  signUp: (username: string, password: string) => Promise<void>
  fetchMe: (token: string) => Promise<void>
  addFavourite: (id: string) => Promise<void>
  removeFavourite: (id: string) => Promise<void>
  fetchFavourites: () => Promise<void>
  setTokenFromStorage: (token: string) => void
  logout: () => void
}

// ─── Preferiti ─────────────────────────────────────────────────────────────

export interface Favourite {
  id: string;
  name: string;
  tipo: TaxonType;
}

// ─── Tassonomia ────────────────────────────────────────────────────────────

export type TaxonType =
  | "Regno"
  | "Phylum"
  | "Classe"
  | "Ordine"
  | "Famiglia"
  | "Genere"
  | "Specie";

export interface TaxonBase {
  id: string;
  name: string;
  tipo: TaxonType;
  img?: string;
  description?: string;
}

export interface Phylum extends TaxonBase {
  tipo: "Phylum";
  regno: TaxonBase;
}

export interface Classe extends TaxonBase {
  tipo: "Classe";
  phylum: Phylum;
}

export interface Ordine extends TaxonBase {
  tipo: "Ordine";
  classe: Classe;
}

export interface Famiglia extends TaxonBase {
  tipo: "Famiglia";
  ordine: Ordine;
}

export interface Genere extends TaxonBase {
  tipo: "Genere";
  famiglia: Famiglia;
}

export interface Specie extends TaxonBase {
  tipo: "Specie";
  genere: Genere;
}

export type Taxon = TaxonBase | Phylum | Classe | Ordine | Famiglia | Genere | Specie;

// ─── Item (usato nelle fetch /item/:id) ────────────────────────────────────

export interface Item {
  id: string;
  tipo: TaxonType;
}

// ─── Commenti ──────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  text: string;
  author: Pick<User, "id" | "username" | "avatar">;
  createdAt: string;
}
