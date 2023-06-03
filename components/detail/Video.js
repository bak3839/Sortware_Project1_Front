import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import trailer from '../../pages/trailer.json';
import styled from "styled-components";

const Video = React.memo(() => {
    const router = useRouter();
    const index = router.query.index;
    //const [pageBtn, setPageBtn] = useState(0);
    const [curVideo, setCurVideo] = useState(1);
    const [total, setTotal] = useState(null);
    const [button, setButton] = useState([]);
    const [nowplay, setNowplay] = useState(null);
    const [link, setLink] = useState([]);
    let url = [];

    const buttonArray = () => {
        if(total == null) return;

        const button = [];
        
        for (let i = 1; i <= total; i++) {
            if (i == curVideo) {
                button.push(
                    <button onClick={() => jumpToVideo(i)} className="btnCur">{i}</button>
                );
            }
            else {
                button.push(
                    <button onClick={() => jumpToVideo(i)} className="btn">{i}</button>
                );
            }
        }
        return button;
    };

    const jumpToVideo = (videoNum) => {
        console.log(videoNum);
        setCurVideo(videoNum);
    };

    useEffect(() => {
        if(total == null) return;

        setButton(buttonArray());
        setNowplay(link[curVideo - 1]);
    }, [curVideo, total])

    useEffect(() => {
        url = [];
        let data = trailer.data[index].trailer;
        let path = "https://www.youtube.com/embed/"

        for (let i = 0; i < data.length; i++) {
            url.push(path + data[i].key);          
        }
        console.log(url);

        setLink(url);
        setNowplay(url[0]);
        setTotal(url.length);
    }, []);

    return (
        <div>
            <VideoWrapper>
                <div className="videoBox">
                    <iframe src={nowplay} width="1200" height="700"></iframe>
                </div>
                <div className="btnBox">
                    <span className="btnLine">{button}</span>
                </div>
            </VideoWrapper>
        </div>
    )

})

const VideoWrapper = styled.div`
.videoBox {
    width: 1200px;
    margin: 0 auto;

    iframe {
        border: none;
        margin-top: 10px;
    }
}
button {
    cursor: pointer;
}
.btnBox{
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    margin-top: 5rem;
    gap: 0.5625rem;
    
}
.btnLine{
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    flex-wrap: wrap;
    row-gap: 0.5625rem;
}
.btnShift{
    position: relative;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    min-width: 3.6rem;
    height: 3.6rem;
    border-radius: 50%;
    background-color: rgba(215, 226, 235, 0.5);
    border:0;
    &:hover{
        background-color: rgb(105, 104, 104);
    }
}
.btn {
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    height: 3.6rem;
    padding: 0.3125rem 0.375rem;
    min-width: 3.6rem;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: rgb(38, 55, 71);
    background-color: rgba(215, 226, 235, 0.5);
    white-space: nowrap;
    border:0;
    &:hover{
        background-color: rgb(105, 104, 104);
    }       
}
.btnCur{
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    height: 3.6rem;
    padding: 0.3125rem 0.375rem;
    min-width: 3.6rem;
    text-align: center;
    font-size: 1.5rem;
    white-space: nowrap;
    position: relative;
    z-index: 2;
    font-weight: 700;
    color: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.4) 0px 0.25rem 0.625rem;
    background-color: rgb(0, 0, 0);
    border-radius: 0.375rem !important;
}
`

export default Video;