import { hot } from 'react-hot-loader';
import React from 'react';
import CityDataTableContainer from './CityDataTable/CityDataTableContainer';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Examples</h1>

        <CityDataTableContainer/>
      </div>
    );
  }
}

export default hot(module)(App);
