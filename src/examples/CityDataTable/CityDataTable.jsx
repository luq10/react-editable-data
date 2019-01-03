import React from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';

import {EditableDataList} from '../../index';

class CityDataTable extends React.Component {
  renderRow = ({
                 rowData,
                 index,
                 id,
                 isUpdatingRow,
                 isEditedRow,
                 onChangeRowField,
                 onUpdateRow,
               }) => {
    return (
      <tr key={id}>
        <td>Nr. {index + 1}</td>
        <td>
          <input
            type="number"
            name="order"
            value={rowData.order}
            disabled={isUpdatingRow}
            onChange={onChangeRowField}
          />
        </td>
        <td>
          <input
            type="text"
            name="name"
            value={rowData.name}
            disabled={isUpdatingRow}
            onChange={onChangeRowField}
          />
        </td>
        <td>
          <small>{rowData.description}</small>
        </td>
        <td>
          <button
            type="button"
            disabled={!isEditedRow || isUpdatingRow}
            onClick={onUpdateRow}
          >
            {isUpdatingRow ? 'Editing' : 'Edit'}
          </button>
        </td>
      </tr>
    );
  };

  renderContent({
                  data,
                  editedData,
                  isEdited,
                  isUpdating,
                  onRenderRow,
                  onReset,
                  onUpdateAll,
                }) {
    const orderedData = data.slice().sort((a, b) => a.order - b.order);

    return (
      <div>
        <JSONPretty id="json-pretty" json={editedData} />
        <table>
          <thead>
          <tr>
            <th />
            <th>Order</th>
            <th>Name</th>
            <th>Text</th>
            <th />
          </tr>
          </thead>
          <tbody>{orderedData.map(onRenderRow)}</tbody>
        </table>

        {isEdited && (
          <p style={{ color: 'green' }}>Dont forget save your changes!</p>
        )}

        <button disabled={!isEdited || isUpdating} onClick={onReset}>
          Reset
        </button>
        <button disabled={!isEdited || isUpdating} onClick={onUpdateAll}>
          Edit all
        </button>
      </div>
    );
  }

  render() {
    const { data, onUpdate, onUpdateAll, updatingIds } = this.props;

    return (
      <EditableDataList
        data={data}
        idFieldName="cityId"
        updatingIds={updatingIds}
        onUpdate={onUpdate}
        onUpdateAll={onUpdateAll}
        onRenderRow={this.renderRow}
      >
        {this.renderContent}
      </EditableDataList>
    );
  }
}

CityDataTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      cityId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      order: PropTypes.string.isRequired,
      description: PropTypes.string,
    }),
  ).isRequired,
  onUpdate: PropTypes.func,
  onUpdateAll: PropTypes.func,
  updatingIds: PropTypes.arrayOf(PropTypes.string),
};

export default CityDataTable;
