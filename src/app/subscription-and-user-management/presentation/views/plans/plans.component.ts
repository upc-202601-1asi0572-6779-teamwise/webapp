import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SubscriptionAndUserManagementStore } from '../../../application/subscription-and-user-management.store';

@Component({
  selector: 'app-plans',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './plans.component.html',
})
export class PlansComponent implements OnInit {
  private readonly store = inject(SubscriptionAndUserManagementStore);
  private readonly router = inject(Router);

  readonly plans = this.store.plans;
  readonly currentSubscription = this.store.currentSubscription;
  readonly loading = this.store.plansLoading;
  readonly error = this.store.plansError;
  readonly subscribing = this.store.subscribing;
  readonly upgrading = this.store.upgrading;
  readonly isAgronomist = this.store.isAgronomist;
  readonly currentPlanId = this.store.currentPlanId;

  ngOnInit(): void {
    this.store.loadPlans();
    this.store.loadCurrentSubscription();
  }

  subscribe(planId: string): void {
    const method = prompt('Metodo de pago (visa, mastercard, etc.):', 'visa_ending_0000');
    if (!method) return;

    this.store.subscribe(planId, method).subscribe({
      next: () => this.router.navigate(['/subscription/me']),
      error: () => {
        // Error already set by the store
      },
    });
  }

  upgrade(planId: string): void {
    if (planId === this.currentPlanId()) return;

    this.store.upgrade(planId).subscribe({
      next: () => this.router.navigate(['/subscription/me']),
      error: () => {
        // Error already set by the store
      },
    });
  }
}
