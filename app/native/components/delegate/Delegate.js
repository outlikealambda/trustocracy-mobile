import React, { Component } from 'react';
import { TouchableHighlight, View } from 'react-native';
import { Octicons } from '@expo/vector-icons';

import { IconButton } from '../Buttons.js';
import { Overview } from './Overview.js';
import { Add } from './Add.js';
import { Activate } from './Activate.js';
import { Rank } from './Rank.js';

import { styles } from './styles.js';
import * as Api from '../api.js';
import { Arrays } from '../../utils.js';

const USER_ID = 2;

const OVERVIEW = 'overview';
const ADD = 'add';
const ACTIVATE = 'activate';
const RANK = 'rank';

export class Delegate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: OVERVIEW,
      userId: USER_ID,
      recentlyAdded: [],
      recentlyFailed: [],
      active: [],
      lastActiveSaved: [],
      activeState: 'clean',
      inactive: []
    };

    this.fetchActive(USER_ID);
    this.fetchInactive(USER_ID);
  }

  fetchInactive = userId => {
    Api.delegate
      .getInactive(userId)
      .then(response => response.json())
      .then(inactive => {
        this.setState({ inactive });
      });
  };

  fetchActive = userId => {
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
          activeState: 'clean'
        });
      });
  };

  resetActive = () => {
    const { lastActiveSaved } = this.state;

    this.setState({
      active: lastActiveSaved,
      activeState: 'clean'
    });
  };

  saveActive = () => {
    this.setState({ activeState: 'saving' });

    const { active, userId } = this.state;

    Api.delegate.rank(userId, active).then(res =>
      this.setState({
        lastActiveSaved: active,
        activeState: 'clean'
      })
    );
  };

  moveActive = (idxFrom, idxTo) => {
    const { active } = this.state;

    let updated = Arrays.remove(active, idxFrom);

    // if idxTo is not defined, remove only (deactivate)
    if (idxTo || idxTo === 0) {
      updated = Arrays.insert(updated, idxTo, active[idxFrom]);
    }

    this.setState({
      activeState: 'dirty',
      active: updated
    });
  };

  setView = view => () => this.setState({ currentView: view });

  setInactiveStatus = newStatus => inactiveId => {
    const inactive = this.state.inactive.map(f =>
      Object.assign({}, f, {
        status: f.id === inactiveId ? newStatus : f.status
      })
    );

    this.setState({ inactive });
  };

  inactive = {
    status: {
      clear: this.setInactiveStatus(null),
      activating: this.setInactiveStatus('activating'),
      activated: this.setInactiveStatus('activated'),
      removing: this.setInactiveStatus('removing'),
      removed: this.setInactiveStatus('removed')
    }
  };

  activate = inactiveId => {
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

  remove = inactiveId => {
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

  deleteInactive = (inactiveId, delay = 0) => {
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

  search = email => {
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
          onPress={setView(ADD)}
        />
      ),
      rank: (
        <IconButton
          name="list-ordered"
          iconStyle={[styles.icon, { width: listOrderedWidth }]}
          buttonStyle={styles.buttonStyle}
          onPress={setView(RANK)}
        />
      ),
      activate: (
        <IconButton
          name="zap"
          iconStyle={[styles.icon, { width: zapWidth }]}
          buttonStyle={styles.buttonStyle}
          onPress={setView(ACTIVATE)}
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
        {this.state.currentView !== OVERVIEW && this.renderHeader()}
        <View style={{ flex: 1 }}>
          {this.state.currentView === OVERVIEW &&
            <Overview
              activeCount={this.state.active.length}
              inactiveCount={this.state.inactive.length}
              add={this.icons.add}
              activate={this.icons.activate}
              rank={this.icons.rank}
            />}
          {this.state.currentView === ADD &&
            <Add
              {...this.state}
              search={this.search}
              delegateCount={
                this.state.active.length + this.state.inactive.length
              }
            />}
          {this.state.currentView === ACTIVATE &&
            <Activate
              {...this.state}
              activate={this.activate}
              remove={this.remove}
            />}
          {this.state.currentView === RANK &&
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

export const DelegateIcon = navigate =>
  <TouchableHighlight onPress={() => navigate('delegate')}>
    <Octicons name="organization" size={32} style={{ marginRight: 12 }} />
  </TouchableHighlight>;
