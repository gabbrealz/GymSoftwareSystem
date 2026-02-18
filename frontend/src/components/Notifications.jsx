import { useState, useEffect, useContext } from "react";
import { NotifContext } from "../Context.jsx";

export default function Notifications() {
  const {notifStack} = useContext(NotifContext);

  return (
    <>
      {
        notifStack.map((notif, index) => 
          <Notification key={notif.id} notif={notif} index={index} />
        )
      }
    </>
  );
}

function Notification({ notif, index }) {
  const {setNotifStack} = useContext(NotifContext);
  const [beginRemoval, setBeginRemoval] = useState(false);

  const closeNotif = () => {
    setBeginRemoval(true);
    setTimeout(() => setNotifStack(prev => prev.filter(entry => entry.id !== notif.id)), 250);
  };

  useEffect(() => {
    const timer = setTimeout(closeNotif, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`
      w-1/2 p-2.5 fixed top-4 left-1/2 -translate-x-1/2 text-sm text-white rounded-full shadow-xs shadow-black transition duration-250 animate-entry-slidedown
      ${beginRemoval ? "opacity-0" : ""}
      ${notif.bgcolor}
    `} style={{
      transform: `translateY(${index*6}px) scaleX(${1 - index*0.05})`,
      zIndex: 200-index
    }}>
      <div className="text-center">
        {notif.message}
      </div>
      <button className={`group absolute top-1/2 right-4 -translate-y-1/2 p-1.5 transition-colors ${index === 0 ? "cursor-pointer" : ""}`}
            onClick={index !== 0 ? () => {} : closeNotif}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

    </div>
  );
}