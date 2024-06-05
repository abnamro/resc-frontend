import type { StyleValue } from 'vue';

export type TableColumn =
  | 'select'
  | 'toggle_row'
  | 'project_key'
  | 'repository_name'
  | 'rule_name'
  | 'file_path'
  | 'line_number'
  | 'commit_timestamp'
  | 'scanType'
  | 'timestamp'
  | 'vcs_provider'
  | 'status';

export type SimpleTableField = {
  key: string;
  sortable?: boolean;
  label: string;
  class: string;
  thStyle: StyleValue;
};

const ColumnUtils = {
  _formatColumn(column: TableColumn): SimpleTableField {
    return {
      key: column,
      sortable: false,
      label: ColumnUtils.formatColumnLabel(column),
      class: ColumnUtils._class(column),
      thStyle: { borderTop: '0px' },
    };
  },

  formatColumnLabel(column: TableColumn): string {
    const labels = {
      select: '',
      toggle_row: '',
      project_key: 'Project',
      repository_name: 'Repository',
      rule_name: 'Rule',
      file_path: 'File Path',
      line_number: 'Line',
      commit_timestamp: 'Commit date',
      vcs_provider: 'VCS provider',
      status: 'Status',
      scanType: 'Scan Type',
      timestamp: 'Scan Date',
    };
    type LabelKey = keyof typeof labels;

    if (column in labels) {
      return labels[column as LabelKey];
    }

    return column;
  },

  _class(column: TableColumn): string {
    const baseCss = 'position-sticky text-nowrap ';
    if (column === 'file_path') {
      return baseCss + 'text-start mw-50';
    }

    if (column === 'status') {
      return baseCss + 'text-end';
    }
    return baseCss + 'text-start';
  },

  _defaultColumns(): TableColumn[] {
    return [
      'select',
      'toggle_row',
      'project_key',
      'repository_name',
      'rule_name',
      'file_path',
      'line_number',
      'commit_timestamp',
      'scanType',
      'vcs_provider',
      'status',
    ];
  },

  selectableColumns(): TableColumn[] {
    return [
      'project_key',
      'repository_name',
      'rule_name',
      'file_path',
      'line_number',
      'commit_timestamp',
      'scanType',
      'vcs_provider',
      'timestamp',
    ];
  },

  defaultSelectableColumns(): TableColumn[] {
    return ['project_key', 'repository_name', 'rule_name', 'file_path', 'line_number'];
  },

  _filter(columns: TableColumn[], isRuleFinding: boolean): TableColumn[] {
    let index;
    if (isRuleFinding) {
      index = columns.indexOf('scanType');
      if (index > -1) {
        // only splice columns when item is found
        columns.splice(index, 1); // 2nd parameter means remove one item only
      }
    } else {
      index = columns.indexOf('project_key');
      if (index > -1) {
        // only splice columns when item is found
        columns.splice(index, 1); // 2nd parameter means remove one item only
      }
      index = columns.indexOf('repository_name');
      if (index > -1) {
        // only splice columns when item is found
        columns.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    return columns;
  },

  getColumns(
    selectedColumns: TableColumn[] = [],
    memoryColumns: TableColumn[] = [],
    isRuleFinding: boolean,
  ): SimpleTableField[] {
    const defaultColumns = ColumnUtils._defaultColumns();

    // Get default selected Columns if the selection is empty.
    if (selectedColumns.length === 0) {
      selectedColumns = memoryColumns;
    }
    if (selectedColumns.length === 0) {
      selectedColumns = ColumnUtils.defaultSelectableColumns();
    }

    // Retrieve the names of columns to remove.
    const removedColumn = ColumnUtils.selectableColumns().filter(
      (col) => !selectedColumns.includes(col),
    );
    let columns = defaultColumns.filter((col) => !removedColumn.includes(col));

    // Remove the non-relevant columns
    columns = ColumnUtils._filter(columns, isRuleFinding);

    // Output columns.
    return columns.map(ColumnUtils._formatColumn);
  },
};

export default ColumnUtils;
