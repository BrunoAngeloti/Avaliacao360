import styles from '../../styles/components/BoxAdm.module.css'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import ReactLoading from 'react-loading';
import Swal from 'sweetalert2'
import { LoadingPetiano } from '../LoadingPetiano'

export function BoxAdm(props){
    const [petianos,setPetianos] = useState([]);
    const [loading, setLoading] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [loadingRegister, setLoadingRegister] = useState(false)
    const [loadingStartAvaliation, setLoadingStartAvaliation] = useState(false)
    const [loadingFinishAvaliation, setLoadingFinishAvaliation] = useState(false)
    const [statusButton, setStatusButton] = useState('Liberado')
    const [session] = useSession();
    const [avaliation, setAvaliation] = useState(false);
    const router = useRouter();

    const petianosLoading = [1,2,3,4,5];

    async function loadPetianos(){
        if(!session){
            router.push('/')
        }else{
            setLoading(true)
            await fetch('/api/adminLoadPetianos/?' + new URLSearchParams({
                name: session.user.name,
            }),{                    
                method: 'GET',              
            })
            .then(async(res) => {
                const response = await res.json();
                let infoResponse = response.data;
                const data = infoResponse?.filter((petiano) => {
                    return petiano !== null;
                })
                setPetianos(data);
                setLoading(false)
            })  
        }
    }

    async function deleteFunction(petiano){
        setLoadingDelete(true)
        await fetch('/api/admin', {
            method: 'DELETE',
            headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: petiano
            }),
        }).then((res) => {
            setLoadingDelete(false)
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
              Toast.fire({
                icon: 'success',
                title: `${petiano} deletado`
              })
            loadPetianos()
        }) 
    }

    async function deletePetiano(petiano){
        Swal.fire({
            icon: 'warning',
            iconColor: "#212121",
            title: `Você deseja excluir o petiano ${petiano}?`,
            showDenyButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Excluir',          
            confirmButtonColor: '#A4303F',
            denyButtonColor: '#184655'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteFunction(petiano)
            } 
        }) 
       
    }

    useEffect(async ()=>{      
        loadPetianos()
        setLoadingRegister(true)
        setLoadingStartAvaliation(true);
        setLoadingFinishAvaliation(true);
        await fetch('/api/admin', {
            method: 'GET',
            headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            },
        }).then(async (res) => {
            if(res.status == 200){
                setAvaliation(false)
            }else{
                setAvaliation(true)
            }
            setLoadingStartAvaliation(false);
            setLoadingFinishAvaliation(false);
        }) 
        await fetch('/api/adminLoadPetianos', {
            method: 'PUT',
            headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            },
        }).then((res) => {
            if(res.status == 200){
                setStatusButton('Liberado')            
            }else if(res.status == 202){
                setStatusButton('Bloqueado')  
            }
        }) 
        setLoadingRegister(false)
    }, []);


    async function startAvaliation(){
        let nameAval = ''
        Swal.fire({
            title: 'Insira o nome da avaliação (exemplo 2020/1)',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showDenyButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonColor:'#184655',
            denyButtonColor: '#A4303F',
            confirmButtonText: 'Iniciar',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
                if(!login){
                    Swal.showValidationMessage(
                        `Preencha o Campo`
                    )
                }else{
                    nameAval = login
                }         
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then(async(result) => {
            if (result.isConfirmed) {
                setLoadingStartAvaliation(true);
                await fetch('/api/admin', {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameAval
                    }),
                }).then((res) => {
                    if(res.status == 200){
                        setAvaliation(true)
                    }
                    setLoadingStartAvaliation(false);
                }) 
            }
        })
    }

    async function finishAvaliation(){
        Swal.fire({
            icon: 'warning',
            iconColor: "#212121",
            title: `Você realmente deseja encerrar a avaliação em aberto? Esta ação não tem volta!`,
            showDenyButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Encerrar',          
            confirmButtonColor:'#184655',
            denyButtonColor: '#A4303F'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadingFinishAvaliation(true);
                await fetch('/api/admin', {
                    method: 'PUT',
                    headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cadastro: false
                    }),
                }).then((res) => {
                    if(res.status == 200){
                        setAvaliation(false);
                        
                    }
                    setLoadingFinishAvaliation(false);
                }) 
            } 
        })     
    }

    async function enableRegister(){
        setLoadingRegister(true)
        await fetch('/api/admin', {
            method: 'PUT',
            headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cadastro: true
            }),
        }).then(async(res) => {
            if(res.status == 201){
               let response = await res.json();
               const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
              
                Toast.fire({
                    icon: 'warning',
                    title: `Cadastro ${response.data}`
                })
                setStatusButton(response.data);
            }
            setLoadingRegister(false)
        }) 
    }

    return(
       <div className={styles.container}>
           <div className={styles.header}>
               <h1>ADMINISTRAÇÃO</h1>
           </div>

           <div className={styles.content}>
                <div className={styles.leftContent}>
                    <div className={styles.buttons}>
                        <button disabled={avaliation} onClick={startAvaliation} className={styles.inicia}>                         
                            {!loadingStartAvaliation && <span>Iniciar Avaliação</span>}
                            {loadingStartAvaliation && <ReactLoading type="spin" color='white' height={28} width={28} />}
                        </button>
                        <button disabled={!avaliation} onClick={finishAvaliation} className={styles.finaliza}>                      
                            {!loadingFinishAvaliation && <span>Finalizar Avaliação</span>}
                            {loadingFinishAvaliation && <ReactLoading type="spin" color='#A4303F' height={28} width={28} />}
                        </button>
                    </div>
                    <img src="imgAdm.svg" alt="imagem de um gráfico" />
                </div>
                
                
                <div className={styles.rightContent}> 
                    <div className={styles.boxRightContent}>      
                        <div className={styles.listPetianos}>
                        {!loading ? 
                            petianos?.map((petiano) => {
                                return(
                                    <div key={petiano.Petiano} className={loadingDelete? styles.boxPetianoDisable : styles.boxPetiano}>
                                        <h2>{petiano.Petiano}</h2>
                                        <img onClick={() => deletePetiano(petiano.Petiano)} src="iconTrash.svg" alt="imagem de um gráfico" />                                  
                                    </div>
                                )        
                            }) : 
                            petianosLoading?.map((num) => {
                                return(
                                    <LoadingPetiano key={num}/>
                                )        
                            })
                        }
                        </div>
                        <div className={styles.footer}>
                            <button disabled={loadingRegister} className={statusButton !== 'Liberado' ? styles.buttonLib : styles.buttonBloq} onClick={enableRegister}>
                                {!loadingRegister && 
                                    <span>{statusButton === 'Liberado' ? 'Bloquear Cadastro' : 'Liberar Cadastro'}</span>
                                }
                                {loadingRegister && <ReactLoading type="spin" color='#F4F4F4' height={28} width={28} />}                      
                            </button>
                        </div>  
                    </div>                    
                </div>
           </div>    
       </div>
    )
}