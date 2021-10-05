import React, {useEffect, useState} from "react";
import {Text, View,TouchableOpacity} from "react-native";
import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
} from "react-native-thermal-receipt-printer";

interface IBLEPrinter {
    device_name: string;
    inner_mac_address: string;
}

const SampleScan = () => {

    const [printers, setPrinters] = useState([]);
    const [currentPrinter, setCurrentPrinter] = useState();

    useEffect(() => {
        BLEPrinter.init().then(() => {
            BLEPrinter.getDeviceList().then(setPrinters);
        });
    }, []);

    const _connectPrinter = (printer) => {
        //connect printer
        BLEPrinter.connectPrinter(printer.inner_mac_address).then(
            setCurrentPrinter,
            error => console.warn(error))
    }

    const printTextTest = () => {
        currentPrinter && BLEPrinter.printText("<C>sample text</C>\n");
    }

    const printBillTest = () => {
        currentPrinter && BLEPrinter.printBill("<C>CHANDRANI</C>");
    }

    return (
        <View style={{flex: 1}}>
            {
                printers.map(printer => (
                    <TouchableOpacity key={printer.inner_mac_address} onPress={() => _connectPrinter(printer)}>
                       <Text>{`device_name: ${printer.device_name}, inner_mac_address: ${printer.inner_mac_address}`}</Text>
                    </TouchableOpacity>
                ))
            }
            <TouchableOpacity onPress={printTextTest}>
                <Text>Print Text</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={printBillTest}>
                <Text>Print Bill Text</Text>
            </TouchableOpacity>
        </View>

    )
}

export default SampleScan;

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