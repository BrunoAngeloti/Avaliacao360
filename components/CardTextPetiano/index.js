import styles from '../../styles/components/CardTextPetiano.module.css'

export function CardTextPetiano(props){

    return(
        <div className={styles.container}>
                <p>{props.title}</p>
           
                <textarea 
                    className={styles.textArea}
                    placeholder={"Digite seu comentario"}
                    onChange={(text) => props.callbackParent(text.target.value)}
                />
            
        </div>
        
    )
}
