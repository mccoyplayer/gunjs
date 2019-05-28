/**
 * @license
 * Copyright 2019 Google Inc.
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

import { FirebaseError } from '@firebase/util';
import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';
import { CreateInstallationResponse } from '../interfaces/api-response';
import { AppConfig } from '../interfaces/app-config';
import {
  InProgressInstallationEntry,
  RequestStatus
} from '../interfaces/installation-entry';
import { compareHeaders } from '../testing/compare-headers';
import { getFakeAppConfig } from '../testing/get-fake-app';
import '../testing/setup';
import {
  INSTALLATIONS_API_URL,
  INTERNAL_AUTH_VERSION,
  PACKAGE_VERSION
} from '../util/constants';
import { createInstallation } from './create-installation';

const FID = 'defenders-of-the-faith';

describe('createInstallation', () => {
  let appConfig: AppConfig;
  let fetchSpy: SinonStub<[RequestInfo, RequestInit?], Promise<Response>>;
  let inProgressInstallationEntry: InProgressInstallationEntry;

  beforeEach(() => {
    appConfig = getFakeAppConfig();

    inProgressInstallationEntry = {
      fid: FID,
      registrationStatus: RequestStatus.IN_PROGRESS,
      registrationTime: Date.now()
    };
  });

  describe('successful request', () => {
    beforeEach(() => {
      const response: CreateInstallationResponse = {
        refreshToken: 'refreshToken',
        authToken: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          expiresIn: '604800s'
        }
      };

      fetchSpy = stub(self, 'fetch').resolves(
        new Response(JSON.stringify(response))
      );
    });

    it('registers a pending InstallationEntry', async () => {
      const registeredInstallationEntry = await createInstallation(
        appConfig,
        inProgressInstallationEntry
      );
      expect(registeredInstallationEntry.registrationStatus).to.equal(
        RequestStatus.COMPLETED
      );
    });

    it('calls the createInstallation server API with correct parameters', async () => {
      const expectedHeaders = new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-goog-api-key': 'apiKey'
      });
      const expectedBody = {
        fid: FID,
        authVersion: INTERNAL_AUTH_VERSION,
        appId: appConfig.appId,
        sdkVersion: PACKAGE_VERSION
      };
      const expectedRequest: RequestInit = {
        method: 'POST',
        headers: expectedHeaders,
        body: JSON.stringify(expectedBody)
      };
      const expectedEndpoint = `${INSTALLATIONS_API_URL}/projects/projectId/installations`;

      await createInstallation(appConfig, inProgressInstallationEntry);
      expect(fetchSpy).to.be.calledOnceWith(expectedEndpoint, expectedRequest);
      const actualHeaders = fetchSpy.lastCall.lastArg.headers;
      compareHeaders(expectedHeaders, actualHeaders);
    });
  });

  describe('failed request', () => {
    beforeEach(() => {
      const response = {
        error: {
          code: 409,
          message: 'Requested entity already exists',
          status: 'ALREADY_EXISTS'
        }
      };

      fetchSpy = stub(self, 'fetch').resolves(
        new Response(JSON.stringify(response), { status: 409 })
      );
    });

    it('throws a FirebaseError with the error information from the server', async () => {
      await expect(
        createInstallation(appConfig, inProgressInstallationEntry)
      ).to.be.rejectedWith(FirebaseError);
    });
  });
});
