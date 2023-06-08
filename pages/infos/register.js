import Navigation from "@/components/common/Navigation";
import RegisterForm from "@/components/detail/RegisterForm";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {StatusContext} from "@/pages/infos/StatusContext";

export default function Register() {
    const [status, setStatus] = useState(true);

    return (
        <RegisterWrapper>
            <StatusContext.Provider value={{status, setStatus}}>
                <Navigation/>
            </StatusContext.Provider>
            <RegisterForm />
        </RegisterWrapper>
    )
}

const RegisterWrapper = styled.div`
  margin-bottom: 10rem;
`