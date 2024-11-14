import { ICountdown, ICountdownPOD } from "../components/SharedProps/Countdown";
import { LinearRandomDistribution, UpdateArrayElement } from "./Util"
import buzzerURL from "../assets/buzzer.mp3"
import React from "react";

type TSetStateType<T> = React.Dispatch<React.SetStateAction<T>>
type TTimerID = number
type TCountdownId = string

//TODO: Change to a React Hook instead
export function useCountdown(
    countdownParams: ICountdownPOD[],
    setCountdownParams: TSetStateType<ICountdownPOD[]>,
    enabledNotifications: boolean,
) : ICountdown[]
{
    const timerIdRef = React.useRef(new Map<TCountdownId, TTimerID>());
    const buzzerRef = React.useRef(new Map<TCountdownId, HTMLAudioElement>());

    function HandleChangeMessage(
        newMessage: string, 
        id: string, 
        setter: TSetStateType<ICountdownPOD[]>): void
    {
        setter(oldArr => {
            const updated = UpdateArrayElement(oldArr, id, (old) => ({
                ...old, 
                message: newMessage}
            ));

            return updated;
        })
    }

    function HandleChangeTotalSeconds(
        newTotalSeconds: number, 
        id: string, 
        setter: TSetStateType<ICountdownPOD[]>): void
    {
        setter(oldArr => {   
            const updated = UpdateArrayElement(oldArr, id, (old) => ({
                ...old, 
                secondsLeft: newTotalSeconds,
                totalSeconds: newTotalSeconds }
            ));
            return updated;
        });
    }

    function HandleOnStart(
        id: string, 
        setter: TSetStateType<ICountdownPOD[]>): void
    {
        if(timerIdRef.current.has(id)) return;
        
        function tick() 
        {
            setter((oldarr: ICountdownPOD[]) => {
                const updated = UpdateArrayElement(
                    oldarr, id,
                    (old) => {
                        const newSecondsLeft: number = Math.max(old.secondsLeft - 1, 0);
                        return {
                            ...old, 
                            running: true,
                            secondsLeft: newSecondsLeft,
                            ended: newSecondsLeft === 0
                        }
                    }
                )
                return updated;
            })
        }

        const timerId = setInterval(tick, 1000);

        timerIdRef.current.set(id, timerId)

        setter((oldarr: ICountdownPOD[]) => {
            const updated = UpdateArrayElement(
                oldarr, id,
                (old) => ({...old, running: true, ended: false})
            );
            return updated;
        });
    }  
    
    function _removeBuzzer(id: string)
    {
        const buzzer = buzzerRef.current.get(id)
        if(buzzer !== undefined)
        {
            buzzer.pause();
        }
        buzzerRef.current.delete(id)
    }

    function HandleOnPause(id: string, setter: TSetStateType<ICountdownPOD[]>): void
    {
        const timerId = timerIdRef.current.get(id);

        if (timerId === undefined) return;
        
        setter((oldArr) => {
            const updated = UpdateArrayElement(oldArr, id, (old) => ({
                ...old, 
                running: false
            }));
            return updated;
        });

        clearInterval(timerId);
        _removeBuzzer(id);
        
        timerIdRef.current.delete(id);
    }

    function HandleOnReset(id: string, setter: TSetStateType<ICountdownPOD[]>): void
    {
        setter((oldArr) => {
            const updated = UpdateArrayElement(oldArr, id, (old) => {
                _removeBuzzer(id);
                return {
                    ...old, 
                    ended: false,
                    secondsLeft: old.totalSeconds
                }
            });
            return updated;
        });
    }

    function HandleOnDelete(id: string, setter: TSetStateType<ICountdownPOD[]>): void
    {
        HandleOnPause(id, setter);

        setter((oldArr) => oldArr.filter(elem => elem.id !== id));
    }

    function HandleTimerEnd(id: string, enableNotifications: boolean) : void
    {
        if(!buzzerRef.current.has(id))
        {
            let newBuzzer = new Audio(buzzerURL);
            newBuzzer.loop = true
            newBuzzer.playbackRate = LinearRandomDistribution(1, 0.2);
            newBuzzer.play()

            buzzerRef.current.set(id, newBuzzer);
        }

        if(enableNotifications === true) 
        {
            const targetElem = countdownParams.find((elem) => elem.id === id)
            
            if( Notification.permission === "granted" && 
                targetElem !== undefined)
            {    
                new Notification(targetElem.message);
            }
        }
    }

    const countdownArr: ICountdown[] = React.useMemo(() => {
        return countdownParams.map((params) => ({
            ...params,

            onChangeMessage: (newMessage: string, id: string) => HandleChangeMessage(newMessage, id, setCountdownParams),
            onChangeTotalSeconds: (newTotalSeconds: number, id: string) => HandleChangeTotalSeconds(newTotalSeconds, id, setCountdownParams),
        
            onStart: (id: string) => HandleOnStart(id, setCountdownParams),
            onPause: (id: string) => HandleOnPause(id, setCountdownParams),
            onReset: (id: string) => HandleOnReset(id, setCountdownParams),
            onDelete: (id: string) => HandleOnDelete(id, setCountdownParams),

            onTimerEnd: (id: string) => HandleTimerEnd(id, enabledNotifications)
        }))
      }, [countdownParams, enabledNotifications])

    return countdownArr;
}