/* Copyright (C) 2018-2019 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {h} from '@cycle/react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Palette} from '../../../../global-styles/palette';
import {Dimensions} from '../../../../global-styles/dimens';
import {Typography} from '../../../../global-styles/typography';
import Avatar from '../../../../components/Avatar';
import {PeerKV} from '../../../../ssb/types';
import {peerModeName, peerModeIcon, peerModeDescription} from './utils';

const dotStyle: ViewStyle = {
  width: 11,
  height: 11,
  position: 'absolute',
  bottom: 18.8,
  left: 52.65,
  borderRadius: 6,
  borderColor: Palette.backgroundText,
  borderWidth: 1,
};

export const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Palette.backgroundText,
  },

  item: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: Dimensions.horizontalSpaceBig,
    paddingVertical: Dimensions.verticalSpaceBig,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },

  connectedDot: {
    ...dotStyle,
    backgroundColor: Palette.backgroundPeerConnected,
  },

  connectingDot: {
    ...dotStyle,
    backgroundColor: Palette.backgroundPeerConnecting,
  },

  disconnectingDot: {
    ...dotStyle,
    backgroundColor: Palette.backgroundPeerDisconnecting,
  },

  avatar: {
    marginRight: Dimensions.horizontalSpaceSmall,
  },

  details: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },

  name: {
    fontSize: Typography.fontSizeNormal,
    fontWeight: 'bold',
    fontFamily: Typography.fontFamilyReadableText,
    color: Palette.text,
    minWidth: 120,
  },

  mode: {
    flexDirection: 'row',
  },

  modeText: {
    fontSize: Typography.fontSizeSmall,
    fontFamily: Typography.fontFamilyReadableText,
    color: Palette.textWeak,
    marginLeft: Dimensions.horizontalSpaceTiny,
  },
});

export type Props = {
  peer: PeerKV;
  onPressPeer?: (peer: PeerKV) => void;
};

export default class ConnectionsItem extends PureComponent<Props> {
  public render() {
    const [addr, data] = this.props.peer;

    return h(
      TouchableOpacity,
      {
        key: addr,
        onPress: () => {
          if (this.props.onPressPeer) {
            this.props.onPressPeer([addr, data]);
          }
        },
        style: styles.itemContainer,
        activeOpacity: 0.5,
      },
      [
        h(View, {style: styles.item}, [
          h(Avatar, {
            size: Dimensions.avatarSizeNormal,
            url: data['imageUrl' as any],
            style: styles.avatar,
          }),
          h(View, {
            style:
              data.state === 'connected'
                ? styles.connectedDot
                : data.state === 'disconnecting'
                ? styles.disconnectingDot
                : styles.connectingDot,
          }),
          h(View, {style: styles.details}, [
            h(
              Text,
              {numberOfLines: 1, ellipsizeMode: 'middle', style: styles.name},
              peerModeName(addr, data),
            ),
            h(View, {style: styles.mode}, [
              h(Icon, {
                size: Dimensions.iconSizeSmall,
                color: Palette.textWeak,
                name: peerModeIcon(data),
              }),
              h(Text, {style: styles.modeText}, peerModeDescription(data)),
            ]),
          ]),
        ]),
      ],
    );
  }
}
