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
  _registerComponent,
  registerVersion,
  _getProvider,
  SDK_VERSION
  // eslint-disable-next-line import/no-extraneous-dependencies
} from '@firebase/app-exp';
import { FirebaseApp } from '@firebase/app-types-exp';

import { XhrIoPool } from '../src/implementation/xhriopool';
import {
  ref as refInternal,
  StorageService as StorageServiceInternal
} from '../src/service';
import {
  Component,
  ComponentType,
  ComponentContainer,
  Provider
} from '@firebase/component';

import { name, version } from '../package.json';

import {
  StorageReference,
  StorageService,
  UploadResult,
  ListOptions,
  ListResult,
  UploadTask,
  FirebaseStorageError,
  TaskEvent,
  TaskState,
  StorageObserver,
  SettableMetadata,
  UploadMetadata,
  FullMetadata
} from '@firebase/storage-types/exp';
import { Metadata as MetadataInternal } from '../src/metadata';
import {
  uploadBytes as uploadBytesInternal,
  uploadBytesResumable as uploadBytesResumableInternal,
  uploadString as uploadStringInternal,
  getMetadata as getMetadataInternal,
  updateMetadata as updateMetadataInternal,
  list as listInternal,
  listAll as listAllInternal,
  getDownloadURL as getDownloadURLInternal,
  deleteObject as deleteObjectInternal,
  Reference
} from '../src/reference';

/**
 * Public types.
 */
export {
  StorageReference,
  StorageService,
  UploadMetadata,
  SettableMetadata,
  FullMetadata,
  UploadResult,
  ListOptions,
  ListResult,
  UploadTask,
  FirebaseStorageError,
  TaskEvent,
  TaskState,
  StorageObserver
};

/**
 * Uploads data to this object's location.
 * The upload is not resumable.
 * @public
 * @param ref - StorageReference where data should be uploaded.
 * @param data - The data to upload.
 * @param metadata - Metadata for the data to upload.
 * @returns A Promise containing an UploadResult
 */
export function uploadBytes(
  ref: StorageReference,
  data: Blob | Uint8Array | ArrayBuffer,
  metadata?: UploadMetadata
): Promise<UploadResult> {
  return uploadBytesInternal(
    ref as Reference,
    data,
    metadata as MetadataInternal
  );
}

/**
 * Uploads a string to this object's location.
 * The upload is not resumable.
 * @public
 * @param ref - StorageReference where string should be uploaded.
 * @param value - The string to upload.
 * @param format - The format of the string to upload.
 * @param metadata - Metadata for the string to upload.
 * @returns A Promise containing an UploadResult
 */
export function uploadString(
  ref: StorageReference,
  value: string,
  format?: string,
  metadata?: UploadMetadata
): Promise<UploadResult> {
  return uploadStringInternal(
    ref as Reference,
    value,
    format,
    metadata as MetadataInternal
  );
}

/**
 * Uploads data to this object's location.
 * The upload can be paused and resumed, and exposes progress updates.
 * @public
 * @param ref - StorageReference where data should be uploaded.
 * @param data - The data to upload.
 * @param metadata - Metadata for the data to upload.
 * @returns An UploadTask
 */
export function uploadBytesResumable(
  ref: StorageReference,
  data: Blob | Uint8Array | ArrayBuffer,
  metadata?: UploadMetadata
): UploadTask {
  return uploadBytesResumableInternal(
    ref as Reference,
    data,
    metadata as MetadataInternal
  ) as UploadTask;
}

/**
 * A promise that resolves with the metadata for this object. If this
 * object doesn't exist or metadata cannot be retreived, the promise is
 * rejected.
 * @public
 * @param ref - StorageReference to get metadata from.
 */
export function getMetadata(ref: StorageReference): Promise<FullMetadata> {
  return getMetadataInternal(ref as Reference) as Promise<FullMetadata>;
}

/**
 * Updates the metadata for this object.
 * @public
 * @param ref - StorageReference to update metadata for.
 * @param metadata - The new metadata for the object.
 *     Only values that have been explicitly set will be changed. Explicitly
 *     setting a value to null will remove the metadata.
 * @returns A promise that resolves with the new metadata for this object.
 */
export function updateMetadata(
  ref: StorageReference,
  metadata: SettableMetadata
): Promise<FullMetadata> {
  return updateMetadataInternal(
    ref as Reference,
    metadata as Partial<MetadataInternal>
  ) as Promise<FullMetadata>;
}

/**
 * List items (files) and prefixes (folders) under this storage reference.
 *
 * List API is only available for Firebase Rules Version 2.
 *
 * GCS is a key-blob store. Firebase Storage imposes the semantic of '/'
 * delimited folder structure.
 * Refer to GCS's List API if you want to learn more.
 *
 * To adhere to Firebase Rules's Semantics, Firebase Storage does not
 * support objects whose paths end with "/" or contain two consecutive
 * "/"s. Firebase Storage List API will filter these unsupported objects.
 * list() may fail if there are too many unsupported objects in the bucket.
 * @public
 *
 * @param ref - StorageReference to get list from.
 * @param options - See ListOptions for details.
 * @returns A Promise that resolves with the items and prefixes.
 *      `prefixes` contains references to sub-folders and `items`
 *      contains references to objects in this folder. `nextPageToken`
 *      can be used to get the rest of the results.
 */
export function list(
  ref: StorageReference,
  options?: ListOptions
): Promise<ListResult> {
  return listInternal(ref as Reference, options);
}

/**
 * List all items (files) and prefixes (folders) under this storage reference.
 *
 * This is a helper method for calling list() repeatedly until there are
 * no more results. The default pagination size is 1000.
 *
 * Note: The results may not be consistent if objects are changed while this
 * operation is running.
 *
 * Warning: listAll may potentially consume too many resources if there are
 * too many results.
 * @public
 * @param ref - StorageReference to get list from.
 *
 * @returns A Promise that resolves with all the items and prefixes under
 *      the current storage reference. `prefixes` contains references to
 *      sub-directories and `items` contains references to objects in this
 *      folder. `nextPageToken` is never returned.
 */
export function listAll(ref: StorageReference): Promise<ListResult> {
  return listAllInternal(ref as Reference);
}

/**
 * Returns the download URL for the given Reference.
 * @public
 * @returns A promise that resolves with the download
 *     URL for this object.
 */
export function getDownloadURL(ref: StorageReference): Promise<string> {
  return getDownloadURLInternal(ref as Reference);
}

/**
 * Deletes the object at this location.
 * @public
 * @param ref - StorageReference for object to delete.
 * @returns A promise that resolves if the deletion succeeds.
 */
export function deleteObject(ref: StorageReference): Promise<void> {
  return deleteObjectInternal(ref as Reference);
}

/**
 * Returns a StorageReference for the given url.
 * @param storage - `StorageService` instance.
 * @param url - URL. If empty, returns root reference.
 * @public
 */
export function ref(storage: StorageService, url?: string): StorageReference;
/**
 * Returns a StorageReference for the given path in the
 * default bucket.
 * @param storageOrRef - `StorageService` or `StorageReference`.
 * @param pathOrUrlStorage - path. If empty, returns root reference (if Storage
 * instance provided) or returns same reference (if Reference provided).
 * @public
 */
export function ref(
  storageOrRef: StorageService | StorageReference,
  path?: string
): StorageReference;
export function ref(
  serviceOrRef: StorageService | StorageReference,
  pathOrUrl?: string
): StorageReference | null {
  return refInternal(
    serviceOrRef as StorageServiceInternal | Reference,
    pathOrUrl
  );
}

export { StringFormat } from '../src/implementation/string';

/**
 * Type constant for Firebase Storage.
 */
const STORAGE_TYPE = 'storage-exp';

/**
 * Gets a Firebase StorageService instance for the given Firebase app.
 * @public
 * @param app - Firebase app to get Storage instance for.
 * @param bucketUrl - The gs:// url to your Firebase Storage Bucket.
 * If not passed, uses the app's default Storage Bucket.
 * @returns A Firebase StorageService instance.
 */
export function getStorage(
  app: FirebaseApp,
  bucketUrl?: string
): StorageService {
  // Dependencies
  const storageProvider: Provider<'storage-exp'> = _getProvider(
    app,
    STORAGE_TYPE
  );
  const storageInstance = storageProvider.getImmediate({
    identifier: bucketUrl
  });
  return storageInstance;
}

function factory(container: ComponentContainer, url?: string): StorageService {
  const app = container.getProvider('app-exp').getImmediate();
  const authProvider = container.getProvider('auth-internal');

  return new StorageServiceInternal(
    app,
    authProvider,
    new XhrIoPool(),
    url,
    SDK_VERSION
  );
}

function registerStorage(): void {
  _registerComponent(
    new Component(
      STORAGE_TYPE,
      factory,
      ComponentType.PUBLIC
    ).setMultipleInstances(true)
  );

  registerVersion(name, version);
}

registerStorage();
