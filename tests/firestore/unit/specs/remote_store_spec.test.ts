/**
 * Copyright 2017 Google Inc.
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
import { Query } from '../../../../src/firestore/core/query';
import { Code } from '../../../../src/firestore/util/error';
import { doc, path } from '../../util/helpers';

import { describeSpec, specTest } from './describe_spec';
import { spec } from './spec_builder';

describeSpec('Remote store:', [], () => {
  specTest('Waits for watch to remove targets', [], () => {
    const query = Query.atPath(path('collection'));
    const doc1 = doc('collection/a', 1000, { key: 'a' });
    return spec()
      .withGCEnabled(false)
      .userListens(query)
      .watchAcks(query)
      .userUnlistens(query) // Now we simulate a quick unlisten.
      .userListens(query) // But add it back before watch acks it.
      .watchSends({ affects: [query] }, doc1) // Should be ignored.
      .watchCurrents(query, 'resume-token')
      .watchSnapshots(1000)
      .watchRemoves(query) // Finally watch decides to ack the removal.
      .watchAcksFull(query, 1001, doc1) // Now watch should ack the query.
      .expectEvents(query, { added: [doc1] }); // This should work now.
  });

  specTest('Waits for watch to ack last target add', [], () => {
    const query = Query.atPath(path('collection'));
    const doc1 = doc('collection/a', 1000, { key: 'a' });
    const doc2 = doc('collection/b', 1000, { key: 'b' });
    const doc3 = doc('collection/c', 1000, { key: 'c' });
    const doc4 = doc('collection/d', 1000, { key: 'd' });
    return spec()
      .withGCEnabled(false)
      .userListens(query)
      .watchAcks(query)
      .userUnlistens(query) // Now we simulate a quick unlisten.
      .userListens(query) // But add it back before watch acks it.
      .userUnlistens(query) // But do it a few more times...
      .userListens(query)
      .userUnlistens(query)
      .userListens(query)
      .watchSends({ affects: [query] }, doc1) // Should be ignored.
      .watchCurrents(query, 'resume-token')
      .watchSnapshots(1000)
      .watchRemoves(query) // Finally watch decides to ack the FIRST removal.
      .watchAcksFull(query, 1001, doc2) // Now watch should ack the second listen.
      .watchRemoves(query) // Finally watch decides to ack the SECOND removal.
      .watchAcksFull(query, 1001, doc3) // Now watch should ack the second listen.
      .watchRemoves(query) // Finally watch decides to ack the THIRD removal.
      .watchAcksFull(query, 1001, doc4) // Now watch should ack the query.
      .expectEvents(query, { added: [doc4] }); // This should work now.
  });

  specTest('Cleans up watch state correctly', [], () => {
    const query = Query.atPath(path('collection'));
    const doc1 = doc('collection/a', 1000, { key: 'a' });
    return (
      spec()
        .withGCEnabled(false)
        .userListens(query)
        // Close before we get an ack, this should reset our pending
        // target counts.
        .watchStreamCloses(Code.UNAVAILABLE)
        // This should work now.
        .watchAcksFull(query, 1001, doc1)
        .expectEvents(query, { added: [doc1] })
    );
  });
});
