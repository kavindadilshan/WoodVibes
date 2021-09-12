import React, {Fragment} from 'react';
import SearchableDropdown from "react-native-searchable-dropdown";
import * as Constants from "../utils/constants";
import {Dimensions} from "react-native";

const screenHeight = Dimensions.get("screen").height;


const DropDown = (props) => {
    return (
        <Fragment>
            <SearchableDropdown
                onItemSelect={props.onItemSelect}
                selectedItems={props.selectedItems}
                onRemoveItem={props.onRemoveItem}
                containerStyle={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    borderRadius: 10
                }}
                itemStyle={{
                    padding: 10,
                    marginTop: 2,
                    backgroundColor: '#ddd',
                    borderColor: '#bbb',
                    borderWidth: 1,
                    borderRadius: 5,
                }}
                itemTextStyle={{color: '#222'}}
                itemsContainerStyle={{zIndex: 1, maxHeight: screenHeight / 100 * 20, paddingBottom: 5}}
                items={props.items}
                defaultIndex={2}
                resetValue={false}
                textInputProps={
                    {
                        placeholder: props.placeholder,
                        underlineColorAndroid: "transparent",
                        style: {
                            padding: 12,
                            borderRadius: 5,
                            height: 45,
                            backgroundColor: Constants.COLORS.WHITE
                        },
                        // onTextChange: text => this.state.text
                    }
                }
                listProps={
                    {
                        nestedScrollEnabled: true,
                    }
                }
            />

        </Fragment>
    )
}

export default DropDown;
