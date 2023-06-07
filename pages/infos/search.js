import Navigation from "@/components/common/Navigation";
import SearchForm from "@/components/common/SearchForm";
import {StatusContext} from "@/pages/infos/StatusContext";
import {useState} from "react";

export default function Search (){
    const [status, setStatus] = useState(true);

    return (
        <>
            <StatusContext.Provider value={{status, setStatus}}>
                <Navigation/>
            </StatusContext.Provider>
            <SearchForm />
        </>
    )
}