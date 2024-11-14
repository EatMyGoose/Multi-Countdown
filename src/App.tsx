import React from 'react'
import { Countdown } from './components/Countdown/Countdown'
import { ICountdown, ICountdownPOD } from './components/SharedProps/Countdown'
import { useCountdown } from './hooks/useCountdown'
import { NotificationToggle } from './components/NotificationsToggle/NotificationsToggle'

function make_counter(nth_timer: number) : ICountdownPOD
{
  return {
    id: crypto.randomUUID(),
    secondsLeft: 20,
    totalSeconds: 20,

    message: `Timer ${nth_timer}`,
    running: false,
    ended: false
  }
}

function App() {
  const [enableNotifications, setEnableNotifications] = React.useState<boolean>(false);
  const [countdownParams, setCountdownParams] = React.useState<ICountdownPOD[]>([
    make_counter(1)
  ])

  const countdownArr: ICountdown[] = useCountdown(
    countdownParams, 
    setCountdownParams, 
    enableNotifications
  )

  function addCountdown()
  {
    setCountdownParams(oldArr => [...oldArr, make_counter(oldArr.length + 1)])
  }

  return (
    <article className="paper article container padding-top-small">
      <h2 className='padding-top-none margin-top-none margin-bottom-small'>Multi-Countdown</h2>  
      <p>
      <button
        onClick={addCountdown}
      >
        Add Timer
      </button>
      <span>
          <span className='margin-left-small margin-right-small'>
            Notifications:
          </span>
          <NotificationToggle
          enableNotifications={enableNotifications}
          setEnableNotifications={setEnableNotifications}
        />
      </span>
      
      </p>
      {
        countdownArr.map(
          params => {
            return (
              <div 
                key={params.id} 
                className={`paper padding`}
              >
                <Countdown {...params}/>
              </div>
            )
          }
        )
      }
    </article>
  )
}

export default App
