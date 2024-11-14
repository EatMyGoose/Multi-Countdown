import React from "react"
import { TimeInput } from "../TimeInput/TimeInput"
import { ICountdown } from "../SharedProps/Countdown"

export function Countdown(props: ICountdown)
{
    const [timeValid, setTimeValid] = React.useState<boolean>(true);

    React.useEffect(() => {
        if(props.ended)
        {
            props.onTimerEnd(props.id);
        }
    }, [props.ended])

    function handleTimerReset(_: React.MouseEvent<HTMLButtonElement>)
    {
        props.onReset(props.id)
    }

    function handleMessageChange(_: React.ChangeEvent<HTMLInputElement>)
    {
        props.onChangeMessage(_.target.value, props.id)
    }

    function handleOnDelete(_: React.MouseEvent<HTMLButtonElement>)
    {
        props.onDelete(props.id)
    }

    function handleActionButton(_: React.MouseEvent<HTMLButtonElement>)
    {
        if(props.ended)
        {
            props.onPause(props.id)
            props.onReset(props.id)
        }
        else if(props.running)
        {
            props.onPause(props.id)
        }
        else
        {
            props.onStart(props.id)
        }
    }

    function GetActionText()
    {
        if(props.ended) return "Stop & Reset";
        else if(props.running) return "Pause";
        else return "Start"
    }

    return (
        <>
            <div className="row margin-bottom-none">
                <div className="form-group lg-3 md-4 sm-4">
                    <label>Timer (MM:SS)</label>
                    {props.ended?
                        (<span className="margin-left-small badge success">✓</span>):
                        undefined
                    }
                    <div className="row flex-middle margin-bottom-none">
                        <TimeInput
                            totalSeconds={props.secondsLeft}
                            onTimeChange={(totalSeconds: number) => props.onChangeTotalSeconds(totalSeconds, props.id)}
                            disabled={props.running}
                            setValidity={setTimeValid}
                        />
                    </div>
                </div>
            
                <div className="form-group lg-9 md-8 sm-8">
                    <label>Description</label>
                    <input 
                        className="input-block" 
                        type="text" 
                        value={props.message}
                        onChange={handleMessageChange}
                    />
                </div>
            </div>
            <div className="row margin-bottom-none">
            <button
                onClick={handleActionButton}
                disabled={!timeValid}
            >
                {GetActionText()}
            </button>
            <button
                onClick={handleTimerReset}
            >
                Reset Timer
            </button>
            <button
                onClick={handleOnDelete}
            >
                Delete
            </button>
            </div>
        </>
    )
}