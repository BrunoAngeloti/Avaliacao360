import styles from '../../styles/components/BoxProfile.module.css'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { ButtonDate } from '../ButtonDate'
import ReactLoading from 'react-loading';

export function BoxProfile(props){

    const [avaliations, setAvaliations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingButtons, setIsLoadingButtons] = useState(false);
    const buttons = [1,2];
    const [dates, setDates] = useState([])
    const [session] = useSession();
    const router = useRouter();
    const [avalAtual, setAvalAtual] = useState('')

    const avalContent = useRef(null);

    //! carregando as avaliações
    async function loadAvaliations(data){
        setAvalAtual(data)
        setIsLoading(true)
        if(!session){
            router.push('/')
        }else{          
            await fetch('/api/avaliationsPetiano/?' + new URLSearchParams({
                name: session.user.name,
                nameData: data
            }),{                    
                method: 'GET',              
            })
            .then(async(res) => {
                const response = await res.json();
                setAvaliations(response.data);
                setIsLoading(false)
               
                avalContent.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            })  
        }
    }

    //! Carregando as datas
    useEffect(()=>{
        async function loadDatasAvaliation(){
            if(!session){
                router.push('/')
            }else{
                await fetch('/api/avalitionProfile/?' + new URLSearchParams({
                    name: session.user.name,
                }),{                    
                    method: 'GET',              
                })
                .then(async(res) => {
                    if(res.status === 200){
                        const response = await res.json();
                        console.log(response.data)
                        setDates(response.data);
                    }else{
                        alert('ERRO INESPERADO')
                    }
                    setIsLoadingButtons(false)
                })  
            }
        }
        setIsLoadingButtons(true)
        loadDatasAvaliation();
    }, []);

    return(
       <div className={styles.container}>
            <div className={styles.header}>
                <h1>MINHAS AVALIAÇÕES</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.dates}>
                    {isLoadingButtons?
                        buttons?.map(() => { 
                            return (
                                <div className={styles.buttonLoading}>
                                    <ReactLoading type="spin" color='#FFF' height={32} width={32} />
                                </div>
                            )
                        }) :
                        dates?.map((datas) => { 
                            return <ButtonDate callbackParent={() => loadAvaliations(datas)} key={datas} data={datas} atual={avalAtual}/>
                        })
                    }
                </div>
                <div className={styles.rightContent}>
                    <div ref={avalContent} className={styles.boxAvaliation}>
                        {avaliations.length === 0 ? (
                            isLoading
                            ? 
                            <ReactLoading type="spin" color='#000' height={90} width={90} /> 
                            :
                            <h3>Selecione uma avaliação</h3>
                        ) : (
                                isLoading
                                ? 
                                <ReactLoading type="spin" color='#000' height={90} width={90} /> 
                                :                     
                                <div className={styles.boxAvaliationContent}>
                                    <h2>NOTAS</h2>
                                    <div className={styles.boxQuestion}>
                                        <h4>Está engajado com o PET e se empenha para que os resultados do grupo sejam os melhores possíveis?</h4>
                                        <p>{avaliations.pergunta1}</p>
                                    </div>
                                    
                                    <div className={styles.boxQuestion}>
                                        <h4>Sabe definir prioridades para alocar seu tempo de forma a desempenhar várias tarefas simultaneamente de forma eficiente?"</h4>
                                        <p>{avaliations.pergunta2}</p>
                                    </div>
                                    
                                    <div className={styles.boxQuestion}>
                                        <h4>Cumpre seus prazos e busca atingir seus objetivos ao desempenhar seu trabalho?</h4>
                                        <p>{avaliations.pergunta3}</p>
                                    </div>
                                    
                                    <div className={styles.boxQuestion}>
                                        <h4>Demostra preocupação com a qualidade dos resultados ao desempenhar uma tarefa?</h4>
                                        <p>{avaliations.pergunta4}</p>
                                    </div>

                                    <div className={styles.boxQuestion}>
                                        <h4>Não foge das responsabilidades e enfrenta desafios?</h4>
                                        <p>{avaliations.pergunta5}</p>
                                    </div>
                                    
                                    <div className={styles.boxQuestion}>
                                        <h4>Consegue influenciar e motivar os colegas nas atividades?</h4>
                                        <p>{avaliations.pergunta6}</p>
                                    </div>
                                    
                                    <div className={styles.boxQuestion}>
                                        <h4>Busca a imparcialidade e a conciliação quando há desavença de opiniões?</h4>
                                        <p>{avaliations.pergunta7}</p>
                                    </div>
                                    <div className={styles.boxQuestion}>
                                        <h4>Comunica-se bem com o restante do grupo?</h4>
                                        <p>{avaliations.pergunta8}</p>
                                    </div>                          
                                    <div className={styles.boxQuestion}>
                                        <h4>Consegue trabalhar em grupo sem causar conflitos e estimulando a participação coletiva?</h4>
                                        <p>{avaliations.pergunta9}</p>                                 
                                    </div>
                                    
                                    <h2>COMENTÁRIOS</h2>
                                    <div className={styles.boxQuestion}>
                                        <h4>Qual a sua impressão sobre esta pessoa?</h4>
                                        <div className={styles.boxQuestionText}>
                                            <p>{avaliations.pergunta10}</p>   
                                        </div>                                                          
                                    </div>
                                    <div className={styles.boxQuestion}>
                                        <h4>Quais são os seus pontos fortes?</h4>
                                        <div className={styles.boxQuestionText}>
                                            <p>{avaliations.pergunta11}</p>   
                                        </div>  
                                    </div>
                                    <div className={styles.boxQuestion}>
                                        <h4>Onde ele/ela pode melhorar?</h4>
                                        <div className={styles.boxQuestionText}>
                                            <p>{avaliations.pergunta12}</p>   
                                        </div>  
                                    </div>
                                    <div className={styles.boxQuestion}>
                                        <h4>Onde você acha que ele/ela está se prejudicando?</h4>
                                        <div className={styles.boxQuestionText}>
                                            <p>{avaliations.pergunta13}</p>   
                                        </div>  
                                    </div>                              
                                </div>
                        )}
                    </div>
                </div>
            </div>
       </div>
    )
}