import styles from '../../styles/components/LoadingPetiano.module.css'

export function LoadingPetiano(){
    
    return(
        <div className={styles.boxPetiano}>
            <div className={styles.name}></div>
            <img src="iconTrash.svg" alt="imagem de um gráfico" />                                  
        </div>
    )
}