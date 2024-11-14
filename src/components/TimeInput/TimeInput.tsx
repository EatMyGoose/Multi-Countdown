import React from "react"

export interface ITimeInput
{
    totalSeconds: number
    onTimeChange: (totalSeconds: number) => void
    setValidity: (isValid: boolean) => void
    disabled?: boolean
}

function GetSeconds(totalSeconds: number) : number
{
    return totalSeconds % 60
}

function GetMinutes(totalSeconds: number) : number
{
    return Math.floor(totalSeconds / 60.0)
}

export function TimeInput(props: ITimeInput)
{
    const [minutesText, setMinutesText] = React.useState<string>(GetMinutes(props.totalSeconds).toString())
    const [secondsText, setSecondsText] = React.useState<string>(GetSeconds(props.totalSeconds).toString())
    const [minutesValid, setMinutesValid] = React.useState<boolean>(true);
    const [secondsValid, setSecondsValid] = React.useState<boolean>(true);

    React.useEffect(() => {
        setMinutesText(GetMinutes(props.totalSeconds).toString())
        setSecondsText(GetSeconds(props.totalSeconds).toString())
    }, [props.totalSeconds])

    function handleTimeChange(newMinutesText: string, newSecondsText: string)
    {
        setMinutesText(newMinutesText)
        const newMinutes: number = parseInt(newMinutesText);
        const newMinutesValid: boolean = Number.isInteger(newMinutes) && newMinutes >= 0;

        setSecondsText(newSecondsText);
        const newSeconds: number = parseInt(newSecondsText);
        const newSecondsValid: boolean = (
            Number.isInteger(newSeconds) && 
            newSeconds >= 0 &&
            newSeconds < 60
        )

        const overallValid: boolean = newMinutesValid && newSecondsValid;

        props.setValidity(overallValid);
        setMinutesValid(newMinutesValid);
        setSecondsValid(newSecondsValid);

        if(overallValid)
        {
            const newTotalSeconds: number = newSeconds + newMinutes * 60;
            props.onTimeChange(newTotalSeconds);
        }
    }

    function onMinutesChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        handleTimeChange(e.target.value, secondsText)
    }

    function onSecondsChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        handleTimeChange(minutesText, e.target.value);
    }

    return (
        <div>
            <div className="row flex-middle margin-none">
                <input 
                    value={minutesText}
                    min={0} 
                    step={1}
                    size={3}
                    onChange={onMinutesChange}
                    disabled={props.disabled}
                    className={minutesValid? "" : "background-danger"}
                />
                <span>&nbsp;<strong>:</strong>&nbsp;</span>
                <input 
                    value={secondsText} 
                    min={0} 
                    max={59}
                    size={2}
                    step={1}
                    onChange={onSecondsChange}
                    disabled={props.disabled}
                    className={secondsValid? "" : "background-danger"}
                />
            </div>
        </div>
    )
}
