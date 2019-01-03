import React from 'react';
import update from 'immutability-helper';

import CityDataTable from './CityDataTable.jsx';

class CityDataTableContainer extends React.Component {
  state = {
    cityData: [
      { cityId: '1', order: '2', name: 'Gliwice', description: 'Some...' },
      { cityId: '2', order: '1', name: 'Kraków', description: '' },
      { cityId: '3', order: '3', name: 'Warszawa', description: 'Capital' },
    ],
  };

  onUpdateCity = (cityId, data) => {
    if (!data) {
      return;
    }

    this.setState(state => {
      const index = state.cityData.findIndex(item => item.cityId === cityId);

      return update(state, {
        cityData: {
          [index]: { $merge: data },
        },
      });
    });
  };

  onUpdateCityAll = (data, nextData) => {
    this.setState({
      cityData: nextData,
    });
  };

  render() {
    return (
      <div>
        <h2>CityDataTable</h2>

        <CityDataTable
          data={this.state.cityData}
          onUpdate={this.onUpdateCity}
          onUpdateAll={this.onUpdateCityAll}
        />
      </div>
    );
  }
}

export default CityDataTableContainer;
