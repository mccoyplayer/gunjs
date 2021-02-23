/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IdTokenResult,
  ProviderId,
  User,
  UserCredential,
  UserInfo
} from './public_types';
import { NextFn } from '@firebase/util';
import { APIUserInfo } from '../api/account_management/account';
import { FinalizeMfaResponse } from '../api/authentication/mfa';
import { PersistedBlob } from '../core/persistence';
import { StsTokenManager } from '../core/user/token_manager';
import { UserMetadata } from '../core/user/user_metadata';
import { AuthInternal } from './auth';
import { IdTokenResponse, TaggedWithTokenResponse } from './id_token';

export type MutableUserInfo = {
  -readonly [K in keyof UserInfo]: UserInfo[K];
};

export interface UserParameters {
  uid: string;
  auth: AuthInternal;
  stsTokenManager: StsTokenManager;

  displayName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean | null;
  emailVerified?: boolean | null;
  tenantId?: string | null;

  createdAt?: string | null;
  lastLoginAt?: string | null;
}

export interface UserInternal extends User {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;

  auth: AuthInternal;
  providerId: ProviderId.FIREBASE;
  refreshToken: string;
  emailVerified: boolean;
  tenantId: string | null;
  providerData: MutableUserInfo[];
  metadata: UserMetadata;

  stsTokenManager: StsTokenManager;
  _redirectEventId?: string;

  _updateTokensIfNecessary(
    response: IdTokenResponse | FinalizeMfaResponse,
    reload?: boolean
  ): Promise<void>;

  _assign(user: UserInternal): void;
  _clone(): UserInternal;
  _onReload: (cb: NextFn<APIUserInfo>) => void;
  _notifyReloadListener: NextFn<APIUserInfo>;
  _startProactiveRefresh: () => void;
  _stopProactiveRefresh: () => void;

  getIdToken(forceRefresh?: boolean): Promise<string>;
  getIdTokenResult(forceRefresh?: boolean): Promise<IdTokenResult>;
  reload(): Promise<void>;
  delete(): Promise<void>;
  toJSON(): PersistedBlob;
}

export interface UserCredentialInternal
  extends UserCredential,
    TaggedWithTokenResponse {
  user: UserInternal;
}
