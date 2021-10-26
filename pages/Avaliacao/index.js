import styles from '../../styles/pages/Avaliacao.module.css'
import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import Swal from 'sweetalert2'
import ReactLoading from 'react-loading';

import { CardRating } from '../../components/CardRating'
import { CardTextPetiano } from '../../components/CardTextPetiano'

export default function Avaliacao(props) {
    const [loading, setLoading] = useState(false)
    const [session] = useSession();
    const router = useRouter();
    const [petiano, setPetiano] = useState('')
    const [imagePetiano, setImagePetiano] = useState('')
    const [result, setResult] = useState()
    const [result2, setResult2] = useState()
    const [result3, setResult3] = useState()
    const [result4, setResult4] = useState()
    const [result5, setResult5] = useState()
    const [result6, setResult6] = useState()
    const [result7, setResult7] = useState()
    const [result8, setResult8] = useState()
    const [result9, setResult9] = useState()
    const [resultText1, setResultText1] = useState('')
    const [resultText2, setResultText2] = useState('')
    const [resultText3, setResultText3] = useState('')
    const [resultText4, setResultText4] = useState('')

    useEffect(()=>{  
        if(!session){
            router.push('/')
        }else{
            setPetiano(router.query.petiano)
            setImagePetiano(router.query.imagePetiano)
        }
    }, []);

    function handleBack(){
        Swal.fire({
            icon: 'warning',
            iconColor: "#212121",
            title: `Você deseja sair da avaliação de ${petiano}?`,
            showDenyButton: true,
            denyButtonText: 'Ficar',
            confirmButtonText: 'Sair',          
            confirmButtonColor: '#A4303F',
            denyButtonColor: '#184655'
        }).then((result) => {
            if (result.isConfirmed) {
                router.back();
            } 
        }) 
    }

    async function handleSubmitForm(){
        let resultados = [
            result, result2, result3, result4,
            result5, result6, result7, result8,
            result9, resultText1, resultText2,
            resultText3, resultText4
         ]

        Swal.fire({
            icon: 'warning',
            iconColor: "#212121",
            title: `Você realmente deseja finalizar a avaliação de ${petiano}?`,
            showDenyButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Finalizar',          
            confirmButtonColor: '#A4303F',
            denyButtonColor: '#184655'
        }).then(async(result) => {
            if (result.isConfirmed) {
                setLoading(true)
                await fetch('/api/avaliationIndividual', {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        petiano: petiano,
                        nameData: localStorage.getItem('DATA_AVALIATION'),
                        data: resultados,
                        avaliador: session.user.name
                    }),
                }).then((res) => {
                    if (res.status === 200) {                     
                        router.back();
                    }
                    else {
                        alert("Problema na avaliação")
                    }
                }) 
                setLoading(false)
            } 
        })
        
    }


    return (
        <div className={styles.container}>                      
            <div className={styles.header}>
                <img onClick={handleBack} className={styles.back} src="iconBack.svg" alt="icone de sair" /> 
                <h1>{petiano}</h1>
                <img src={`${imagePetiano}`} alt="Logo do PET" />
            </div>  
            
            <CardRating 
                callbackParent={(result) => setResult(result)}
                title = "Está engajado com o PET e se empenha para que os resultados do grupo sejam os melhores possíveis?"
            />
            
            <CardRating 
                callbackParent={(result) => setResult2(result)}
                title = "Sabe definir prioridades para alocar seu tempo de forma a desempenhar várias tarefas simultaneamente de forma eficiente?"
            />
            
            <CardRating 
                callbackParent={(result) => setResult3(result)}
                title="Cumpre seus prazos e busca atingir seus objetivos ao desempenhar seu trabalho?"
            />

            <CardRating 
                callbackParent={(result) => setResult4(result)}
                title="Demostra preocupação com a qualidade dos resultados ao desempenhar uma tarefa?"
            />
            
            <CardRating 
                callbackParent={(result) => setResult5(result)}
                title="Não foge das responsabilidades e enfrenta desafios?"
            />
            
            <CardRating 
                callbackParent={(result) => setResult6(result)}
                title="Consegue influenciar e motivar os colegas nas atividades?"
            />

            <CardRating 
                callbackParent={(result) => setResult7(result)}
                title="Busca a imparcialidade e a conciliação quando há desavença de opiniões?"
            />
            
            <CardRating
                callbackParent={(result) => setResult8(result)}
                title="Comunica-se bem com o restante do grupo?"
            />
            
            <CardRating 
                callbackParent={(result) => setResult9(result)}
                title="Consegue trabalhar em grupo sem causar conflitos e estimulando a participação coletiva?"
            />

            <CardTextPetiano
                title="Qual a sua impressão sobre esta pessoa?"
                callbackParent={(result) => setResultText1(result)}
            />

            <CardTextPetiano
                title="Quais são os seus pontos fortes?"
                callbackParent={(result) => setResultText2(result)}
            />

            <CardTextPetiano
                title="Onde ele/ela pode melhorar?"
                callbackParent={(result) => setResultText3(result)}
            />

            <CardTextPetiano
                title="Onde você acha que ele/ela está se prejudicando?"
                callbackParent={(result) => setResultText4(result)}
            />

            <button 
                onClick={handleSubmitForm}
                disabled={
                    loading  || 
                    !result  || 
                    !result2 || 
                    !result3 || 
                    !result4 || 
                    !result5 || 
                    !result6 || 
                    !result7 || 
                    !result8 || 
                    !result9 || 
                    !resultText1 || 
                    !resultText2 || 
                    !resultText3 || 
                    !resultText4
                }
            
            >
                {loading && (
                    <ReactLoading type="spin" color='white' height={32} width={32} />
                )}
                {loading && <span>ENVIANDO...</span>}
                {!loading && <span>FINALIZAR</span>}
            </button>
        </div>
    )
}