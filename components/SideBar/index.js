import { useState } from 'react'
import { signOut } from 'next-auth/client'
import { useSession } from 'next-auth/client'
import styles from '../../styles/components/SideBar.module.css'

import Swal from 'sweetalert2'
import { ButtonSideBar } from '../ButtonSideBar'

export function SideBar(props){
    const[avaliacao, setAvaliacao] = useState(true)
    const[perfil, setPerfil] = useState(false)
    const[adm, setAdm] = useState(false)
    const [session] = useSession();

    function handleButtonProfile(){
        props.callbackParent('profile')
        setAvaliacao(false);
        setPerfil(true);
        setAdm(false);
    }

    function handleButtonAvaliations(){
        props.callbackParent('avaliation')
        setAvaliacao(true);
        setPerfil(false);
        setAdm(false);
    }

    function handleButtonAdm(){
        props.callbackParent('adm')
        setAvaliacao(false);
        setPerfil(false);
        setAdm(true);
    }

    const handleSignout = (e) => {
        e.preventDefault()
        Swal.fire({
            icon: 'warning',
            iconColor: "#212121",
            title: `Você realmente deseja sair?`,
            showDenyButton: true,
            denyButtonText: 'Ficar',
            confirmButtonText: 'Sair',          
            confirmButtonColor: '#A4303F',
            denyButtonColor: '#184655'
        }).then((result) => {
            if (result.isConfirmed) {
                signOut() 
            } 
        })     
    }

    return(
        <div className={styles.container}>
            <div className={styles.boxLogo}> 
                <img src="LogoPet.svg" alt="Logo do PET" />
            </div>
            
            <div className={styles.buttons}>
                <ButtonSideBar disabled={avaliacao} onClick={handleButtonAvaliations} icon="iconAvaliacao" ativado={`${avaliacao}`}/>
                <ButtonSideBar disabled={perfil} onClick={handleButtonProfile} icon="iconPerfil" ativado={`${perfil}`}/>
                {
                    session?.user?.name === 'Bruno Angeloti Pires' && (
                        <ButtonSideBar disabled={adm} onClick={handleButtonAdm} icon="iconAdm" ativado={`${adm}`}/>
                    )
                }
                
            </div>
            
                
            <button onClick={handleSignout} className={styles.buttonLogout}>SAIR</button>
            
        </div>
    )
}