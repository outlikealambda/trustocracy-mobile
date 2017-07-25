/**
 * @flow
 */
import React, { Component } from 'react';
import { TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import { Octicons } from '@expo/vector-icons';

import { IconButton } from '../Buttons.js';
import { Overview } from './Overview.js';
import { Add } from './Add.js';
import { Activate, Status as ActivateStatus } from './Activate.js';
import type { StatusType as ActivateStatusType } from './Activate.js';
import { Rank, Status as RankStatus } from './Rank.js';
import type { StatusType as RankStatusType } from './Rank.js';

import { styles } from './styles.js';
import * as Api from '../api.js';
import { Arrays } from '../../utils.js';

const USER_ID = 682;

const DelegateView = {
  OVERVIEW: 'overview',
  ADD: 'add',
  ACTIVATE: 'activate',
  RANK: 'rank'
};

type DelegateViewType = 'overview' | 'add' | 'activate' | 'rank';

type Person = {
  id: number,
  name: string,
  status?: ActivateStatusType
};

type State = {
  currentView: DelegateViewType,
  userId: number,
  recentlyAdded: Array<string>,
  recentlyFailed: Array<string>,
  active: Array<Person>,
  lastActiveSaved: Array<Person>,
  activeState: RankStatusType,
  inactive: Array<Person>
};

export class Delegate extends Component<void, void, State> {
  state: State;

  constructor() {
    super();

    this.state = {
      currentView: DelegateView.OVERVIEW,
      userId: USER_ID,
      recentlyAdded: [],
      recentlyFailed: [],
      active: [],
      lastActiveSaved: [],
      activeState: RankStatus.CLEAN,
      inactive: []
    };

    this.fetchActive(USER_ID);
    this.fetchInactive(USER_ID);
  }

  fetchInactive = (userId: number) => {
    Api.delegate
      .getInactive(userId)
      .then(response => response.json())
      .then(inactive => {
        this.setState({ inactive });
      });
  };

  fetchActive = (userId: number) => {
    Api.delegate
      .getActive(userId)
      .then(response => response.json())
      .then(active => {
        active.sort((a, b) => a.rank - b.rank);
        return active;
      })
      .then(active => {
        this.setState({
          active,
          lastActiveSaved: active,
          activeState: RankStatus.CLEAN
        });
      });
  };

  resetActive = () => {
    const { lastActiveSaved } = this.state;

    this.setState({
      active: lastActiveSaved,
      activeState: RankStatus.CLEAN
    });
  };

  saveActive = () => {
    this.setState({ activeState: RankStatus.SAVING });

    const { active, userId } = this.state;

    Api.delegate.rank(userId, active).then(() =>
      this.setState({
        lastActiveSaved: active,
        activeState: RankStatus.CLEAN
      })
    );
  };

  moveActive = (idxFrom: number, idxTo?: number) => {
    const { active } = this.state;

    let updated = Arrays.remove(active, idxFrom);

    // if idxTo is not defined, remove only (deactivate)
    if (idxTo || idxTo === 0) {
      updated = Arrays.insert(updated, idxTo, active[idxFrom]);
    }

    this.setState({
      activeState: RankStatus.DIRTY,
      active: updated
    });
  };

  setView = (view: DelegateViewType) => () =>
    this.setState({ currentView: view });

  setInactiveStatus = (newStatus: ActivateStatusType) => (
    inactiveId: number
  ) => {
    const inactive = this.state.inactive.map(f =>
      Object.assign({}, f, {
        status: f.id === inactiveId ? newStatus : f.status
      })
    );

    this.setState({ inactive });
  };

  inactive = {
    status: {
      clear: this.setInactiveStatus(ActivateStatus.AT_REST),
      activating: this.setInactiveStatus(ActivateStatus.ACTIVATING),
      activated: this.setInactiveStatus(ActivateStatus.ACTIVATED),
      removing: this.setInactiveStatus(ActivateStatus.REMOVING),
      removed: this.setInactiveStatus(ActivateStatus.REMOVED)
    }
  };

  activate = (inactiveId: number) => {
    this.inactive.status.activating(inactiveId);

    Api.delegate.activate(this.state.userId, inactiveId).then(result => {
      if (result.status !== 200) {
        this.inactive.status.clear(inactiveId);
      } else {
        this.inactive.status.activated(inactiveId);
        this.deleteInactive(inactiveId, 2000);
      }
    });
  };

  remove = (inactiveId: number) => {
    this.inactive.status.removing(inactiveId);

    Api.delegate.remove(this.state.userId, inactiveId).then(result => {
      if (result.status !== 200) {
        this.inactive.status.clear(inactiveId);
      } else {
        this.inactive.status.removed(inactiveId);
        this.deleteInactive(inactiveId, 2000);
      }
    });
  };

  deleteInactive = (inactiveId: number, delay: number = 0) => {
    const deleteIt = () =>
      this.setState({
        inactive: Arrays.removeWhere(
          this.state.inactive,
          p => p.id === inactiveId
        )
      });

    if (delay) {
      setTimeout(deleteIt, delay);
    } else {
      deleteIt();
    }
  };

  search = (email: string) => {
    return Api.delegate.add(this.state.userId, email).then(response => {
      if (response.status !== 200) {
        this.setState({
          recentlyFailed: this.state.recentlyFailed.concat([email])
        });
      } else {
        this.setState({
          recentlyAdded: this.state.recentlyAdded.concat([email])
        });
      }
    });
  };

  icons = (function(setView) {
    // Calculate icon widths based on height
    // Expose height from Buttons maybe?
    const height = 32;
    const plusWidth = height * 24 / 32;
    const zapWidth = height * 20 / 32;
    const listOrderedWidth = height * 24 / 32;

    return {
      add: (
        <IconButton
          name="plus"
          iconStyle={[styles.icon, { width: plusWidth }]}
          buttonStyle={styles.buttonStyle}
          onPress={setView(DelegateView.ADD)}
        />
      ),
      rank: (
        <IconButton
          name="list-ordered"
          iconStyle={[styles.icon, { width: listOrderedWidth }]}
          buttonStyle={styles.buttonStyle}
          onPress={setView(DelegateView.RANK)}
        />
      ),
      activate: (
        <IconButton
          name="zap"
          iconStyle={[styles.icon, { width: zapWidth }]}
          buttonStyle={styles.buttonStyle}
          onPress={setView(DelegateView.ACTIVATE)}
        />
      )
    };
  })(this.setView);

  renderHeader() {
    return (
      <View style={[styles.row, styles.nav]}>
        {this.icons.add}
        {this.icons.activate}
        {this.icons.rank}
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {this.state.currentView !== DelegateView.OVERVIEW &&
          this.renderHeader()}
        <View style={{ flex: 1 }}>
          {this.state.currentView === DelegateView.OVERVIEW &&
            <Overview
              activeCount={this.state.active.length}
              inactiveCount={this.state.inactive.length}
              add={this.icons.add}
              activate={this.icons.activate}
              rank={this.icons.rank}
            />}
          {this.state.currentView === DelegateView.ADD &&
            <Add
              {...this.state}
              search={this.search}
              delegateCount={
                this.state.active.length + this.state.inactive.length
              }
            />}
          {this.state.currentView === DelegateView.ACTIVATE &&
            <Activate
              {...this.state}
              activate={this.activate}
              remove={this.remove}
            />}
          {this.state.currentView === DelegateView.RANK &&
            <Rank
              {...this.state}
              save={this.saveActive}
              reset={this.resetActive}
              move={this.moveActive}
            />}
        </View>
      </View>
    );
  }
}

export const DelegateIcon = (navigate: Function) =>
  <TouchableHighlight onPress={() => navigate('delegate')}>
    <Octicons name="organization" size={32} style={{ marginRight: 12 }} />
  </TouchableHighlight>;

DelegateIcon.propTypes = {
  navigate: PropTypes.func.isRequired
};
