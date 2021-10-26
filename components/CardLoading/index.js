import styles from '../../styles/components/CardLoading.module.css'
import ReactLoading from 'react-loading';

export function CardLoading(){
    
    return(
        <div className={styles.cardNames}>
            <div className={styles.imagem}></div>
            <div className={styles.nome}></div>
        </div>
    )
}