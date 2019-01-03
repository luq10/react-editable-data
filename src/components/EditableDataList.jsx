import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

/**
 * @todo
 * - prop extraData for f.ex success or error messages?
 * - prop onUpdateAll -> onUpdate, onUpdate -> onUpdateRow?
 * - onUpdateRow (actual name is 'onUpdate') only in onRenderRow?
 * - support for add new row
 * - support for delete row
 *
 * - Example with errrors and success info
 * - Example with updating status async
 */
class EditableDataList extends React.Component {
  state = {
    editedData: {},
  };

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      // Remove from state.editedData whole data with is
      // now in prop.data
      this.setState({
        editedData: this.getFreshEditedData(),
      });
    }
  }

  onChangeField = (id, fieldName, value) => {
    const { data, idFieldName } = this.props;

    const rowData = data.find(item => item[idFieldName] === id);

    if (rowData[fieldName] === value) {
      // Actual {value} of {fieldName} is the same
      // as coresponding value in original data, so we need
      // delete this field from editedData because this is not change...
      const { editedData } = this.state;

      const isOnlyOneEditedField = Object.keys(editedData[id]).length === 1;
      const unset = isOnlyOneEditedField ? { $unset: [id] } : {};

      return this.setState(state =>
        update(state, {
          editedData: {
            [id]: { $unset: [fieldName] },
            // If data in this row is edited only in {fieldName} field
            // and we delete info about this field we also must delete
            // info about whole this row
            ...unset,
          },
        }),
      );
    }

    const actualEditedData = {
      [fieldName]: value,
    };

    this.setState(state =>
      update(state, {
        editedData: {
          [id]: item =>
            !item ? actualEditedData : { ...item, ...actualEditedData },
        },
      }),
    );
  };

  onUpdate = id => {
    const { onUpdate } = this.props;
    const { editedData } = this.state;

    if (onUpdate) {
      onUpdate(id, editedData[id], this.getData());
    }
  };

  onUpdateAll = () => {
    const { onUpdateAll } = this.props;
    const { editedData } = this.state;

    if (onUpdateAll) {
      onUpdateAll(editedData, this.getData());
    }
  };

  onRenderRow = (rowData, index) => {
    const { updatingIds, idFieldName, onRenderRow } = this.props;
    const { editedData } = this.state;

    if (!onRenderRow) {
      return;
    }

    const id = rowData[idFieldName];

    const isEditedRow = editedData[id];
    const isUpdatingRow = updatingIds ? updatingIds.includes(id) : false;

    return onRenderRow({
      ...this.getPublicParams(),
      rowData,
      id,
      index,
      isEditedRow,
      isUpdatingRow,
      onChangeRowField: e =>
        this.onChangeField(id, e.target.name, e.target.value),
      onUpdateRow: () => this.onUpdate(id),
    });
  };

  onReset = () => {
    this.setState({
      editedData: {},
    });
  };

  getData() {
    const { data, idFieldName } = this.props;
    const { editedData } = this.state;

    return data.map(item => {
      const updatedData = editedData[item[idFieldName]];

      return updatedData ? { ...item, ...updatedData } : item;
    });
  }

  getFreshEditedData() {
    const { editedData } = this.state;
    const { data, idFieldName } = this.props;
    const editedIds = Object.keys(editedData);

    const nextEditedData = editedIds.reduce((res, id) => {
      const editedDataItem = editedData[id];
      const itemData = data.find(item => item[idFieldName] === id);

      const editedDataItemRest = Object.keys(editedDataItem).reduce(
        (restObject, fieldName) => {
          const value = editedDataItem[fieldName];

          if (value !== itemData[fieldName]) {
            return {
              ...restObject,
              [fieldName]: value,
            };
          }

          return restObject;
        },
        {},
      );

      const isEmpty = Object.keys(editedDataItemRest).length === 0;

      if (isEmpty) {
        return res;
      }

      return {
        ...res,
        [id]: editedDataItemRest,
      };
    }, {});

    return nextEditedData;
  }

  getPublicParams() {
    const { idFieldName, updatingIds } = this.props;
    const { editedData } = this.state;

    const isUpdating = updatingIds ? updatingIds.length > 0 : false;

    return {
      data: this.getData(),
      idFieldName,
      editedData,
      isUpdating,
      isEdited: Object.keys(editedData).length > 0,
      onUpdate: this.onUpdate,
      onUpdateAll: this.onUpdateAll,
      onReset: this.onReset,
      onChangeField: this.onChangeField,
      onRenderRow: this.onRenderRow,
    };
  }

  render() {
    const { children } = this.props;

    return children(this.getPublicParams());
  }
}

EditableDataList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  idFieldName: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  onUpdateAll: PropTypes.func,
  onRenderRow: PropTypes.func,
  updatingIds: PropTypes.arrayOf(PropTypes.string),
};

export default EditableDataList;
