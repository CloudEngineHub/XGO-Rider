/**
* Functions to micro:bit xgo Robot Kit by ELECFREAKS Co.,Ltd.
*/
//% color=#8600FF icon="\uf1b0"
//% block="Xgo_Rider" blockId="Xgo_Rider"
namespace xgo {

    export enum PerformanceEnum {

        //% block="normal mode"
        Normal,
        //% block="cyclical pattern1"
        Cyclical1,
        //% block="cyclical pattern2"
        Cyclical2,
    }

    export enum SelectRepeater {

        //% block="on"
        On,
        //% block="off"
        Off,
    }

    export enum CalibrationEnum {

        //% block="enter"
        Enter,
        //% block="complete"
        Complete,
    }

    export enum DirectionEnum {

        //% block="forward"
        Forward,
        //% block="backward"
        Backward,
    }

    export enum LEDNumber {

        //% block="All"
        All,
        //% block="No.1"
        One,
        //% block="No.2"
        Tow,
        //% block="No.3"
        Three,
        //% block="No.4"
        Four,
    }

    export enum LEDColor {

        //% block=red
        Red = 0xFF0000,
        //% block=orange
        Orange = 0xFFA500,
        //% block=yellow
        Yellow = 0xFFFF00,
        //% block=green
        Green = 0x00FF00,
        //% block=blue
        Blue = 0x0000FF,
        //% block=indigo
        Indigo = 0x4b0082,
        //% block=violet
        Violet = 0x8a2be2,
        //% block=purple
        Purple = 0xFF00FF,
        //% block=white
        White = 0xFFFFFF,
        //% block=black
        Black = 0x000000
    }

    export enum AngleEnum {

        //% block="roll"
        Roll,
        //% block="pitch"
        Pitch,
        //% block="yaw"
        Yaw,
    }

    export enum RatateEnum {

        //% block="CW"
        Cw,
        //% block="CCW"
        Ccw,
    }
    

    let headData = 0x5500
    let tailData = 0x00AA
    let headDataH = (headData >> 8) & 0xff;
    let headDataL = (headData >> 0) & 0xff;
    let tailDataH = (tailData >> 8) & 0xff;
    let tailDataL = (tailData >> 0) & 0xff;

    //////////----------------------------------- Basic--------------------------------/////////
    /**
    * TODO: xgo write interface
    */
    function writeCommand(len: number, addr: number, data: number, wait: number) {

        let commands_buffer = pins.createBuffer(len)
        commands_buffer[0] = headDataH
        commands_buffer[1] = headDataL
        commands_buffer[2] = len
        commands_buffer[3] = 0x00
        commands_buffer[4] = addr
        commands_buffer[5] = data
        commands_buffer[6] = ~(len + 0x00 + addr + data)
        commands_buffer[7] = tailDataH
        commands_buffer[8] = tailDataL
        serial.writeBuffer(commands_buffer)

        basic.pause(wait)
    }

    /**
    * TODO: xgo write interface
    */
    function writeThreeCommand(len: number, addr: number, data0: number, data1: number, data2: number, wait: number) {

        let commands_buffer = pins.createBuffer(len)
        commands_buffer[0] = headDataH
        commands_buffer[1] = headDataL
        commands_buffer[2] = len
        commands_buffer[3] = 0x00
        commands_buffer[4] = addr
        commands_buffer[5] = data0
        commands_buffer[6] = data1
        commands_buffer[7] = data2
        commands_buffer[8] = ~(len + 0x00 + addr + data0 + data1 + data2)
        commands_buffer[9] = tailDataH
        commands_buffer[10] = tailDataL
        serial.writeBuffer(commands_buffer)

        basic.pause(wait)
    }

    /**
    * TODO: xgo write interface
    */
    function writeStrCommand(len: number, strlen: number, addr: number, str: string, wait: number) {

        let i = 0
        let errordata = 0
        let commands_buffer = pins.createBuffer(len)
        commands_buffer[0] = headDataH
        commands_buffer[1] = headDataL
        commands_buffer[2] = len
        commands_buffer[3] = 0x00
        commands_buffer[4] = addr

        for(i = 0; i > strlen; i++) {

            commands_buffer[i+5] = parseInt(str.charAt(i))
            errordata += parseInt(str.charAt(i))
        }
        commands_buffer[i++] = ~(len + 0x00 + addr + errordata)
        commands_buffer[i++] = tailDataH
        commands_buffer[i]   = tailDataL
        serial.writeBuffer(commands_buffer)

        basic.pause(wait)
    }


    /**
    * TODO: xgo read interface
    */
    function readCommandOneData(len: number, addr: number, readlen: number, wait: number) {

        let commands_buffer = pins.createBuffer(len)
        commands_buffer[0] = headDataH
        commands_buffer[1] = headDataL
        commands_buffer[2] = len
        commands_buffer[3] = 0x02
        commands_buffer[4] = addr
        commands_buffer[5] = readlen
        commands_buffer[6] = ~(len + 0x02 + addr + readlen)
        commands_buffer[7] = tailDataH
        commands_buffer[8] = tailDataL
        serial.writeBuffer(commands_buffer)
        let read_data_buffer = pins.createBuffer(9)
        read_data_buffer = serial.readBuffer(9)

        return read_data_buffer[5]
    }

    /**
    * TODO: xgo read interface
    */
    function readDoubleCommandOneData(len: number, addr: number, readlen: number, wait: number) {

        let commands_buffer = pins.createBuffer(len)
        commands_buffer[0] = headDataH
        commands_buffer[1] = headDataL
        commands_buffer[2] = len
        commands_buffer[3] = 0x02
        commands_buffer[4] = addr
        commands_buffer[5] = readlen
        commands_buffer[6] = ~(len + 0x02 + addr + readlen)
        commands_buffer[7] = tailDataH
        commands_buffer[8] = tailDataL
        serial.writeBuffer(commands_buffer)
        let read_data_buffer = pins.createBuffer(10)
        read_data_buffer = serial.readBuffer(10)

        return read_data_buffer[5] | read_data_buffer[6]
    }

    /**
    * TODO: initialization xgo motor
    */
    //% group="Basic"
    //% block="Restore initial action"
    //% weight=480
    export function initActionMode() {

        writeCommand(0x09, 0x3E, 0xFF, 1000)
    }

    /**
    * TODO: initialization xgo
    * @param tx describe parameter here, eg: SerialPin.P13
    * @param rx describe parameter here, eg: SerialPin.P14
    */
    //% group="Basic"
    //% block="set XGO TX %tx RX %rx"
    //% weight=500
    export function initXGOSerial(tx: SerialPin, rx: SerialPin) {

        serial.redirect(tx, rx, BaudRate.BaudRate115200)
        initActionMode()
    }

    /**
    * TODO: performance mode
    */
    //% group="Basic"
    //% block="performance mode %mode"
    //% weight=490
    export function performanceMode(mode: PerformanceEnum) {

        let len, addr, data, wait
        len = 0x09
        addr = 0x03
        switch (mode) {

            case PerformanceEnum.Normal :
                data = 0x00
                wait = 1000
                break
            case PerformanceEnum.Cyclical1 :
                data = 0x01
                wait = 1000
                break
            case PerformanceEnum.Cyclical2 :
                data = 0x02
                wait = 1000
                break
        }

        writeCommand(len, addr, data, wait)
    }

    /**
    * TODO: initialization xgo
    * @param str describe parameter here, eg: "XGO_Rider"
    */
    //% group="Basic"
    //% block="Set the Bluetooth name as %str"
    //% weight=450
    export function setBluetooth(str: string) {

        let len, addr, wait
        len = str.length + 8
        addr = 0x13
        wait = 100

        return writeStrCommand(len, str.length, addr, str, wait)
    }

    //% group="Basic"
    //% block="get XGO's current power"
    //% weight=470
    export function batteryStatus(): number {

        let len, addr, readlen, wait
        len = 0x09
        addr = 0x01
        readlen = 0x01
        wait = 0

        return readCommandOneData(len, addr, readlen, wait)
    }

    //% group="Basic"
    //% weight=460
    //%block="get XGO's version"
    export function getVersion(): string {
        let commands_buffer = pins.createBuffer(9)
        commands_buffer[0] = headDataH
        commands_buffer[1] = headDataL
        commands_buffer[2] = 0x09
        commands_buffer[3] = 0x02
        commands_buffer[4] = 0x07
        commands_buffer[5] = 0x00
        commands_buffer[6] = 0xED
        commands_buffer[7] = tailDataH
        commands_buffer[8] = tailDataL
        serial.writeBuffer(commands_buffer)
        let read_data_buffer = pins.createBuffer(9)
        read_data_buffer = serial.readBuffer(18)
        let version = String.fromCharCode(read_data_buffer[5]) + String.fromCharCode(read_data_buffer[6]) + String.fromCharCode(read_data_buffer[7]) + String.fromCharCode(read_data_buffer[8]) + String.fromCharCode(read_data_buffer[9])
        return version
    }

    /**
    * TODO: Set the color of the LED light on the back number to color
    * @param num describe parameter here, eg: LEDNumber.One
    */
    //% group="Basic"
    //% block="Set the color of the LED light on the back %num to $color"
    //% color.shadow="colorNumberPicker"
    //% weight=450
    export function setLEDMode(num: LEDNumber, color: number) {

        let len, addr, data, wait
        len = 0x09

        data = color
        wait = 100
        // switch (color) {

        //     case LEDColor.Red:
        //         data = 0xFF0000
        //         wait = 100
        //         break
        //     case LEDColor.Orange:
        //         data = 0xFFA500
        //         wait = 100
        //         break
        //     case LEDColor.Yellow:
        //         data = 0xFFFF00
        //         wait = 100
        //         break
        //     case LEDColor.Green:
        //         data = 0x00FF00
        //         wait = 100
        //         break
        //     case LEDColor.Blue:
        //         data = 0x0000FF
        //         wait = 100
        //         break
        //     case LEDColor.Indigo:
        //         data = 0x4b0082
        //         wait = 100
        //         break
        //     case LEDColor.Violet:
        //         data = 0x8a2be2
        //         wait = 100
        //         break
        //     case LEDColor.Purple:
        //         data = 0xFF00FF
        //         wait = 100
        //         break
        //     case LEDColor.White:
        //         data = 0xFFFFFF
        //         wait = 100
        //         break
        //     case LEDColor.Black:
        //         data = 0x000000
        //         wait = 100
        //         break
        // }

        if (num == LEDNumber.All) {

            addr = 0x69
            writeThreeCommand(len, addr, ((data >> 16) & 0xff), ((data >> 8) & 0xff), ((data >> 0) & 0xff), wait)
            addr = 0x6A
            writeThreeCommand(len, addr, ((data >> 16) & 0xff), ((data >> 8) & 0xff), ((data >> 0) & 0xff), wait)
            addr = 0x6B
            writeThreeCommand(len, addr, ((data >> 16) & 0xff), ((data >> 8) & 0xff), ((data >> 0) & 0xff), wait)
            addr = 0x6C
            writeThreeCommand(len, addr, ((data >> 16) & 0xff), ((data >> 8) & 0xff), ((data >> 0) & 0xff), wait)
        } else {

            switch (num) {

                case LEDNumber.One:
                    addr = 0x69
                    break
                case LEDNumber.Tow:
                    addr = 0x6A
                    break
                case LEDNumber.Three:
                    addr = 0x6B
                    break
                case LEDNumber.Four:
                    addr = 0x6C
                    break
            }

            writeThreeCommand(len, addr, ((data >> 16) & 0xff), ((data >> 8) & 0xff), ((data >> 0) & 0xff), wait)
        }

    }

    /**
    * TODO: Set the dynamic balance mode
    */
    //% group="Servo"
    //% block="%val Dynamic balancing mode"
    //% weight=400
    export function setBalanceMode(val: SelectRepeater) {

        let len, addr, data, wait
        len = 0x09
        addr = 0x61
        switch (val) {

            case SelectRepeater.On:
                data = 0x01
                break
            case SelectRepeater.Off:
                data = 0x00
                break
        }
        wait = 100

        writeCommand(len, addr, data, wait)
    }

    /**
    * TODO: Set calibration mode
    */
    //% group="Servo"
    //% block="%val calibration mode"
    //% weight=390
    export function setCalibrationMode(val: CalibrationEnum) {

        let len, addr, data, wait
        len = 0x09
        addr = 0x04
        switch (val) {

            case CalibrationEnum.Enter:
                data = 0x01
                break
            case CalibrationEnum.Complete:
                data = 0x00
                break
        }
        wait = 100

        writeCommand(len, addr, data, wait)
    }

    /**
    * TODO: Read value attitude angle
    * @param %val describe parameter here, eg: AngleEnum.Roll
    */
    //% group="Servo"
    //% block="Read %val attitude angle"
    //% weight=380
    export function readAngle(val: AngleEnum) {

        let len, addr, data, wait
        len = 0x09
        switch (val) {

            case AngleEnum.Pitch:
                addr = 0x67
                break
            case AngleEnum.Roll:
                addr = 0x66
                break
            case AngleEnum.Yaw:
                addr = 0x68
                break
        }
        data = 0x02
        wait = 100

        readDoubleCommandOneData(len, addr, data, wait)
    }

    /**
    * TODO: set Rider height
    * @param high describe parameter here, eg: 0
    */
    //% group="Servo"
    //% block="set Rider height %high mm"
    //% high.min=-20 high.max=20
    //% weight=370
    export function setHeight(high: number) {

        let len, addr, data, wait
        len = 0x09
        addr = 0x35
        data = Math.map(high, -20, 20, 0, 255)
        wait = 100

        writeCommand(len, addr, data, wait)
    }

    /**
    * TODO: Adjust the left and right tilt of the fuselage angle °
    * @param angle describe parameter here, eg: 0
    */
    //% group="Servo"
    //% block="Adjust the left and right tilt of the fuselage %angle °"
    //% angle.min=-100 angle.max=100
    //% weight=360
    export function setAngle(angle: number) {

        let len, addr, data, wait
        len = 0x09
        addr = 0x36
        data = Math.map(angle, -100, 100, 0, 255)
        wait = 100

        writeCommand(len, addr, data, wait)
    }

    /**
    * TODO: Move at any speed for any s
    * @param speed describe parameter here, eg: 0
    * @param time describe parameter here, eg: 5
    */
    //% group="Sports"
    //% block="Move %direct at %speed speed for %time s"
    //% speed.min=0 speed.max=100
    //% weight=200
    export function moveRider(direct: DirectionEnum, speed: number, time: number) {

        let len, addr, data, wait
        len = 0x09
        addr = 0x30
        if (direct == DirectionEnum.Forward) {

            speed = speed
        } else if (direct == DirectionEnum.Backward) {

            speed = -speed
        }

        data = Math.map(speed, -100, 100, 0, 255)
        wait = time * 1000

        writeCommand(len, addr, data, wait)

        speed = 0
        data = Math.map(speed, -100, 100, 0, 255)
        wait = 100
        writeCommand(len, addr, data, wait)
    }

    /**
    * TODO: Rotate %direct at %speed speed for %time s
    * @param speed describe parameter here, eg: 0
    * @param time describe parameter here, eg: 5
    */
    //% group="Sports"
    //% block="Rotate %direct at %speed speed for %time s"
    //% speed.min=0 speed.max=100
    //% weight=190
    export function rotateRider(direct: RatateEnum, speed: number, time: number) {

        let len, addr, data, wait
        len = 0x09
        addr = 0x32
        if (direct == RatateEnum.Cw) {

            speed = speed
        } else if (direct == RatateEnum.Ccw) {

            speed = -speed
        }

        data = Math.map(speed, -100, 100, 0, 255)
        wait = time * 1000

        writeCommand(len, addr, data, wait)

        speed = 0
        data = Math.map(speed, -100, 100, 0, 255)
        wait = 100
        writeCommand(len, addr, data, wait)
    }

    /**
    * TODO: Set Rider to perform squatting motion with a period of %time s.
    * @param time describe parameter here, eg: 3
    */
    //% group="Sports"
    //% block="Set Rider to perform squatting motion with a period of %time s"
    //% time.min=2 time.max=4
    //% weight=180
    export function squattingFunc(time: number) {

        let len, addr, data, wait
        len = 0x09
        addr = 0x82

        time = 4 - time
        data = Math.map(time, 0, 2, 1, 255)

        wait = 1000

        writeCommand(len, addr, data, wait)
    }

    /**
    * TODO: Set the Rider to shake left and right with a period of x s.
    * @param time describe parameter here, eg: 3
    */
    //% group="Sports"
    //% block="Set the Rider to shake left and right with a period of %time s"
    //% time.min=2 time.max=4
    //% weight=170
    export function shufflingFunc(time: number) {

        let len, addr, data, wait
        len = 0x09
        addr = 0x39

        time = 4 - time
        data = Math.map(time, 0, 2, 1, 255)

        wait = 1000

        writeCommand(len, addr, data, wait)
    }
}