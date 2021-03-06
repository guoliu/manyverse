/* Copyright (C) 2018-2019 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

type Callback = (e: any, x?: any) => void;

export = {
  name: 'connUtils',
  version: '1.0.0',
  manifest: {
    persistentConnect: 'async',
    persistentDisconnect: 'async',
    isInDB: 'async',
  },
  permissions: {
    master: {
      allow: ['persistentConnect', 'persistentDisconnect', 'isInDB'],
    },
  },
  init: function init(ssb: any) {
    return {
      persistentConnect(address: string, data: any, cb: Callback) {
        // if we had 'autoconnect=false', then make it true
        ssb.conn.db().update(address, (prev: any) => {
          if (!prev.autoconnect) return {autoconnect: true};
          else return {};
        });

        ssb.conn.connect(address, data, cb);
      },

      persistentDisconnect(address: string, cb: Callback) {
        // if we had 'autoconnect=true', then make it false
        ssb.conn.db().update(address, (prev: any) => {
          if (prev.autoconnect) return {autoconnect: false};
          else return {};
        });

        // disconnect
        ssb.conn.disconnect(address, cb);
      },

      isInDB(address: string, cb: Callback) {
        try {
          const result = ssb.conn.db().has(address);
          cb(null, result);
        } catch (err) {
          cb(err);
        }
      },
    };
  },
};
