import { useEffect, useRef } from "react";

export function Loading(){
    const ref = useRef(null);
    
    useEffect(() => {
        import("@lottiefiles/lottie-player");
    }, [])

    return(
        <lottie-player
            id="firstLottie"
            ref={ref}
            autoplay     
            background="transparent"
            loop
            mode="normal"
            src="https://assets4.lottiefiles.com/packages/lf20_x62chJ.json"
            style={{ width: "600px", height: "600px" }}
        ></lottie-player>
    )
}
