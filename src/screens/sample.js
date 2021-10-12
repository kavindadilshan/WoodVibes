// import React, {useEffect, useState} from "react";
// import {Text, View, TouchableOpacity} from "react-native";
// import {
//     USBPrinter,
//     NetPrinter,
//     BLEPrinter,
// } from "react-native-thermal-receipt-printer";
//
// interface IBLEPrinter {
//     device_name: string;
//     inner_mac_address: string;
// }
//
// const SampleScan = () => {
//
//     const [printers, setPrinters] = useState([]);
//     const [currentPrinter, setCurrentPrinter] = useState();
//
//     useEffect(() => {
//         BLEPrinter.init().then((res) => {
//             BLEPrinter.getDeviceList()
//                 .then(res => {
//                     console.log(res)
//                     setPrinters(res)
//                 })
//                 .catch(err => {
//                     console.log(err)
//                 })
//         });
//     }, []);
//
//     const _connectPrinter = (printer) => {
//         //connect printer
//         BLEPrinter.connectPrinter(printer.inner_mac_address)
//             .then(res => {
//                 console.log(res)
//                 setCurrentPrinter(res)
//             })
//             .catch(err => console.log(err))
//     }
//
//     const printTextTest = () => {
//         currentPrinter && BLEPrinter.printText("<C>sample text</C>\n");
//     }
//
//     const printBillTest = () => {
//         currentPrinter && BLEPrinter.printBill("<C>CHANDRANI</C>");
//     }
//
//     return (
//         <View style={{flex: 1}}>
//             {
//                 printers.map(printer => (
//                     <TouchableOpacity key={printer.inner_mac_address} onPress={() => _connectPrinter(printer)}>
//                         <Text>{`device_name: ${printer.device_name}, inner_mac_address: ${printer.inner_mac_address}`}</Text>
//                     </TouchableOpacity>
//                 ))
//             }
//             <TouchableOpacity onPress={printTextTest}>
//                 <Text>Print Text</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={printBillTest}>
//                 <Text>Print Bill Text</Text>
//             </TouchableOpacity>
//         </View>
//
//     )
// }
//
// export default SampleScan;

// import * as React from "react";
// import {
//     StyleSheet,
//     View,
//     Text,
//     Button,
//     Picker,
//     TextInput,
// } from "react-native";
// import {
//     BLEPrinter,
//     NetPrinter,
//     USBPrinter,
//     IUSBPrinter,
//     IBLEPrinter,
//     INetPrinter,
// } from "react-native-thermal-receipt-printer";
//
// const printerList: Record<string, any> = {
//     ble: BLEPrinter,
//     net: NetPrinter,
//     usb: USBPrinter,
// };
//
// interface SelectedPrinter
//     extends Partial<IUSBPrinter & IBLEPrinter & INetPrinter> {
//     printerType?:  printerList;
// }
//
// export default function App() {
//     const [selectedValue, setSelectedValue] = React.useState<printerList>("ble");
//     const [devices, setDevices] = React.useState([]);
//     const [loading, setLoading] = React.useState<boolean>(false);
//     const [selectedPrinter, setSelectedPrinter] = React.useState<SelectedPrinter>(
//         {}
//     );
//
//     React.useEffect(() => {
//         const getListDevices = async () => {
//             const Printer = printerList[selectedValue];
//             // get list device for net printers is support scanning in local ip but not recommended
//             if (selectedValue === "net") return;
//             try {
//                 setLoading(true);
//                 await Printer.init();
//                 const results = await Printer.getDeviceList();
//                 setDevices(
//                     results.map((item: any) => ({ ...item, printerType: selectedValue }))
//                 );
//             } catch (err) {
//                 console.warn(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         getListDevices();
//     }, [selectedValue]);
//
//     const handleConnectSelectedPrinter = () => {
//         if (!selectedPrinter) return;
//         const connect = async () => {
//             try {
//                 setLoading(true);
//                 switch (selectedPrinter.printerType) {
//                     case "ble":
//                         await BLEPrinter.connectPrinter(
//                             selectedPrinter?.inner_mac_address || ""
//                         );
//                         break;
//                     case "net":
//                         await NetPrinter.connectPrinter(
//                             selectedPrinter?.host || "",
//                             selectedPrinter?.port || 9100
//                         );
//                         break;
//                     case "usb":
//                         await USBPrinter.connectPrinter(
//                             selectedPrinter?.vendor_id || "",
//                             selectedPrinter?.product_id || ""
//                         );
//                         break;
//                     default:
//                 }
//             } catch (err) {
//                 console.warn(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         connect();
//     };
//
//     const handlePrint = async () => {
//         try {
//             const Printer = printerList[selectedValue];
//             await Printer.printText("<C>sample text</C>\n");
//         } catch (err) {
//             console.warn(err);
//         }
//     };
//
//     const handleChangePrinterType = async (type:  typeof printerList) => {
//         setSelectedValue((prev) => {
//             printerList[prev].closeConn();
//             return type;
//         });
//         setSelectedPrinter({});
//     };
//
//     const handleChangeHostAndPort = (params: string) => (text: string) =>
//         setSelectedPrinter((prev) => ({
//             ...prev,
//             device_name: "Net Printer",
//             [params]: text,
//             printerType: "net",
//         }));
//
//     const _renderNet = () => (
//         <View style={{ paddingVertical: 16 }}>
//             <View style={styles.rowDirection}>
//                 <Text>Host: </Text>
//                 <TextInput
//                     placeholder="192.168.100.19"
//                     onChangeText={handleChangeHostAndPort("host")}
//                 />
//             </View>
//             <View style={styles.rowDirection}>
//                 <Text>Port: </Text>
//                 <TextInput
//                     placeholder="9100"
//                     onChangeText={handleChangeHostAndPort("port")}
//                 />
//             </View>
//         </View>
//     );
//
//     const _renderOther = () => (
//         <Picker selectedValue={selectedPrinter} onValueChange={setSelectedPrinter}>
//             {devices.map((item: any, index) => (
//                 <Picker.Item
//                     label={item.device_name}
//                     value={item}
//                     key={`printer-item-${index}`}
//                 />
//             ))}
//         </Picker>
//     );
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.section}>
//                 <Text>Select printer type: </Text>
//                 <Picker
//                     selectedValue={selectedValue}
//                     onValueChange={handleChangePrinterType}
//                 >
//                     {Object.keys(printerList).map((item, index) => (
//                         <Picker.Item
//                             label={item.toUpperCase()}
//                             value={item}
//                             key={`printer-type-item-${index}`}
//                         />
//                     ))}
//                 </Picker>
//             </View>
//             <View style={styles.section}>
//                 <Text>Select printer: </Text>
//                 {selectedValue === "net" ? _renderNet() : _renderOther()}
//             </View>
//             <Button
//                 disabled={!selectedPrinter?.device_name}
//                 title="Connect"
//                 onPress={handleConnectSelectedPrinter}
//             />
//             <Button
//                 disabled={!selectedPrinter?.device_name}
//                 title="Print sample"
//                 onPress={handlePrint}
//             />
//             {/*<Loader loading={loading} />*/}
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         padding: 16,
//     },
//     section: {
//         flex: 1,
//     },
//     rowDirection: {
//         flexDirection: "row",
//     },
// });


import React, {useEffect, useState} from "react";
import {
    BluetoothManager,
    BluetoothEscposPrinter,
    BluetoothTscPrinter,
} from "tp-react-native-bluetooth-printer";
import {DeviceEventEmitter, Text, TouchableOpacity, View} from "react-native";

let options = {
    width: 40,
    height: 30,
    gap: 20,
    direction: BluetoothTscPrinter.DIRECTION.FORWARD,
    reference: [0, 0],
    tear: BluetoothTscPrinter.TEAR.ON,
    sound: 0,
    // text: [
    //     {
    //         text: "කාවින්ද දිල්ශාන්",
    //         x: 20,
    //         y: 0,
    //         fonttype: BluetoothTscPrinter.FONTTYPE.FONT_5,
    //         rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
    //         xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
    //         yscal: BluetoothTscPrinter.FONTMUL.MUL_1,
    //     },
    //     // {
    //     //     text: "Second testing text",
    //     //     x: 20,
    //     //     y: 50,
    //     //     fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
    //     //     rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
    //     //     xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
    //     //     yscal: BluetoothTscPrinter.FONTMUL.MUL_1,
    //     // },
    // ],
};

const SampleScan = () => {

    const [devices, setDevices] = useState([]);
    const [boundAddress, setBoundAddress] = useState();
    const [loading, setLoading] = useState();

    useEffect(() => {
        console.log('configure::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::')
        BluetoothManager.isBluetoothEnabled().then(
            (enabled) => {
                console.log('isBLE Enabled::::::::::::::::::::::::' + enabled); // enabled ==> true /false
                bleEnable();
            },
            (err) => {
                console.log(err);
            }
        );

        const subscription = DeviceEventEmitter.addListener(
            BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
            (rsp) => {
                // this._deviceAlreadPaired(rsp); // rsp.devices would returns the paired devices array in JSON string.
                console.log('Pairing devices:::::::::::::::::::::::::' + JSON.stringify(rsp))
            }
        );
        const subscription2 = DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp) => {
            // this._deviceFoundEvent(rsp); // rsp.devices would returns the found device object in JSON string
            console.log('Connected devices::::::::::::::::::::::::::::::' + JSON.stringify(rsp))
        });

        return function cleanup() {
            subscription.remove();
            subscription2.remove();
        }

    }, [])

    const bleEnable = () => {
        console.log('ble enable function start:::::::::::::::::::::::::::::::::::::::::::::::::')
        BluetoothManager.enableBluetooth().then(
            (r) => {
                var paired = [];
                if (r && r.length > 0) {
                    for (var i = 0; i < r.length; i++) {
                        try {
                            console.log('ble enable function end:::::::::::::::::::::::::::::::::::::::::::::::::')
                            paired.push(JSON.parse(r[i])); // NEED TO PARSE THE DEVICE INFORMATION
                        } catch (e) {
                            //ignore
                        }
                    }
                }
                console.log('Paired devices::::::::::::::::::::::::' + JSON.stringify(paired));
                setDevices(paired)
            },
            (err) => {
                alert(err);
            }
        );

    }

    const connectFunction = (rowData) => {
        BluetoothManager.connect(rowData.address) // the device address scanned.
            .then(
                (s) => {
                   console.log('Connect status:::::::::::::::::::::::::'+JSON.stringify(s))
                    setLoading(false)
                    setBoundAddress(rowData.address)
                },
                (e) => {
                    setLoading(false)
                    console.log(e);
                }
            );
    }

    const textPrint=async ()=>{
        await BluetoothEscposPrinter.printText('jfjdfkdfldjldfjlj', {
            encoding: "UTF-8", // This is Turkish encoding. If you want to print English characters, you don't need to set this option.
            codepage: 13, // This is Turkish codepage. If you want to print English characters, you don't need to set this option.
            // fonttype: 4, // This is default font type.
            // widthtimes: 0, // Text width times
            // heigthtimes: 0, // Text heigth time
        });

    }

    return (
        <View>
            {
                devices.map((items, i) => (
                    <TouchableOpacity key={i} onPress={() => connectFunction(items)}>
                        <Text>{items.name}</Text>
                    </TouchableOpacity>
                ))
            }

            <TouchableOpacity onPress={()=>textPrint()} style={{marginTop:100}}>
                <Text style={{textAlign:'center'}}>print</Text>
            </TouchableOpacity>
        </View>
    )

}
export default SampleScan;

