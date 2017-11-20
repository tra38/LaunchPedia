import React from 'react';
import { Panel } from "../dependencies/react-bootstrap-dependencies"
import LaunchDatePicker from "./LaunchDatePicker"
import SearchInput from "./SearchInput"

const SearchPanel = ({updateParentDate, launches, updateSearchResults}) => {
  return (<Panel>
      <LaunchDatePicker updateParentDate={updateParentDate}/>
      <SearchInput
        launches={launches}
        updateSearchResults={updateSearchResults} />
    </Panel>);
}

export default SearchPanel;