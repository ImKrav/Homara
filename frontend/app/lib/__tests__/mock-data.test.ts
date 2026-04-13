import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  getStatusLabel,
  getStatusColor,
  categories,
  products,
  projects,
  orders
} from '../mock-data';

describe('mock-data utils', () => {
  describe('formatPrice', () => {
    // Caso de uso: Números comunes
    // Comprobamos que un entero positivo se exprese correctamente en formato de pesos colombianos.
    it('formatea números positivos correctamente a Pesos Colombianos', () => {
      const formatted = formatPrice(45900);
      // Elimina espacios de no salto (\u00A0) u otros, comúnmente introducidos por el API Intl
      const normalized = formatted.replace(/\s+/g, ' '); 
      expect(normalized).toMatch(/\$ 45\.900|\$45\.900/);
    });

    // Caso de uso: Valor cero
    // Verificamos que el formateador interactúe bien cuando el saldo/precio es exacto a 0
    // en vez de devolver un string vacío o comportamiento no previsto.
    it('formatea correctamente el valor cero', () => {
      const formatted = formatPrice(0);
      const normalized = formatted.replace(/\s+/g, ' ');
      expect(normalized).toMatch(/\$ 0|\$0/);
    });

    // Caso de uso: Valores negativos / saldos en contra
    // Aunque un precio de ecommerce rara vez es negativo, utilidades monetarias pueden usarse
    // para descuentos o deudas. Testeamos la correcta ubicación del signo menos.
    it('formatea números negativos', () => {
      const formatted = formatPrice(-1000);
      const normalized = formatted.replace(/\s+/g, ' ');
      expect(normalized).toMatch(/-\$ 1\.000|-\$1\.000|\$ -1\.000|\$-1\.000/);
    });

    // Caso extremo: Decimales forzados
    // Como preconfiguramos el NumberFormat a maximumFractionDigits: 0,
    // este test garantiza que no se muestren centavos y el número se redondee adecuadamente.
    it('redondea y omite decimales (según maximumFractionDigits: 0)', () => {
      // 1234.56 debería redondearse al entero más cercano (1235)
      const formatted = formatPrice(1234.56);
      const normalized = formatted.replace(/\s+/g, ' ');
      expect(normalized).toMatch(/\$ 1\.235|\$1\.235/);
    });

    // Caso de fallo/invalidez: NaN
    // Cuando el sistema recibe Not-a-Number por algún cálculo erróneo previo, 
    // debe comportarse devolviendo un string sin corromper la pantalla en React.
    it('maneja valores no numéricos a nivel runtime de forma segura', () => {
      const formatted = formatPrice(NaN);
      expect(typeof formatted).toBe('string');
      expect(formatted).not.toBe('');
    });
  });

  describe('getStatusLabel', () => {
    // Casos comunes: Valores definidos
    // El mapa interno tiene correspondencia 1:1, aseguramos que nos devuelva 
    // la etiqueta "humana" que espera mostrar la UI.
    it('retorna la etiqueta correcta para estados conocidos de proyectos/órdenes', () => {
      expect(getStatusLabel('en_progreso')).toBe('En progreso');
      expect(getStatusLabel('completado')).toBe('Completado');
      expect(getStatusLabel('procesando')).toBe('Procesando');
      expect(getStatusLabel('entregado')).toBe('Entregado');
    });

    // Casos excepcionales/falla: Input irreconocible
    // Si la base de datos o API arroja un "status" sin mapear predefinido, 
    // validamos que la función devuelva amablemente el mismo input para evitar strings del tipo "undefined".
    it('retorna el mismo input si el estado es desconocido o está mal formateado', () => {
      // @ts-ignore - forzamos un valor inválido evadiendo Type System para probar runtime
      expect(getStatusLabel('estado_ficticio')).toBe('estado_ficticio');
      // @ts-ignore
      expect(getStatusLabel('')).toBe('');
    });
  });

  describe('getStatusColor', () => {
    // Casos comunes: Renderizado de estilos 
    // Comprueba las strings de TailwindCSS que construyen el color visual
    // indicando la positividad/negatividad del estado.
    it('retorna las clases de Tailwind correspondientes a cada estado', () => {
      expect(getStatusColor('en_progreso')).toBe('bg-amber-500/20 text-amber-400');
      expect(getStatusColor('completado')).toBe('bg-emerald-500/20 text-emerald-400');
      expect(getStatusColor('cancelado')).toBe('bg-red-500/20 text-red-400');
    });

    // Caso fallback/seguridad: Estados sueltos o vacíos
    // Proveer un color Slate/Gris que previene que el Badge en UI sea transparente
    // cuando el valor propuesto está corrompido o es no standard.
    it('retorna las clases por defecto para un estado desconocido', () => {
      // @ts-ignore
      expect(getStatusColor('estado_random')).toBe('bg-slate-500/20 text-slate-400');
      // @ts-ignore
      expect(getStatusColor('')).toBe('bg-slate-500/20 text-slate-400');
    });
  });

  describe('estructura de Datos Mock (Integridad Básica)', () => {
    // Pruebas de sanidad estructural
    // Previene que se exporten arreglos nulos que podrían quebrar la app 
    // en funciones `.map` o parecidas.
    it('exporta arreglos poblados con datos iniciales', () => {
      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBeGreaterThan(0);
      
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBeGreaterThan(0);
      
      expect(projects).toBeInstanceOf(Array);
      expect(projects.length).toBeGreaterThan(0);
      
      expect(orders).toBeInstanceOf(Array);
      expect(orders.length).toBeGreaterThan(0);
    });

    // Comprobación de relacionalidad lógica
    // Cerciora que los 'productos' tengan consistencia con las 'categorías', 
    // para evitar un resultado fallido o 404 en el Frontend al filtrar catálogo.
    it('asegura que todos los productos referencien un categorySlug existente', () => {
      const categorySlugs = categories.map(c => c.slug);
      
      products.forEach(product => {
        expect(categorySlugs).toContain(product.categorySlug);
      });
    });
  });
});
