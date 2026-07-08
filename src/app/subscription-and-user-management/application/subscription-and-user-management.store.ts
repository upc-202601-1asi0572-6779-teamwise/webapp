import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import { User } from '../../shared/domain/user.model';
import { AuthService } from '../../shared/infrastructure/auth.service';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { UserService } from '../infrastructure/user-api.service';
import { SubscriptionService } from '../infrastructure/subscription-api.service';

/**
 * Central state store for the Subscription & User Management bounded context.
 *
 * Exposes readonly signals and orchestration methods so presentation views
 * consume pre-computed state without duplicating fetch/update logic.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionAndUserManagementStore {
  private readonly userService = inject(UserService);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly authService = inject(AuthService);

  // ── Profile state ────────────────────────────────────────────────
  readonly user = signal<User | null>(null);
  readonly profileLoading = signal(false);
  readonly profileSaving = signal(false);
  readonly profileError = signal('');

  // ── Subscription state ───────────────────────────────────────────
  readonly subscription = signal<Subscription | null>(null);
  readonly subscriptionLoading = signal(false);
  readonly subscriptionError = signal('');
  readonly actionLoading = signal('');
  readonly actionError = signal('');
  readonly actionSuccess = signal('');

  // ── Plans state ───────────────────────────────────────────────────
  readonly plans = signal<SubscriptionPlan[]>([]);
  readonly plansLoading = signal(false);
  readonly plansError = signal('');
  readonly subscribing = signal('');
  readonly upgrading = signal('');
  readonly currentSubscription = signal<Subscription | null>(null);

  // ── Computed ──────────────────────────────────────────────────────
  readonly currentPlanId = computed(() => this.subscription()?.planId ?? this.currentSubscription()?.planId ?? '');
  readonly isGrower = computed(() => {
    const sub = this.subscription() ?? this.currentSubscription();
    return sub?.segment !== 'agronomist';
  });
  readonly isAgronomist = computed(() => this.authService.currentUser?.role === 'agronomist');

  // ── Profile methods ───────────────────────────────────────────────
  loadProfile(): void {
    this.profileLoading.set(true);
    this.profileError.set('');
    this.userService
      .getProfile()
      .pipe(finalize(() => this.profileLoading.set(false)))
      .subscribe({
        next: (u) => this.user.set(u),
        error: () => this.profileError.set('Error al cargar el perfil.'),
      });
  }

  updateProfile(data: Partial<Pick<User, 'fullName' | 'phone' | 'region' | 'city' | 'avatarUrl'>>): Observable<User> {
    this.profileSaving.set(true);
    this.profileError.set('');
    return this.userService
      .updateProfile(data)
      .pipe(
        tap({
          next: (u) => this.user.set(u),
          error: () => this.profileError.set('Error al guardar los cambios.'),
        }),
        finalize(() => this.profileSaving.set(false)),
      );
  }

  // ── Subscription methods ──────────────────────────────────────────
  loadSubscription(): void {
    this.subscriptionLoading.set(true);
    this.subscriptionError.set('');
    this.subscriptionService
      .getMySubscription()
      .pipe(finalize(() => this.subscriptionLoading.set(false)))
      .subscribe({
        next: (sub) => this.subscription.set(sub),
        error: () => this.subscriptionError.set('No tienes una suscripcion activa.'),
      });
  }

  renew(): void {
    this.actionLoading.set('renew');
    this.actionError.set('');
    this.actionSuccess.set('');
    this.subscriptionService
      .renew()
      .pipe(finalize(() => this.actionLoading.set('')))
      .subscribe({
        next: (res) => {
          this.actionSuccess.set(res.message);
          this.loadSubscription();
        },
        error: () => this.actionError.set('Error al renovar la suscripcion.'),
      });
  }

  cancel(): void {
    this.actionLoading.set('cancel');
    this.actionError.set('');
    this.actionSuccess.set('');
    this.subscriptionService
      .cancel()
      .pipe(finalize(() => this.actionLoading.set('')))
      .subscribe({
        next: (res) => {
          this.actionSuccess.set(res.message);
          this.loadSubscription();
        },
        error: () => this.actionError.set('Error al cancelar la renovacion.'),
      });
  }

  // ── Plans methods ─────────────────────────────────────────────────
  loadPlans(): void {
    this.plansLoading.set(true);
    this.plansError.set('');
    this.subscriptionService
      .getPlans()
      .pipe(finalize(() => this.plansLoading.set(false)))
      .subscribe({
        next: (p) => this.plans.set(p),
        error: () => this.plansError.set('Error al cargar los planes.'),
      });
  }

  loadCurrentSubscription(): void {
    this.subscriptionService.getMySubscription().subscribe({
      next: (sub) => this.currentSubscription.set(sub),
    });
  }

  subscribe(planId: string, paymentMethod: string): Observable<Subscription> {
    this.subscribing.set(planId);
    this.plansError.set('');
    return this.subscriptionService
      .subscribe(planId, paymentMethod)
      .pipe(
        tap({ error: () => this.plansError.set('No se pudo completar la suscripcion.') }),
        finalize(() => this.subscribing.set('')),
      );
  }

  upgrade(planId: string): Observable<Subscription> {
    this.upgrading.set(planId);
    this.plansError.set('');
    return this.subscriptionService
      .upgrade(planId)
      .pipe(
        tap({ error: () => this.plansError.set('No se pudo cambiar de plan.') }),
        finalize(() => this.upgrading.set('')),
      );
  }
}
