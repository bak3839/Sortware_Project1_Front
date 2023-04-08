import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ArticleNo({article}){
    const router = useRouter();
    const no = Number(router.query.no)

    console.log(article);

    const [boolean, setBoolean] = useState(false);
    console.log(boolean)

    useEffect(()=>{
        
    },[boolean])

    return(
        <>
            {article.map((item, idx)=> (
                <div key={idx}>
                    {console.log(idx)}
                    <h1>{item.name}</h1>
                    <span>{item.date}</span>
                    <p>{item.content}</p>
                    <p>{no}</p>
                </div>
            ))}

            <br />
            <br />
            <br />
            <br />
            <br />
            {boolean &&
                <p>김규민 바보</p>
            }

            <button onClick={()=>setBoolean(!boolean)}>나와랏!</button>
        </>
    )
} 

export async function getServerSideProps(context) {

    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log(context.params.no)
    
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

    // const aaa = axios.get(`/api/article?articleNo=${context.params.no}`);

    const aaa = [
        {
            no: 1,
            name: '다이나믹 라우트1',
            date: '2023-03-24',
            content: 'ksjdasnncajncbakcbnabcmabcmabckabckbvhaojfpowjvoljanljvnaljnclasnldjnsjlkndsjnd'
        },
        {
            name: '다이나믹 라우트2',
            date: '2023-03-24',
            content: 'ksjdasnncajncbakcbnabcmabcmabckabckbvhaojfpowjvoljanljvnaljnclasnldjnsjlkndsjnd'
        },
        {
            name: '다이나믹 라우트3',
            date: '2023-03-24',
            content: 'ksjdasnncajncbakcbnabcmabcmabckabckbvhaojfpowjvoljanljvnaljnclasnldjnsjlkndsjnd'
        },
    ]

    return {
      props: {
        article: aaa
    }, // will be passed to the page component as props
    }
  }