interface INotificationToggle
{
    enableNotifications: boolean,
    setEnableNotifications: (newState: boolean) => void
}

export function NotificationToggle(props: INotificationToggle)
{
    const enabledButNoPermissions = (
        Notification.permission !== 'granted' &&
        props.enableNotifications
    )
    const colorClass: string = enabledButNoPermissions? "btn-warning" : "";

    function handleToggleNotifications()
    {
        const nextState = !props.enableNotifications;
        if(nextState === true)
        {
            if(Notification.permission !== 'granted')
            {
                Notification.requestPermission().then((permission) => {
                    if(permission === "granted")
                    {
                        console.log("granted")
                    }
                });
            }
        }
        props.setEnableNotifications(nextState)
    }

    return (
        <button 
            className={`${colorClass}`}
            onClick={handleToggleNotifications}
            popover-right={enabledButNoPermissions? "Notifications need to be enabled within the browser" : undefined}
        >
            {props.enableNotifications? "On": "Off"} 
        </button>
    )
}