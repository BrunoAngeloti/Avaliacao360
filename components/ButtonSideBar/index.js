import styles from '../../styles/components/ButtonSideBar.module.css'

export function ButtonSideBar({...props}){
    
    return(
        <> 
            <span className={props.ativado === 'true'? styles.detailsUp : styles.detailsUpDesactived}>
                <div></div>
            </span>
                <button {...props} className={props.ativado === 'true'? styles.buttonNav : styles.buttonNavDesactived}>
                    <img src={`${props.icon}.svg`} alt="icones sidebar" />
                </button>
            <span className={props.ativado === 'true'? styles.detailsDown : styles.detailsDownDesactived}>
                <div></div>
            </span>    
        </>
    )
}