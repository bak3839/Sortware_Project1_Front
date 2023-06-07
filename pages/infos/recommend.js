import Navigation from "@/components/common/Navigation";
import RecommendForm from "@/components/common/RecommendForm";
import {StatusContext} from "@/pages/infos/StatusContext";
import {useState} from "react";

export default function Recommend (){
    const [status, setStatus] = useState(true);

    return (
        <>
            <StatusContext.Provider value={{status, setStatus}}>
                <Navigation/>
                <RecommendForm />
            </StatusContext.Provider>
        </>
    )
}

