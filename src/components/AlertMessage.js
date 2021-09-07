import React from 'react';
import AwesomeAlert from "react-native-awesome-alerts";
import * as Constance from '../utils/constants';

class App extends React.Component {
    render() {
        return (
            <AwesomeAlert
                show={this.props.show}
                showProgress={false}
                title={this.props.title}
                message={this.props.message !== undefined ? this.props.message : null}
                closeOnTouchOutside={this.props.onDismiss !== undefined}
                closeOnHardwareBackPress={this.props.onDismiss !== undefined}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText={this.props.cancelText}
                confirmText={this.props.confirmText}
                confirmButtonColor={Constance.COLORS.WHITE}
                onDismiss={this.props.onDismiss}
                onCancelPressed={this.props.onCancelPressed}
                onConfirmPressed={this.props.onConfirmPressed}
                confirmButtonTextStyle={{color: Constance.COLORS.BLACK, textAlign: "center"}}
                titleStyle={{
                    fontSize: 20,
                    lineHeight: 22,
                    color: Constance.COLORS.BLACK,
                    textAlign: "center",
                    marginBottom: 10
                }}
                messageStyle={{
                    fontSize: 15,
                    lineHeight: 22,
                    color: Constance.COLORS.BLACK,
                    textAlign: "center"
                }}
                cancelButtonColor={Constance.COLORS.PRIMARY_COLOR}
                contentStyle={{alignItems: 'center', justifyContent: 'center', marginVertical: '5%'}}
                contentContainerStyle={{borderRadius: 15}}
                cancelButtonStyle={{
                    width: 102,
                    height: 43,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5,
                    shadowColor: Constance.COLORS.BLACK,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 2,
                }}
                confirmButtonStyle={{
                    width: 102,
                    height: 43,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 5,
                    shadowColor: Constance.COLORS.BLACK,
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 2,
                }}
                cancelButtonTextStyle={{textAlign: "center"}}
            />
        )
    }
}

export default App;
