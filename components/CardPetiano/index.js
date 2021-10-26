import { useState } from 'react'
import styles from '../../styles/components/CardPetiano.module.css'

import { ButtonSideBar } from '../ButtonSideBar'
import { useRouter } from 'next/router'

export function CardPetiano(props){
    const router = useRouter();
    
    
    async function handleButton(){
        router.push({
            pathname: "/Avaliacao",
            query: { 
                petiano: props.petiano.Petiano,
                imagePetiano: props.petiano.Photo
            }
        })

    }

    return(
        <button
            style={props.petiano.Petiano === 'Bruno Angeloti Pires' ? {backgroundColor: '#A4303F'} : {backgroundColor: '#184655'}}
            disabled={props.petiano.Checked} 
            onClick={handleButton} 
            className={styles.cardNames}
        >
            <div className={styles.box}>
                <div className={styles.boxPhoto}>
                    <img className={styles.Photo} src={`${props.petiano.Photo}`} alt="Logo do PET" />
                </div>
                <div className={styles.boxNome}>
                    {props.petiano.Petiano}
                </div>
            </div>
        </button>
    )
}