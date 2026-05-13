/**
 * GamificationService
 * ──────────────────────────────────────────────────────────────────────────────
 * Responsabilidades:
 *  1. Al completar una evaluación, otorgar TROFEOS y COLECCIONABLES correspondientes.
 *  2. Propagar esos cambios al backend (MongoDB) de forma no bloqueante.
 *  3. Exponer BehaviorSubjects reactivos para que Trofeos y Coleccionables
 *     se actualicen EN TIEMPO REAL sin necesidad de recargar la página.
 *  4. NO tocar datos de usuarios existentes: todo es upsert idempotente.
 * ──────────────────────────────────────────────────────────────────────────────
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// ── Tipos ──────────────────────────────────────────────────────────────────────
export interface Trophy {
  trophyId:    string;
  name:        string;
  description: string;
  icon:        string;
  category:    string;
  earnedAt?:   string;
}

export interface Collectible {
  collectibleId: string;
  name:          string;
  description:   string;
  icon:          string;
  rarity:        'comun' | 'raro' | 'epico' | 'legendario';
  earnedAt?:     string;
}

// ── Catálogo de trofeos ─────────────────────────────────────────────────────────
const TROPHY_CATALOG: Record<string, Omit<Trophy, 'earnedAt'>> = {
  primera_mision:  { trophyId:'primera_mision',  name:'Primera Misión',      icon:'🏅', category:'progreso',   description:'Completaste tu primera misión en RaInClass.' },
  mitad_camino:    { trophyId:'mitad_camino',     name:'A Mitad del Camino',  icon:'🌟', category:'progreso',   description:'Completaste 4 misiones.' },
  maestro_rainclass:{ trophyId:'maestro_rainclass',name:'Maestro RaInClass', icon:'🏆', category:'maestria',   description:'¡Completaste todas las misiones!' },
  puntaje_perfecto:{ trophyId:'puntaje_perfecto', name:'Puntuación Perfecta', icon:'💯', category:'evaluacion', description:'Obtuviste 100% en una evaluación.' },
  aprobado_90:     { trophyId:'aprobado_90',      name:'Sobresaliente',       icon:'⭐', category:'evaluacion', description:'Obtuviste 90% o más en una evaluación.' },
  explorador_ar:   { trophyId:'explorador_ar',    name:'Explorador AR',       icon:'🔭', category:'exploracion',description:'Usaste el Visualizador de Modelos 3D.' },
  geoposicion:     { trophyId:'geoposicion',      name:'Maestro Geoespacial', icon:'📍', category:'avanzado',   description:'Completaste la misión de Geoposición.' },
  persistente:     { trophyId:'persistente',      name:'Persistente',         icon:'💪', category:'actitud',    description:'Repetiste una evaluación para mejorar tu puntaje.' },
};

// ── Catálogo de coleccionables ──────────────────────────────────────────────────
const COLLECTIBLE_CATALOG: Record<number, Omit<Collectible, 'earnedAt'>> = {
  1:  { collectibleId:'carta_intro',    name:'Placa de Bienvenida',    icon:'🎖️', rarity:'comun',      description:'Completaste la introducción a RaInClass.' },
  2:  { collectibleId:'carta_merge',    name:'Cubo Holográfico',       icon:'🧊', rarity:'comun',      description:'Objeto 3D holográfico del Merge Cube.' },
  3:  { collectibleId:'carta_quiver',   name:'Pincel Digital',         icon:'🖌️', rarity:'comun',      description:'Una pintura que cobra vida con QuiverVision.' },
  4:  { collectibleId:'carta_action',   name:'Mapa del Tesoro',        icon:'🗺️', rarity:'raro',       description:'Herramienta de navegación de Actionbound.' },
  5:  { collectibleId:'carta_meta',     name:'Visor VR',               icon:'🥽', rarity:'raro',       description:'Visor del Metaverso Meta desbloqueado.' },
  6:  { collectibleId:'carta_ra',       name:'Generador RA',           icon:'🔬', rarity:'epico',      description:'Generador QR especial con acabado dorado.' },
  7:  { collectibleId:'carta_geo',      name:'Ancla Geoespacial',      icon:'📍', rarity:'epico',      description:'Pin especial del módulo de Geoposición AR.' },
};

// ── Trofeo especial: coleccionista (todas las cartas) ──────────────────────────
const TROPHY_COLECCIONISTA: Omit<Trophy, 'earnedAt'> = {
  trophyId:'coleccionista', name:'Coleccionista Completo', icon:'🎁',
  category:'coleccion', description:'Desbloqueaste todos los coleccionables.'
};

// ─────────────────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class GamificationService {

  // Streams reactivos — los componentes se suscriben a estos
  private _trophies$     = new BehaviorSubject<Trophy[]>([]);
  private _collectibles$ = new BehaviorSubject<Collectible[]>([]);
  // Set de IDs ya otorgados (para no duplicar en la sesión)
  private _earnedTrophyIds     = new Set<string>();
  private _earnedCollectibleIds = new Set<string>();

  trophies$     = this._trophies$.asObservable();
  collectibles$ = this._collectibles$.asObservable();

  private get api() { return environment.apiUrl; }

  constructor(
    private http:        HttpClient,
    private authService: AuthService,
  ) {}

  /** Carga inicial desde el backend al iniciar sesión */
  loadAll(userId: string): void {
    // Trofeos
    this.http.get<any[]>(`${this.api}/trophies/user/${userId}`)
      .pipe(catchError(() => of([])))
      .subscribe(data => {
        const mapped = data.map(t => ({
          trophyId:    t.trophyId,
          name:        t.name,
          description: t.description,
          icon:        t.icon,
          category:    t.category,
          earnedAt:    t.earnedAt,
        } as Trophy));
        mapped.forEach(t => this._earnedTrophyIds.add(t.trophyId));
        this._trophies$.next(mapped);
      });

    // Coleccionables
    this.http.get<any[]>(`${this.api}/collectibles/user/${userId}`)
      .pipe(catchError(() => of([])))
      .subscribe(data => {
        const mapped = data.map(c => ({
          collectibleId: c.collectibleId,
          name:          c.name,
          description:   c.description,
          icon:          c.icon,
          rarity:        c.rarity,
          earnedAt:      c.earnedAt,
        } as Collectible));
        mapped.forEach(c => this._earnedCollectibleIds.add(c.collectibleId));
        this._collectibles$.next(mapped);
      });
  }

  /**
   * Punto de entrada principal.
   * Se llama desde lab-evaluacion.submitEvaluation() después de guardar el resultado.
   *
   * @param labId       id numérico de la misión evaluada (1-7)
   * @param percentage  porcentaje obtenido en la evaluación (0-100)
   * @param totalCompleted  cuántas misiones están ya completadas (incluida esta)
   */
  processEvaluationResult(labId: number, percentage: number, totalCompleted: number): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    // ── 1. Coleccionable por misión ──────────────────────────────
    const colDef = COLLECTIBLE_CATALOG[labId];
    if (colDef) this._grantCollectible(user, colDef);

    // ── 2. Trofeos según rendimiento en la evaluación ─────────────
    if (percentage === 100)  this._grantTrophy(user, TROPHY_CATALOG['puntaje_perfecto']);
    if (percentage >= 90)    this._grantTrophy(user, TROPHY_CATALOG['aprobado_90']);

    // ── 3. Trofeos por progreso ───────────────────────────────────
    if (totalCompleted >= 1) this._grantTrophy(user, TROPHY_CATALOG['primera_mision']);
    if (totalCompleted >= 4) this._grantTrophy(user, TROPHY_CATALOG['mitad_camino']);
    if (totalCompleted >= 7) this._grantTrophy(user, TROPHY_CATALOG['maestro_rainclass']);

    // ── 4. Trofeos por misión específica ──────────────────────────
    if (labId === 6) this._grantTrophy(user, TROPHY_CATALOG['explorador_ar']);
    if (labId === 7) this._grantTrophy(user, TROPHY_CATALOG['geoposicion']);

    // ── 5. Trofeo coleccionista si tiene todos los coleccionables ──
    const allCollectibleIds = Object.values(COLLECTIBLE_CATALOG).map(c => c.collectibleId);
    const hasAll = allCollectibleIds.every(id => this._earnedCollectibleIds.has(id));
    if (hasAll) this._grantTrophy(user, TROPHY_COLECCIONISTA);
  }

  /**
   * Llama desde lab-evaluacion al reintentar (segunda o más vez),
   * para otorgar el trofeo "Persistente".
   */
  processPersistence(attemptNumber: number): void {
    if (attemptNumber < 2) return;
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this._grantTrophy(user, TROPHY_CATALOG['persistente']);
  }

  // ── Helpers privados ──────────────────────────────────────────────────────────

  private _grantTrophy(user: any, def: Omit<Trophy, 'earnedAt'>): void {
    if (this._earnedTrophyIds.has(def.trophyId)) return; // ya otorgado en esta sesión

    const earned: Trophy = { ...def, earnedAt: new Date().toISOString() };

    // Actualizar stream local inmediatamente (UI reactiva)
    this._earnedTrophyIds.add(def.trophyId);
    this._trophies$.next([...this._trophies$.getValue(), earned]);

    // Persistir en backend (upsert — no afecta datos existentes)
    this.http.post(`${this.api}/trophies`, {
      userId:      user.userId,
      username:    user.displayName || user.username,
      trophyId:    def.trophyId,
      name:        def.name,
      description: def.description,
      icon:        def.icon,
      category:    def.category,
    }).pipe(catchError(() => of(null))).subscribe();
  }

  private _grantCollectible(user: any, def: Omit<Collectible, 'earnedAt'>): void {
    if (this._earnedCollectibleIds.has(def.collectibleId)) return;

    const earned: Collectible = { ...def, earnedAt: new Date().toISOString() };

    // Actualizar stream local inmediatamente
    this._earnedCollectibleIds.add(def.collectibleId);
    this._collectibles$.next([...this._collectibles$.getValue(), earned]);

    // Persistir en backend
    this.http.post(`${this.api}/collectibles`, {
      userId:        user.userId,
      username:      user.displayName || user.username,
      collectibleId: def.collectibleId,
      name:          def.name,
      description:   def.description,
      icon:          def.icon,
      rarity:        def.rarity,
    }).pipe(catchError(() => of(null))).subscribe();
  }

  // ── Getters de snapshot para componentes ────────────────────────────────────
  get earnedTrophies():     Trophy[]     { return this._trophies$.getValue(); }
  get earnedCollectibles(): Collectible[] { return this._collectibles$.getValue(); }

  hasTrophy(id: string): boolean     { return this._earnedTrophyIds.has(id); }
  hasCollectible(id: string): boolean { return this._earnedCollectibleIds.has(id); }
}
