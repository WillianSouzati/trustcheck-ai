import { LISTING_CATEGORIES, ListingCategory } from '../types/analysis';

export const TITLE_MIN_LENGTH = 5;
export const TITLE_MAX_LENGTH = 120;
export const DESCRIPTION_MIN_LENGTH = 20;
export const DESCRIPTION_MAX_LENGTH = 2000;
export const PRICE_MIN_VALUE = 1;
export const PRICE_MAX_VALUE = 50_000_000;

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateTimeBR(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatShortDateBR(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function parsePriceInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Remove currency symbol and spaces
  let cleaned = trimmed.replace(/R\$\s?/gi, '').replace(/\s/g, '');

  // Handle Brazilian formatting (e.g., "1.250,50" -> "1250.50") vs dot decimal ("1250.50")
  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // If multiple dots like "1.250.000", strip thousand separators
    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) {
      cleaned = cleaned.replace(/\./g, '');
    } else if (dotCount === 1) {
      const parts = cleaned.split('.');
      // Heuristic: if 3 digits after dot (e.g. "2.500"), treat as thousands separator
      if (parts[1] && parts[1].length === 3) {
        cleaned = cleaned.replace('.', '');
      }
    }
  }

  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) {
    return null;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export interface ListingFormErrors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
}

export function validateListingForm(fields: {
  title: string;
  description: string;
  priceRaw: string;
  category: string;
}): { isValid: boolean; errors: ListingFormErrors; parsedPrice: number | null } {
  const errors: ListingFormErrors = {};
  const title = fields.title.trim();
  const description = fields.description.trim();

  if (!title) {
    errors.title = 'Informe o título do anúncio.';
  } else if (title.length < TITLE_MIN_LENGTH) {
    errors.title = `O título deve ter pelo menos ${TITLE_MIN_LENGTH} caracteres.`;
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `O título não pode ultrapassar ${TITLE_MAX_LENGTH} caracteres.`;
  }

  if (!description) {
    errors.description = 'Informe a descrição do anúncio.';
  } else if (description.length < DESCRIPTION_MIN_LENGTH) {
    errors.description = `A descrição deve ter pelo menos ${DESCRIPTION_MIN_LENGTH} caracteres para permitir uma análise adequada.`;
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `A descrição não pode ultrapassar ${DESCRIPTION_MAX_LENGTH} caracteres.`;
  }

  const parsedPrice = parsePriceInput(fields.priceRaw);
  if (!fields.priceRaw.trim()) {
    errors.price = 'Informe o preço anunciado.';
  } else if (parsedPrice === null) {
    errors.price = 'Digite um valor numérico válido em reais (ex.: 2.450,00).';
  } else if (parsedPrice < PRICE_MIN_VALUE) {
    errors.price = `O preço deve ser de pelo menos ${formatCurrencyBRL(PRICE_MIN_VALUE)}.`;
  } else if (parsedPrice > PRICE_MAX_VALUE) {
    errors.price = `O preço informado excede o limite máximo permitido (${formatCurrencyBRL(PRICE_MAX_VALUE)}).`;
  }

  if (!LISTING_CATEGORIES.includes(fields.category as ListingCategory)) {
    errors.category = 'Selecione uma categoria válida.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    parsedPrice,
  };
}
