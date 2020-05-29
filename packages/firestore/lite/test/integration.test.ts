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

import { expect } from 'chai';

import { initializeApp } from '@firebase/app-exp';
import {
  Firestore,
  getFirestore,
  initializeFirestore
} from '../src/api/database';

describe('Firestore', () => {
  it('can provide setting', () => {
    const app = initializeApp(
      { apiKey: 'fake-api-key', projectId: 'test-project' },
      'test-app-initializeFirestore'
    );
    const fs1 = initializeFirestore(app, { host: 'localhost', ssl: false });
    expect(fs1).to.be.an.instanceOf(Firestore);
  });

  it('returns same instance', () => {
    const app = initializeApp(
      { apiKey: 'fake-api-key', projectId: 'test-project' },
      'test-app-getFirestore'
    );
    const fs1 = getFirestore(app);
    const fs2 = getFirestore(app);
    expect(fs1 === fs2).to.be.true;
  });

  it('cannot call initializeFirestore() twice', () => {
    const app = initializeApp(
      { apiKey: 'fake-api-key', projectId: 'test-project' },
      'test-app-initializeFirestore-twice'
    );
    initializeFirestore(app, { host: 'localhost', ssl: false });
    expect(() => {
      initializeFirestore(app, { host: 'localhost', ssl: false });
    }).to.throw(
      'Firestore has already been started and its settings can no longer be changed.'
    );
  });
});
