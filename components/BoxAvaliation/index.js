import styles from '../../styles/components/BoxAvaliations.module.css'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { CardPetiano } from '../CardPetiano'
import { Loading } from '../Loading'
import { CardLoading } from '../CardLoading'

export function BoxAvaliation(props){
    const [isLoading, setIsLoading] = useState(false);
    const [petianos,setPetianos] = useState([]);
    const [avaliation, setAvaliation] = useState(false);
    const [session] = useSession();
    const router = useRouter();
    const petianosLoading = [1,2,3,4,5,6,7,8,9,10];


    async function loadPetianos(data){   
        await fetch('/api/avaliation/?' + new URLSearchParams({
            name: session.user.name,
            nameData: data
        }),{                    
            method: 'GET',              
        })
        .then(async(res) => {
            const response = await res.json();
            let infoResponse = response.data;
            const data = infoResponse?.filter((petiano) => {
                return petiano !== null;
            })
            setAvaliation(true);
            setPetianos(data);
            setIsLoading(false)
        })        
    }




    useEffect(()=>{
        
        async function loadInitialData(){
            setIsLoading(true)
            await fetch('/api/avaliation', {
                method: 'POST',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
                },
            }).then(async(res) => {
                if (res.status === 200) {      
                    const dataAvaliation = await res.json();   
                    localStorage.setItem('DATA_AVALIATION', dataAvaliation.data);
                    loadPetianos(dataAvaliation.data)           
                } else if(res.status === 400) {
                    setAvaliation(false);
                    setIsLoading(false);
                }
            })   
        }
        if(!session){
            router.push('/')
        }else{
            loadInitialData();
        }
    }, []);

    return(
       <div className={styles.container}>        
            <div className={styles.boxText}>
                <h1>AVALIAÇÃO</h1>
            </div>

            <div className={styles.boxNames}>
            {!isLoading ? (
                avaliation ?  
                    petianos?.map((petiano) => {
                        return(
                            <CardPetiano key={petiano.Petiano} petiano={petiano}/>
                        )        
                    }) :
                        <img className={styles.noAvaliation} src="semAvaliacao.svg" alt="imagem de um computador" />            
            ) : (
                petianosLoading?.map((num) => {
                    return(
                        <CardLoading key={num}/>
                    )        
                })
            )}
            </div>        
       </div>
    )
}