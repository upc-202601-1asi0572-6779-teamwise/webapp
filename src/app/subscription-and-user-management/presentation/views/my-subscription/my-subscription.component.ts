import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubscriptionAndUserManagementStore } from '../../../application/subscription-and-user-management.store';

@Component({
  selector: 'app-my-subscription',
  imports: [DatePipe, RouterLink],
  templateUrl: './my-subscription.component.html',
})
export class MySubscriptionComponent implements OnInit {
  private readonly store = inject(SubscriptionAndUserManagementStore);

  readonly subscription = this.store.subscription;
  readonly loading = this.store.subscriptionLoading;
  readonly error = this.store.subscriptionError;
  readonly actionLoading = this.store.actionLoading;
  readonly actionError = this.store.actionError;
  readonly actionSuccess = this.store.actionSuccess;
  readonly isGrower = this.store.isGrower;

  ngOnInit(): void {
    this.store.loadSubscription();
  }

  renew(): void {
    this.store.renew();
  }

  cancel(): void {
    this.store.cancel();
  }
}
