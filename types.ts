// types.ts (CORREGIDO)

export enum PropertyType {
    VILLA = 'Villa',
    APARTMENT = 'Apartamento',
    PENTHOUSE = 'Penthouse',
    MANSION = 'Mansión',
    ESTATE = 'Finca',
    HOUSE = 'Casa',
    LAND = 'Terreno',
    // ----------------------------------------------------------------
    // LÍNEA AÑADIDA: El deployment fallaba porque este tipo no existía
    // ----------------------------------------------------------------
    COMMERCIAL = 'Comercial', 
    UNKNOWN = 'Desconocido'
}

export interface PrivateData {
    ownerName: string;
    ownerPhone: string;
    legalDescription: string;
    privateNotes: string;
}

export interface Property {
    id: string;
    title: string;
    subtitle?: string;
    location: string;
    price: number;
    currency: string;
    imageUrl: string;
    bedrooms: number;
    bathrooms: number;
    area: number; // in sq meters
    type: PropertyType;
    description: string;
    amenities?: string[];
    isPremium?: boolean;
    privateData?: PrivateData;
    isPublished: boolean;
}

export interface SearchFilters {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    propertyType?: PropertyType;
}

export interface HeroSearchState {
    location: string;
    bedrooms: string;
    priceRange: string;
}
