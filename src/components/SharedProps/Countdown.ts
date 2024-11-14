export interface ICountdownPOD
{
    id: string

    secondsLeft: number
    totalSeconds: number

    message: string
    running: boolean
    ended: boolean
}

export interface ICountdown extends ICountdownPOD
{
    onChangeMessage: (newMessage: string, id: string) => void
    onChangeTotalSeconds: (newTotalSeconds: number, id: string) => void

    onStart: (id: string) => void
    onPause: (id: string) => void
    onReset: (id: string) => void

    onDelete: (id: string) => void

    onTimerEnd: (id: string) => void
}